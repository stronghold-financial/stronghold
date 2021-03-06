import { StrongholdNode } from '../node'
import { StrongholdSdk } from '../sdk'
import { v4 as uuid } from 'uuid'
import os from 'os'
import path from 'path'
import { StrongholdBlockchain } from '../blockchain'
import { StrongholdTestVerifier } from './verifier'
import { StrongholdTestStrategy } from './strategy'
import { ConfigOptions } from '../fileStores/config'
import { PeerNetwork } from '../network'
import { Syncer } from '../syncer'

export type NodeTestOptions =
  | {
      config?: Partial<ConfigOptions>
      autoSeed?: boolean
    }
  | undefined

/**
 * Used as an easy wrapper for testing the node, and blockchain. Use
 * {@link createNodeTest} to create one to make sure you call the proper
 * test lifecycle methods on the NodeTest
 */
export class NodeTest {
  options: NodeTestOptions

  sdk!: StrongholdSdk
  node!: StrongholdNode
  strategy!: StrongholdTestStrategy
  chain!: StrongholdBlockchain
  peerNetwork!: PeerNetwork
  syncer!: Syncer

  setups = new Array<{
    sdk: StrongholdSdk
    node: StrongholdNode
    strategy: StrongholdTestStrategy
    chain: StrongholdBlockchain
    peerNetwork: PeerNetwork
    syncer: Syncer
  }>()

  constructor(options: NodeTestOptions = {}) {
    this.options = options
  }

  async createSetup(
    options?: NodeTestOptions,
  ): Promise<{
    sdk: StrongholdSdk
    node: StrongholdNode
    strategy: StrongholdTestStrategy
    chain: StrongholdBlockchain
    peerNetwork: PeerNetwork
    syncer: Syncer
  }> {
    if (!options) options = this.options

    const dataDir = path.join(os.tmpdir(), uuid())
    const verifierClass = StrongholdTestVerifier
    const strategyClass = StrongholdTestStrategy

    const sdk = await StrongholdSdk.init({ dataDir, verifierClass, strategyClass })
    const node = await sdk.node({ autoSeed: this.options?.autoSeed })
    const strategy = node.strategy as StrongholdTestStrategy
    const chain = node.chain
    const peerNetwork = node.peerNetwork
    const syncer = node.syncer

    sdk.config.setOverride('bootstrapNodes', [''])
    sdk.config.setOverride('enableListenP2P', false)

    // Allow tests to override default settings
    if (options?.config) {
      for (const key in options.config) {
        const configKey = key as keyof ConfigOptions
        const configValue = options.config[configKey]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sdk.config.setOverride(key as keyof ConfigOptions, configValue as any)
      }
    }

    await node.openDB()

    const setup = { sdk, node, strategy, chain, peerNetwork, syncer }
    this.setups.push(setup)
    return setup
  }

  async setup(): Promise<void> {
    const { sdk, node, strategy, chain, peerNetwork, syncer } = await this.createSetup()

    this.sdk = sdk
    this.node = node
    this.strategy = strategy
    this.chain = chain
    this.peerNetwork = peerNetwork
    this.syncer = syncer
  }

  async teardownEach(): Promise<void> {
    for (const { node } of this.setups) {
      await node.shutdown()
    }
  }

  async teardownAll(): Promise<void> {
    for (const { node } of this.setups) {
      await node.closeDB()
    }
  }
}

/** Call this to create a {@link NodeTest} and ensure its test lifecycle
 * methods are called properly like beforeEach, beforeAll, etc
 */
export function createNodeTest(preserveState = false, options: NodeTestOptions = {}): NodeTest {
  const nodeTest = new NodeTest(options)

  if (preserveState) {
    beforeAll(() => nodeTest.setup(), 10000)
    afterEach(() => nodeTest.teardownEach())
    afterAll(() => nodeTest.teardownAll())
  } else {
    beforeEach(() => nodeTest.setup(), 10000)
    afterEach(() => nodeTest.teardownEach())
    afterEach(() => nodeTest.teardownAll())
  }

  return nodeTest
}
