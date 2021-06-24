import { StrongholdRpcClient, StrongholdSdk } from 'stronghold'
import {
  ColorFlag,
  ColorFlagKey,
  ConfigFlag,
  ConfigFlagKey,
  DataDirFlag,
  DataDirFlagKey,
} from '../../flags'
import { StrongholdCommand } from '../../command'
import jsonColorizer from 'json-colorizer'
import { flags } from '@oclif/command'

export class ShowCommand extends StrongholdCommand {
  static description = `Print out the entire config`

  static flags = {
    [ConfigFlagKey]: ConfigFlag,
    [DataDirFlagKey]: DataDirFlag,
    [ColorFlagKey]: ColorFlag,
    user: flags.boolean({
      description: 'only show config from the users datadir and not overrides',
    }),
    local: flags.boolean({
      default: false,
      description: 'dont connect to the node when displaying the config',
    }),
  }

  async start(): Promise<void> {
    const { flags } = this.parse(ShowCommand)

    const client = await getConnectedClient(this.sdk, flags.local)
    const response = await client.getConfig({ user: flags.user })

    let output = JSON.stringify(response.content, undefined, '   ')
    if (flags.color) output = jsonColorizer(output)
    this.log(output)
  }
}

export async function getConnectedClient(
  sdk: StrongholdSdk,
  local: boolean,
): Promise<StrongholdRpcClient> {
  if (local) {
    const node = await sdk.node()
    await sdk.clientMemory.connect(node)
    await node.openDB()
    return sdk.clientMemory
  }

  await sdk.client.connect()
  return sdk.client
}
