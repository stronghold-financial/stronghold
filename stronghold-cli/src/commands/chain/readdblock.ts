import { StrongholdCommand } from '../../command'
import { LocalFlags } from '../../flags'
import cli from 'cli-ux'

export default class ReAddBlock extends StrongholdCommand {
  static description =
    'Remove and readd a block on the chain if it has no other blocks after it'

  static hidden = true

  static flags = {
    ...LocalFlags,
  }

  static args = [
    {
      name: 'hash',
      parse: (input: string): string => input.trim(),
      required: true,
      description: 'the hash of the block in hex format',
    },
  ]

  async start(): Promise<void> {
    const { args } = this.parse(ReAddBlock)
    const hash = Buffer.from(args.hash as string, 'hex')

    cli.action.start(`Opening node`)
    const node = await this.sdk.node()
    await node.openDB()
    await node.chain.open()
    cli.action.stop('done.')

    const block = await node.chain.getBlock(hash)

    if (!block) {
      this.log(`No block found with hash ${hash.toString('hex')}`)
      this.exit(0)
    }

    await node.chain.removeBlock(hash)
    await node.chain.addBlock(block)

    this.log('Block has been reimported.')
  }
}
