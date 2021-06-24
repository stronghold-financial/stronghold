import { StrongholdCommand } from '../../command'
import { RemoteFlags } from '../../flags'

export class WhichCommand extends StrongholdCommand {
  static description = `Show the account currently used.

  By default all commands will use this account when deciding what
  keys to use. If no account is specified as the default, you must
  specify the account in the command using --account <name>`

  static flags = {
    ...RemoteFlags,
  }

  async start(): Promise<void> {
    this.parse(WhichCommand)

    await this.sdk.client.connect()

    const {
      content: {
        accounts: [accountName],
      },
    } = await this.sdk.client.getAccounts({ default: true })

    if (!accountName) {
      this.log(
        'There is currently no account being used.\n' +
          ' * Create an account: "stronghold accounts:create"\n' +
          ' * List all accounts: "stronghold accounts:list"\n' +
          ' * Use an existing account: "stronghold accounts:use <name>"',
      )
      this.exit(0)
    }

    this.log(accountName)
  }
}
