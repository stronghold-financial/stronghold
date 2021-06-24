import { expect as expectCli, test } from '@oclif/test'

describe('accounts:rescan', () => {
  const contentStream = jest.fn().mockImplementation(function* () {
    yield 0
  })

  beforeAll(() => {
    jest.mock('stronghold', () => {
      const originalModule = jest.requireActual('stronghold')
      const client = {
        connect: jest.fn(),
        rescanAccountStream: jest.fn().mockImplementation(() => ({
          contentStream,
        })),
      }
      const module: typeof jest = {
        ...originalModule,
        StrongholdSdk: {
          init: jest.fn().mockImplementation(() => ({
            client,
            clientMemory: client,
            node: jest.fn().mockImplementation(() => ({
              openDB: jest.fn(),
            })),
          })),
        },
      }
      return module
    })
  })

  afterAll(() => {
    jest.unmock('stronghold')
  })

  describe('with no flags', () => {
    test
      .stdout()
      .command(['accounts:rescan'])
      .exit(0)
      .it('fetches sequences from the client and scans successfully', (ctx) => {
        expect(contentStream).toHaveBeenCalled()
        expectCli(ctx.stdout).include('Scanning Complete')
      })
  })

  describe('with the local flag', () => {
    test
      .stdout()
      .command(['accounts:rescan', '--local'])
      .exit(0)
      .it('fetches sequences from the node and scans successfully', (ctx) => {
        expect(contentStream).toHaveBeenCalled()
        expectCli(ctx.stdout).include('Scanning Complete')
      })
  })
})
