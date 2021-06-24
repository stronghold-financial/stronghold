import { StrongholdCommand } from '../../command'
import { RemoteFlags } from '../../flags'
import { displayStrnAmountWithCurrency, oreToStrn } from 'stronghold'

export class BalanceCommand extends StrongholdCommand {
  static description = `Display the account balance`

  static flags = {
    ...RemoteFlags,
  }

  static args = [
    {
      name: 'account',
      parse: (input: string): string => input.trim(),
      required: false,
      description: 'name of the account to export',
    },
  ]

  async start(): Promise<void> {
    const { args } = this.parse(BalanceCommand)
    const account = args.account as string | undefined

    await this.sdk.client.connect()

    const response = await this.sdk.client.getAccountBalance({
      account: account,
    })

    const { confirmedBalance, unconfirmedBalance } = response.content

    this.log(
      `The account balance is: ${displayStrnAmountWithCurrency(
        oreToStrn(Number(unconfirmedBalance)),
        true,
      )}`,
    )
    this.log(
      `Amount available to spend: ${displayStrnAmountWithCurrency(
        oreToStrn(Number(confirmedBalance)),
        true,
      )}`,
    )
  }
}
