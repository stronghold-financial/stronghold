import { ConfigOptions, StrongholdSdk, NodeFileProvider } from 'stronghold'
import { RPC_HOST, RPC_MODE, RPC_PORT } from '../config'

export class RPCClient {
  sdk: StrongholdSdk

  private constructor(sdk: StrongholdSdk) {
    this.sdk = sdk
  }
  static async init(): Promise<RPCClient> {
    const fileSystem = new NodeFileProvider()
    await fileSystem.init()

    const configOverrides: Partial<ConfigOptions> = {}

    configOverrides.logLevel = '*:verbose'
    configOverrides.enableRpcTcp = RPC_MODE === 'tcp'
    configOverrides.rpcTcpHost = RPC_HOST
    configOverrides.rpcTcpPort = Number(RPC_PORT)

    const sdk = await StrongholdSdk.init({
      configOverrides: configOverrides,
    })

    return new RPCClient(sdk)
  }
}
