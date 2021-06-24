import { flags } from '@oclif/command'
import { RemoteFlags } from '../../flags'
import { StrongholdCommand } from '../../command'
import { getConnectedClient } from './show'

export class SetCommand extends StrongholdCommand {
  static description = `Set a value in the config`

  static args = [
    {
      name: 'name',
      parse: (input: string): string => input.trim(),
      required: true,
      description: 'name of the config item',
    },
    {
      name: 'value',
      parse: (input: string): string => input.trim(),
      required: true,
      description: 'value of the config item',
    },
  ]

  static flags = {
    ...RemoteFlags,
    local: flags.boolean({
      default: false,
      description: 'dont connect to the node when updating the config',
    }),
  }

  static examples = [
    '$ stronghold config:set bootstrapNodes "test.bn1.stronghold.network,example.com"',
  ]

  async start(): Promise<void> {
    const { args, flags } = this.parse(SetCommand)
    const name = args.name as string
    const value = args.value as string

    const client = await getConnectedClient(this.sdk, flags.local)
    await client.setConfig({ name, value })

    this.exit(0)
  }
}
