import { StrongholdCommand } from '../../command'
import { RemoteFlags } from '../../flags'

export class ListCommand extends StrongholdCommand {
  static description = `List all the accounts on the node`

  static flags = {
    ...RemoteFlags,
  }

  async start(): Promise<void> {
    this.parse(ListCommand)

    await this.sdk.client.connect()

    const response = await this.sdk.client.getAccounts()

    if (response.content.accounts.length === 0) {
      this.log('you have no accounts')
    }

    for (const name of response.content.accounts) {
      this.log(name)
    }
  }
}
