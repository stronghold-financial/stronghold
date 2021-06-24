import { StrongholdCommand } from '../../command'
import { flags } from '@oclif/command'
import { RemoteFlags } from '../../flags'

export class PublicKeyCommand extends StrongholdCommand {
  static description = `Display or regenerate the account public key`

  static flags = {
    ...RemoteFlags,
    generate: flags.boolean({
      char: 'g',
      default: false,
      description: 'generate the public key',
    }),
  }

  static args = [
    {
      name: 'account',
      parse: (input: string): string => input.trim(),
      required: false,
      description: 'name of the account to get a public key',
    },
  ]

  async start(): Promise<void> {
    const { args, flags } = this.parse(PublicKeyCommand)
    const account = args.account as string | undefined

    await this.sdk.client.connect()

    const response = await this.sdk.client.getAccountPublicKey({
      account: account,
      generate: flags.generate,
    })

    if (!response) {
      this.error(`An error occurred while fetching the public key.`)
    }

    this.log(`Account: ${response.content.account}, public key: ${response.content.publicKey}`)
  }
}
