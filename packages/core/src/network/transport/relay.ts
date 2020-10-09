import debug from 'debug'
const log = debug('hopr-core:transport')
const error = debug('hopr-core:transport:error')
const verbose = debug('hopr-core:verbose:transport:error')

import AbortController from 'abort-controller'
import { AbortError } from 'abortable-iterator'
import chalk from 'chalk'
import libp2p from 'libp2p'
import type { WebRTCUpgrader } from './webrtc'
import type BL from 'bl'

declare interface Handshake {
  reader: {
    next(bytes: number): Promise<BL>
  }
  writer: {
    end(): void
    push(msg: Uint8Array)
  }
  stream: Stream
  rest(): void
  write(msg: Uint8Array): void
  read(): Promise<BL>
}

const handshake: (stream: Stream) => Handshake = require('it-handshake')

import Multiaddr from 'multiaddr'
import PeerInfo from 'peer-info'
import PeerId from 'peer-id'

import {
  RELAY_CIRCUIT_TIMEOUT,
  RELAY_REGISTER,
  OK,
  FAIL,
  FAIL_COULD_NOT_REACH_COUNTERPARTY,
  DELIVERY_REGISTER
} from './constants'

import { pubKeyToPeerId } from '../../utils'
import { u8aCompare, u8aEquals } from '@hoprnet/hopr-utils'

import { RelayContext } from './relayContext'

import { RelayConnection } from './relayConnection'

import type {
  Connection,
  Dialer,
  DialOptions,
  Handler,
  MultiaddrConnection,
  PeerRouting,
  Registrar,
  Stream
} from './types'

class Relay {
  private _dialer: Dialer
  private _registrar: Registrar
  private _dht: { peerRouting: PeerRouting } | undefined
  private _peerInfo: PeerInfo
  private _streams: Map<string, { [index: string]: RelayContext }>
  private _webRTCUpgrader?: WebRTCUpgrader

  private connHandler: (conn: MultiaddrConnection) => void | undefined

  constructor(libp2p: libp2p, _connHandler?: (conn: MultiaddrConnection) => void, webRTCUpgrader?: WebRTCUpgrader) {
    this._dialer = libp2p.dialer
    //@ts-ignore
    this._registrar = libp2p.registrar
    //@ts-ignore
    this._dht = libp2p._dht
    this._peerInfo = libp2p.peerInfo

    this.connHandler = _connHandler

    this._streams = new Map<string, { [index: string]: RelayContext }>()

    // if (webRTCUpgrader != null) {
    //   this._webRTCUpgrader = webRTCUpgrader
    // }

    libp2p.handle(RELAY_REGISTER, this.handleRelay.bind(this))
    libp2p.handle(DELIVERY_REGISTER, this.handleRelayConnection.bind(this))
  }

  async establishRelayedConnection(
    ma: Multiaddr,
    relays: PeerInfo[],
    options?: DialOptions
  ): Promise<MultiaddrConnection> {
    const destination = PeerId.createFromCID(ma.getPeerId())

    if (options?.signal?.aborted) {
      throw new AbortError()
    }

    const potentialRelays = relays.filter((relay: PeerInfo) => !relay.id.equals(this._peerInfo.id))

    if (potentialRelays.length == 0) {
      throw Error(`Filtered list of relays and there is no one left to establish a connection. `)
    }

    for (let i = 0; i < potentialRelays.length; i++) {
      let relayConnection: Connection
      try {
        relayConnection = await this.connectToRelay(potentialRelays[i], options)
      } catch (err) {
        error(err)
        continue
      }

      let stream: Stream
      try {
        stream = await this.performHandshake(relayConnection, potentialRelays[i].id, destination)
      } catch (err) {
        error(err)
        continue
      }

      log(`relayed connection established`)
      // @ts-ignore
      return new RelayConnection({
        stream,
        self: this._peerInfo.id,
        counterparty: destination
        // webRTC: this._webRTCUpgrader?.upgradeOutbound(),
      })
    }

    throw Error(
      `Unable to establish a connection to any known relay node. Tried ${chalk.yellow(
        potentialRelays.map((potentialRelay: PeerInfo) => potentialRelay.id.toB58String()).join(`, `)
      )}`
    )
  }

