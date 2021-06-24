import { NodeFileProvider } from './fileSystems'
import { StrongholdSdk } from './sdk'
import os from 'os'
import { Config } from './fileStores'
import { Accounts } from './account'
import { StrongholdIpcClient } from './rpc'
import { StrongholdNode } from './node'
import { Platform } from './platform'

describe('StrongholdSdk', () => {
  it('should initialize an SDK', async () => {
    const dataDir = os.tmpdir()

    const fileSystem = new NodeFileProvider()
    await fileSystem.init()

    const sdk = await StrongholdSdk.init({
      configName: 'foo.config.json',
      dataDir: dataDir,
      fileSystem: fileSystem,
    })

    expect(sdk.config).toBeInstanceOf(Config)
    expect(sdk.client).toBeInstanceOf(StrongholdIpcClient)
    expect(sdk.fileSystem).toBe(fileSystem)

    expect(sdk.config.storage.dataDir).toBe(dataDir)
    expect(sdk.config.storage.configPath).toContain('foo.config.json')
  })

  it('should detect platform defaults', async () => {
    const sdk = await StrongholdSdk.init({ dataDir: os.tmpdir() })
    const runtime = Platform.getRuntime()

    expect(sdk.fileSystem).toBeInstanceOf(NodeFileProvider)
    expect(runtime.type).toBe('node')
  })

  it('should create a node', async () => {
    const fileSystem = new NodeFileProvider()
    await fileSystem.init()

    const sdk = await StrongholdSdk.init({
      configName: 'foo.config.json',
      dataDir: os.tmpdir(),
      fileSystem: fileSystem,
    })

    const node = await sdk.node({ databaseName: 'foo' })

    expect(node).toBeInstanceOf(StrongholdNode)
    expect(node.files).toBe(fileSystem)
    expect(node.config).toBe(sdk.config)
    expect(node.accounts).toBeInstanceOf(Accounts)
    expect(node.config.get('databaseName')).toBe('foo')
  })
})
