import type Hopr from '@hoprdev/hopr-core'
import { AbstractCommand } from './abstractCommand'

export default class ListConnectedPeers extends AbstractCommand {
  constructor(public node: Hopr) {
    super()
  }

  public name() {
    return 'peers'
  }

  public help() {
    return 'Lists connected and interesting HOPR nodes'
  }

  public async execute(log): Promise<void> {
    return log(await this.node.connectionReport())
  }
}