  async handleReRegister() {}

  async handleRelayConnection(conn: Handler): Promise<void> {
    const { stream, counterparty } = await this.handleHandshake(conn.stream)

    if (stream == null) {
      return
    }

    this.connHandler?.(
      // @ts-ignore
      new RelayConnection({
        stream,
        self: this._peerInfo.id,
        counterparty
        // webRTC: this._webRTCUpgrader?.upgradeInbound(),
      })
    )
    log(`counterparty relayed connection established`)
  }

  private async connectToRelay(relay: PeerInfo, options?: DialOptions): Promise<Connection> {
    let relayConnection = this._registrar.getConnection(relay)

    if (relayConnection == null) {
      try {
        relayConnection = await this._dialer.connectToPeer(relay, { signal: options?.signal })
      } catch (err) {
        log(`Could not reach potential relay ${relay.id.toB58String()}. Error was: ${err}`)
        if (this._dht != null && (options == null || options.signal == null || !options.signal.aborted)) {
          let newAddress = await this._dht.peerRouting.findPeer(relay.id)

          try {
            relayConnection = await this._dialer.connectToPeer(newAddress, { signal: options?.signal })
          } catch (err) {
            log(`Dialling potential relay ${relay.id.toB58String()} after querying DHT failed. Error was ${err}`)
          }
        }
      }

      if (options?.signal?.aborted) {
        if (relayConnection != null) {
          try {
            await relayConnection.close()
          } catch (err) {
            error(err)
          }
        }
        throw new AbortError()
      }
    }

    return relayConnection
  }

  private async performHandshake(relayConnection: Connection, relay: PeerId, destination: PeerId): Promise<Stream> {
    let shaker: Handshake
    try {
      shaker = handshake((await relayConnection.newStream([RELAY_REGISTER])).stream)
    } catch (err) {
      throw Error(`failed to establish stream with ${relay.toB58String()}. Error was: ${err}`)
    }

    shaker.write(destination.pubKey.marshal())

    let answer: Buffer | undefined
    try {
      answer = (await shaker.read())?.slice()
      log(`received answer ${new TextDecoder().decode(answer)}`)
    } catch (err) {
      throw Error(`Error while reading answer. Error was ${err}`)
    }

    shaker.rest()

    if (answer == null || !u8aEquals(answer, OK)) {
      throw Error(
        `Could not establish relayed connection to ${chalk.blue(
          destination.toB58String()
        )} over relay ${relay.toB58String()}. Answer was: <${new TextDecoder().decode(answer)}>`
      )
    }

    return shaker.stream
  }

  private async handleHandshake(stream: Stream): Promise<{ stream: Stream; counterparty: PeerId }> {
    let shaker = handshake(stream)

    let pubKeySender: Buffer | undefined
    try {
      pubKeySender = (await shaker.read())?.slice()
    } catch (err) {
      error(err)
    }

    if (pubKeySender == null) {
      error(`Received empty message. Ignoring connection ...`)
      shaker.write(FAIL)
      shaker.rest()
      return
    }

    let counterparty: PeerId
    try {
      counterparty = await pubKeyToPeerId(pubKeySender)
    } catch (err) {
      error(`Could not decode sender peerId. Error was: ${err}`)
      shaker.write(FAIL)
      shaker.rest()
      return
    }

    shaker.write(OK)
    shaker.rest()

    return { stream: shaker.stream, counterparty }
  }
  sender

