import { flags } from '@oclif/command'
import { ConfigOptions } from 'stronghold'
import { RemoteFlags } from '../../flags'
import { StrongholdCommand } from '../../command'
import jsonColorizer from 'json-colorizer'
import { getConnectedClient } from './show'

export class GetCommand extends StrongholdCommand {
  static description = `Print out one config value`

  static args = [
    {
      name: 'name',
      parse: (input: string): string => input.trim(),
      required: true,
      description: 'name of the config item',
    },
  ]

  static flags = {
    ...RemoteFlags,
    user: flags.boolean({
      description: 'only show config from the users datadir and not overrides',
    }),
    local: flags.boolean({
      default: false,
      description: 'dont connect to the node when displaying the config',
    }),
    color: flags.boolean({
      default: true,
      allowNo: true,
      description: 'should colorize the output',
    }),
  }

  async start(): Promise<void> {
    const { args, flags } = this.parse(GetCommand)
    const name = (args.name as string).trim()

    const client = await getConnectedClient(this.sdk, flags.local)

    const response = await client.getConfig({
      user: flags.user,
      name: name,
    })

    const key = name as keyof Partial<ConfigOptions>
    if (response.content[key] === undefined) this.exit(0)

    let output = JSON.stringify(response.content[key], undefined, '   ')
    if (flags.color) output = jsonColorizer(output)

    this.log(output)
    this.exit(0)
  }
}
