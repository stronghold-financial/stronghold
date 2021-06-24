import { expect as expectCli, test } from '@oclif/test'
import cli from 'cli-ux'
import * as strongholdmodule from 'stronghold'

describe('accounts:pay command', () => {
  let sendTransaction = jest.fn()

  const strongHoldSdkBackup = strongholdmodule.StrongholdSdk.init

  beforeEach(() => {
    sendTransaction = jest.fn().mockReturnValue({ content: {} })

    strongholdmodule.StrongholdSdk.init = jest.fn().mockImplementation(() => ({
      client: {
        connect: jest.fn(),
        getAccountBalance: jest.fn().mockResolvedValue({ content: { confirmedBalance: 1000 } }),
        sendTransaction,
      },
    }))
  })

  afterEach(() => {
    sendTransaction.mockReset()
    strongholdmodule.StrongholdSdk.init = strongHoldSdkBackup
  })

  const fee = 1
  const amount = 2
  const to =
    '997c586852d1b12da499bcff53595ba37d04e4909dbdb1a75f3bfd90dd7212217a1c2c0da652d187fc52ed'
  const from =
    '197c586852d1b12da499bcff53595ba37d04e4909dbdb1a75f3bfd90dd7212217a1c2c0da652d187fc52ed'

  test
    .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
    .stdout()
    .command(['accounts:pay', `-a ${amount}`, `-t ${to}`, `-f ${from}`, `-o ${fee}`])
    .exit(0)
    .it(
      'with every flag: show the right confirmation message and call sendTransaction if valid',
      (ctx) => {
        expectCli(ctx.stdout).include(
          `$STRN  2 ($ORE 200,000,000) plus a transaction fee of $STRN  1 ($ORE 100,000,000) to  ${to} from the account  ${from}`,
        )
        expectCli(ctx.stdout).include(`Transaction Hash`)
        expect(sendTransaction).toBeCalledTimes(1)
      },
    )

  test
    .stub(cli, 'prompt', () => async () => await Promise.resolve(to))
    .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
    .stdout()
    .command(['accounts:pay', `-a ${amount}`, `-f ${from}`, `-o ${fee}`])
    .exit(0)
    .it(
      'without to flag: show the right confirmation message and call sendTransaction if valid',
      (ctx) => {
        expectCli(ctx.stdout).include(`Transaction Hash`)
        expect(sendTransaction).toBeCalledTimes(1)
      },
    )

  test
    .stub(cli, 'prompt', () => async () => await Promise.resolve('not correct address'))
    .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
    .stdout()
    .command(['accounts:pay', `-a ${amount}`, `-f ${from}`])
    .exit(2)
    .it('without account flag: show the right error message', () => {
      expect(sendTransaction).toBeCalledTimes(0)
    })

  test
    .stub(cli, 'prompt', () => async () => await Promise.resolve(3))
    .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
    .stdout()
    .command(['accounts:pay', `-t ${to}`, `-f ${from}`])
    .exit(0)
    .it(
      'without account flag: show the right confirmation message and call sendTransaction if valid',
      (ctx) => {
        expectCli(ctx.stdout).include(
          `$STRN 3.00000000 ($ORE 300,000,000) to  ${to} from the account  ${from}`,
        )
        expectCli(ctx.stdout).include(`Transaction Hash`)
        expect(sendTransaction).toBeCalledTimes(1)
      },
    )

  test
    .stub(cli, 'prompt', () => async () => await Promise.resolve('non right value'))
    .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
    .stdout()
    .command(['accounts:pay', `-t ${to}`, `-f ${from}`])
    .exit(0)
    .it('without account flag: show the right error message', () => {
      expect(sendTransaction).toBeCalledTimes(0)
    })

  test
    .stub(cli, 'confirm', () => async () => await Promise.resolve(false))
    .stdout()
    .command(['accounts:pay', `-a ${amount}`, `-t ${to}`, `-f ${from}`, `-o ${fee}`])
    .exit(0)
    .it('aborts correctly', () => {
      expect(sendTransaction).toBeCalledTimes(0)
    })

  describe('When the API throws an error', () => {
    beforeEach(() => {
      sendTransaction = jest.fn().mockRejectedValue('an error')
    })
    test
      .stub(cli, 'confirm', () => async () => await Promise.resolve(true))
      .stdout()
      .command(['accounts:pay', `-a ${amount}`, `-t ${to}`, `-f ${from}`, `-o ${fee}`])
      .exit(2)
      .it('show the right error message and call sendTransaction', (ctx) => {
        expectCli(ctx.stdout).include(
          `$STRN  2 ($ORE 200,000,000) plus a transaction fee of $STRN  1 ($ORE 100,000,000) to  ${to} from the account  ${from}`,
        )
        expect(sendTransaction).toBeCalledTimes(1)
        expectCli(ctx.stdout).include(`An error occurred while sending the transaction.`)
      })
  })
})