  private async handleRelay({ stream, connection }: Handler) {
    log(`handle relay request`)
    const shaker = handshake(stream)

    let pubKeySender: Buffer | undefined

    try {
      pubKeySender = (await shaker.read())?.slice()
    } catch (err) {
      error(err)
    }

    if (pubKeySender == null) {
      error(
        `Received empty message from peer ${chalk.yellow(connection?.remotePeer.toB58String())} during connection setup`
      )
      shaker.write(FAIL)
      shaker.rest()
      return
    }

    let counterparty: PeerId
    try {
      counterparty = await pubKeyToPeerId(pubKeySender)
      log(`counterparty identified as ${counterparty.toB58String()}`)
    } catch (err) {
      error(
        `Peer ${chalk.yellow(
          connection?.remotePeer.toB58String()
        )} asked to establish relayed connection to invalid counterparty. Error was ${err}. Received message ${pubKeySender}`
      )
      shaker.write(FAIL)
      shaker.rest()
      return
    }

    // @TODO
    if (connection?.remotePeer != null && counterparty.equals(connection.remotePeer)) {
      shaker.write(FAIL)
      shaker.rest()
      return
    }

    let streams: { [index: string]: RelayContext }

    const channelId = getId(connection.remotePeer, counterparty)
    console.log(this._streams)

    if ((streams = this._streams.get(channelId)) == null) {
      log(
        `${connection.remotePeer.toB58String()} to ${counterparty.toB58String()} had no connection. Establishing a new one`
      )

      let forwardingErrThrown = false
      let deliveryStream: Stream

      try {
        deliveryStream = await this.establishForwarding(counterparty)
      } catch (err) {
        forwardingErrThrown = true
        error(err)
      }

      if (forwardingErrThrown || deliveryStream == null) {
        // @TODO end deliveryStream
        shaker.write(FAIL_COULD_NOT_REACH_COUNTERPARTY)
        shaker.rest()

        return
      }

      shaker.write(OK)
      shaker.rest()

      const senderContext = new RelayContext(shaker.stream)
      const counterpartyContext = new RelayContext(deliveryStream)

      senderContext.sink(counterpartyContext.source)
      counterpartyContext.sink(senderContext.source)

      streams = {
        [connection.remotePeer.toB58String()]: senderContext,
        [counterparty.toB58String()]: counterpartyContext
      }

      this._streams.set(channelId, streams)
    } else {
      shaker.write(OK)
      shaker.rest()

      streams[connection.remotePeer.toB58String()].update(shaker.stream)
    }
  }

  private async establishForwarding(counterparty: PeerId) {
    let timeout: any

    let cParty = new PeerInfo(counterparty)

    let newConn = this._registrar.getConnection(cParty)

    if (!newConn) {
      const abort = new AbortController()

      timeout = setTimeout(() => abort.abort(), RELAY_CIRCUIT_TIMEOUT)

      try {
        newConn = await this._dialer.connectToPeer(cParty, { signal: abort.signal })
      } catch (err) {
        if (this._dht != null && !abort.signal.aborted) {
          try {
            cParty = await this._dht.peerRouting.findPeer(cParty.id)

            newConn = await this._dialer.connectToPeer(cParty, { signal: abort.signal })
          } catch (err) {
            clearTimeout(timeout)

            throw Error(
              `Could not establish forwarding connection to ${counterparty.toB58String()} after querying the DHT. Error was: ${err}`
            )
          }
        }

        clearTimeout(timeout)

        throw Error(`Could not establish forwarding connection to ${counterparty.toB58String()}. Error was: ${err}`)
      }
    }

    const { stream: newStream } = await newConn.newStream([DELIVERY_REGISTER])

    timeout && clearTimeout(timeout)

    const toCounterparty = handshake(newStream)

    toCounterparty.write(counterparty.pubKey.marshal())

    let answer: Buffer | undefined
    try {
      answer = (await toCounterparty.read())?.slice()
    } catch (err) {
      throw Error(`Error while trying to decode answer. Error was: ${err}`)
    }

    toCounterparty.rest()

    if (answer == null || !u8aEquals(answer, OK)) {
      throw Error(`Could not relay to peer ${counterparty.toB58String()} because we are unable to deliver packets.`)
    }

    return toCounterparty.stream
  }
}

function getId(a: PeerId, b: PeerId) {
  const cmpResult = u8aCompare(a.pubKey.marshal(), b.pubKey.marshal())

  switch (cmpResult) {
    case 1:
      return `${a.toB58String()}${b.toB58String()}`
    case -1:
      return `${b.toB58String()}${a.toB58String()}`

    default:
      throw Error(`Invalid compare result`)
  }
}

export default Relay
