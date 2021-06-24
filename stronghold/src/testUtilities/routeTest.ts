import { StrongholdNode } from '../node'
import { StrongholdSdk } from '../sdk'
import { MemoryAdapter } from '../rpc/adapters'
import { StrongholdMemoryClient } from '../rpc/clients'
import { NodeTest } from './nodeTest'
import { StrongholdBlockchain } from '../blockchain'
import { StrongholdTestStrategy } from './strategy'
import { PeerNetwork } from '../network/peerNetwork'
import { Syncer } from '../syncer'

/**
 * Used as an easy wrapper for an RPC route test. Use {@link createRouteTest}
 * to create one to make sure you call the proper test lifecycle methods on
 * the RouteTest
 */
export class RouteTest extends NodeTest {
  adapter!: MemoryAdapter
  client!: StrongholdMemoryClient

  async createSetup(): Promise<{
    sdk: StrongholdSdk
    node: StrongholdNode
    strategy: StrongholdTestStrategy
    chain: StrongholdBlockchain
    peerNetwork: PeerNetwork
    syncer: Syncer
    adapter: MemoryAdapter
    client: StrongholdMemoryClient
  }> {
    const setup = await super.createSetup()

    const client = new StrongholdMemoryClient()
    await client.connect(setup.node)
    const adapter = client.adapter

    return { ...setup, adapter, client }
  }

  async setup(): Promise<void> {
    const {
      sdk,
      node,
      strategy,
      chain,
      peerNetwork,
      syncer,
      client,
      adapter,
    } = await this.createSetup()

    this.sdk = sdk
    this.node = node
    this.strategy = strategy
    this.chain = chain
    this.syncer = syncer
    this.peerNetwork = peerNetwork
    this.client = client
    this.adapter = adapter
  }
}

/** Call this to create a {@link RouteTest} and ensure its test lifecycle
 * methods are called properly like beforeEach, beforeAll, etc
 */
export function createRouteTest(): RouteTest {
  const routeTest = new RouteTest()
  beforeAll(() => routeTest.setup(), 10000)
  afterEach(() => routeTest.teardownEach())
  afterAll(() => routeTest.teardownAll())
  return routeTest
}
