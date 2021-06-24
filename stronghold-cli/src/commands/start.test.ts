import { expect as expectCli, test } from '@oclif/test'
import * as strongholdmodule from 'stronghold'

jest.mock('stronghold', () => {
  const originalModule = jest.requireActual('stronghold')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...originalModule,
    PeerNetwork: jest.fn().mockReturnValue({
      peerManager: {
        onConnect: {
          on: jest.fn(),
        },
        onDisconnect: {
          on: jest.fn(),
        },
      },
      onIsReadyChanged: {
        on: jest.fn(),
      },
      start: jest.fn(),
    }),
  }
})

describe('start command', () => {
  let isFirstRun = true
  let hasGenesisBlock = false

  const verifier = {
    blockMatchesTrees: jest
      .fn()
      .mockReturnValue(Promise.resolve({ valid: true, reason: null })),
  }

  const chain = {
    verifier: verifier,
    hasGenesisBlock: hasGenesisBlock,
  }

  const setConfig = jest.fn()
  const setOverrideConfig = jest.fn()
  const start = jest.fn()
  const waitForShutdown = jest.fn()

  const strongHoldSdkBackup = strongholdmodule.StrongholdSdk.init

  beforeEach(() => {
    const configOptions = {
      enableTelemetry: false,
      nodeName: '',
      isWorker: false,
      bootstrapNodes: [],
    }

    const internalOptions = {
      isFirstRun,
    }

    const config = {
      save: jest.fn(),
      set: setConfig,
      setOverride: setOverrideConfig,
      get: jest.fn().mockImplementation((config: 'enableTelemetry') => configOptions[config]),
      getArray: jest
        .fn()
        .mockImplementation((config: 'enableTelemetry') => configOptions[config]),
    }

    const internal = {
      save: jest.fn(),
      set: setConfig,
      get: jest.fn().mockImplementation((config: 'isFirstRun') => internalOptions[config]),
    }

    const accounts = {
      accountExists: jest.fn(),
      getDefaultAccount: jest.fn(),
    }

    const peerNetwork = {
      localPeer: {
        publicIdentity: 'identity',
      },
    }

    const node = {
      start,
      networkBridge: { attachPeerNetwork: jest.fn() },
      waitForShutdown,
      openDB: jest.fn(),
      closeDB: jest.fn(),
      accounts: accounts,
      peerNetwork: peerNetwork,
      config: config,
      internal: internal,
      chain: chain,
    }

    strongholdmodule.StrongholdSdk.init = jest.fn().mockImplementation(() => ({
      clientMemory: { connect: jest.fn(), createAccount: jest.fn() },
      node: jest.fn().mockReturnValue(node),
      config: config,
      internal: internal,
    }))
  })

  afterEach(() => {
    setConfig.mockReset()
    setOverrideConfig.mockReset()
    start.mockReset()
    Strongholdmodule.StrongholdSdk.init = strongHoldSdkBackup
  })

  describe('First run', () => {
    test
      .stdout()
      .command(['start'])
      .exit(0)
      .it('show the telemetry message, generate the genesis block', (ctx) => {
        // welcome message
        expectCli(ctx.stdout).include(`Peer Identity`)
        // telemetry
        expectCli(ctx.stdout).include(
          `To help improve Stronghold, opt in to collecting telemetry`,
        )
        expect(setConfig).toHaveBeenCalledWith('isFirstRun', false)
        // start the node
        expect(start).toHaveBeenCalled()
        expect(waitForShutdown).toHaveBeenCalled()
      })
  })

  describe('second run', () => {
    beforeAll(() => {
      isFirstRun = false
      chain.hasGenesisBlock = true
    })
    test
      .stdout()
      .command(['start'])
      .exit(0)
      .it('show the telemetry message, generate the genesis block', (ctx) => {
        // welcome message
        expectCli(ctx.stdout).include(`Peer Identity`)
        expect(setConfig).toHaveBeenCalledTimes(0)
        // start the node
        expect(start).toHaveBeenCalled()
        expect(waitForShutdown).toHaveBeenCalled()
      })
  })

  describe('Filters out empty string bootstrap nodes', () => {
    beforeAll(() => {
      isFirstRun = false
      hasGenesisBlock = true
    })
    test
      .stdout()
      .command(['start', '-b', ''])
      .exit(0)
      .it('Calls setOverride with an empty array', () => {
        expect(setOverrideConfig).toHaveBeenCalledWith('bootstrapNodes', [])
      })
  })
})
