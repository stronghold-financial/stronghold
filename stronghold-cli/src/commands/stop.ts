import { StrongholdCommand } from '../command'
import { ConnectionError, StrongholdNode } from 'stronghold'
import { RemoteFlags } from '../flags'

export default class StopCommand extends StrongholdCommand {
  static description = 'Stop the node from running'

  static flags = {
    ...RemoteFlags,
  }

  node: StrongholdNode | null = null

  async start(): Promise<void> {
    this.parse(StopCommand)

    await this.sdk.client.connect({ retryConnect: false }).catch((e) => {
      if (e instanceof ConnectionError) this.exit(0)
      throw e
    })

    await this.sdk.client.stopNode()
  }
}
