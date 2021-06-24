import { expect as expectCli, test } from '@oclif/test'
import cli from 'cli-ux'
import * as strongholdmodule from 'stronghold'

describe('accounts:create command', () => {
  let createAccount = jest.fn()
  const use = jest.fn()

  const strongHoldSdkBackup = strongholdmodule.StrongholdSdk.init

  beforeEach(() => {
    createAccount = jest.fn().mockReturnValue({ content: {} })
    strongHoldmodule.StrongholdSdk.init = jest.fn().mockImplementation(() => ({
      accounts: {
        use,
        storage: { configPath: '' },
      },
      client: {
        connect: jest.fn(),
        createAccount,
      },
    }))
  })

  afterEach(() => {
    use.mockReset()
    strongholdmodule.StrongholdSdk.init = strongHoldSdkBackup
  })

  const name = 'testaccount'

  test
    .stdout()
    .command(['accounts:create', name])
    .exit(0)
    .it('creates the account', (ctx) => {
      expect(createAccount).toHaveBeenCalledWith({ name })
      expectCli(ctx.stdout).not.include(`The default account is now: ${name}`)
      expect(use).toBeCalledTimes(0)
    })

  test
    .stub(cli, 'prompt', () => async () => await Promise.resolve(name))
    .stdout()
    .command(['accounts:create'])
    .exit(0)
    .it('asks for account name and creates it', (ctx) => {
      expectCli(ctx.stdout).include(`Creating account ${name}`)
      expect(createAccount).toHaveBeenCalledWith({ name })
    })
})
