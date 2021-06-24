import { StrongholdCommand } from '../../command'
import { LocalFlags } from '../../flags'

export default class Show extends StrongholdCommand {
  static description = 'Show the heaviest chain'

  static flags = {
    ...LocalFlags,
  }

  async start(): Promise<void> {
    this.parse(Show)

    this.log(`Getting the chain blocks...`)
    await this.sdk.client.connect()
    const data = await this.sdk.client.getChain()
    data.content.content.forEach((content) => this.log(content))
  }
}
