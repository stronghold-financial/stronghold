
import cli from 'cli-ux'
import { StrongholdCommand } from '../../command'
import { RemoteFlags } from '../../flags'

export class CreateCommand extends StrongholdCommand {
  static description = `Create a new account for sending and receiving coins`

  static args = [
    {
      name: 'name',
      parse: (input: string): string => input.trim(),
      required: false,
      description: 'name of the account',
    },
  ]

  static flags = {
    ...RemoteFlags,
  }

  async start(): Promise<void> {
    const { args } = this.parse(CreateCommand)
    let name = args.name as string

    if (!name) {
      name = (await cli.prompt('Enter the name of the account', {
        required: true,
      })) as string
    }

    await this.sdk.client.connect()

    this.log(`Creating account ${name}`)
    const result = await this.sdk.client.createAccount({ name })

    const { publicAddress, isDefaultAccount } = result.content

    this.log(`Account ${name} created with public address ${publicAddress}`)

    if (isDefaultAccount) {
      this.log(`The default account is now: ${name}`)
    } else {
      this.log(`Run "stronghold accounts:use ${name}" to set the account as default`)
    }
  }
}
