import type { addresses } from '@hoprnet/hopr-ethereum';
import Web3 from 'web3';
import { LevelUp } from 'levelup';
import HoprCoreConnector from '@hoprnet/hopr-core-connector-interface';
import { ChannelFactory } from './channel';
import Ticket from './ticket';
import types from './types';
import Indexer from './indexer';
import * as dbkeys from './dbKeys';
import * as utils from './utils';
import * as constants from './constants';
import { HoprChannels } from './tsc/web3/HoprChannels';
import { HoprToken } from './tsc/web3/HoprToken';
import AccountId from './types/accountId';
export default class HoprEthereum implements HoprCoreConnector {
    db: LevelUp;
    self: {
        privateKey: Uint8Array;
        publicKey: Uint8Array;
        onChainKeyPair: {
            privateKey?: Uint8Array;
            publicKey?: Uint8Array;
        };
    };
    account: AccountId;
    web3: Web3;
    network: addresses.Networks;
    hoprChannels: HoprChannels;
    hoprToken: HoprToken;
    options: {
        debug: boolean;
    };
    private _status;
    private _initializing;
    _onChainValuesInitialized: boolean;
    private _starting;
    private _stopping;
    private _nonce?;
    signTransaction: ReturnType<typeof utils.TransactionSigner>;
    log: ReturnType<typeof utils['Log']>;
    channel: ChannelFactory;
    types: types;
    constructor(db: LevelUp, self: {
        privateKey: Uint8Array;
        publicKey: Uint8Array;
        onChainKeyPair: {
            privateKey?: Uint8Array;
            publicKey?: Uint8Array;
        };
    }, account: AccountId, web3: Web3, network: addresses.Networks, hoprChannels: HoprChannels, hoprToken: HoprToken, options: {
        debug: boolean;
    });
    readonly dbKeys: typeof dbkeys;
    readonly utils: typeof utils;
    readonly constants: typeof constants;
    readonly CHAIN_NAME = "HOPR on Ethereum";
    readonly ticket: typeof Ticket;
    readonly indexer: Indexer;
    /**
     * @returns the current balances of the account associated with this node (HOPR)
     */
    get nonce(): Promise<number>;
    /**
     * Returns the current balances of the account associated with this node (HOPR)
     * @returns a promise resolved to Balance
     */
    get accountBalance(): Promise<import("./types/balance").default>;
    /**
     * Returns the current native balance (ETH)
     * @returns a promise resolved to Balance
     */
    get accountNativeBalance(): Promise<import("./types/nativeBalance").default>;
    /**
     * Initialises the connector, e.g. connect to a blockchain node.
     */
    start(): Promise<void>;
    /**
     * Stops the connector.
     */
    stop(): Promise<void>;
    get started(): boolean;
    /**
     * Initializes the on-chain values of our account.
     * @param nonce optional specify nonce of the account to run multiple queries simultaneously
     */
    initOnchainValues(nonce?: number): Promise<void>;
    /**
     * Initializes connector, insures that connector is only initialized once,
     * and it only resolves once it's done initializing.
     */
    initialize(): Promise<void>;
    /**
     * Checks whether node has an account secret set onchain and offchain
     * @returns a promise resolved true if secret is set correctly
     */
    checkAccountSecret(): Promise<void>;
    /**
     * generate and set account secret
     */
    setAccountSecret(nonce?: number): Promise<void>;
    /**
     * Checks whether web3 connection is alive
     * @returns a promise resolved true if web3 connection is alive
     */
    checkWeb3(): Promise<void>;
    private getDebugAccountSecret;
    static get constants(): typeof constants;
    /**
     * Creates an uninitialised instance.
     *
     * @param db database instance
     * @param seed that is used to derive that on-chain identity
     * @param options.id Id of the demo account
     * @param options.provider provider URI that is used to connect to the blockchain
     * @param options.debug debug mode, will generate account secrets using account's public key
     * @returns a promise resolved to the connector
     */
    static create(db: LevelUp, seed?: Uint8Array, options?: {
        id?: number;
        provider?: string;
        debug?: boolean;
    }): Promise<HoprEthereum>;
}
export declare const Types: typeof types;
export declare const Utils: typeof utils;
