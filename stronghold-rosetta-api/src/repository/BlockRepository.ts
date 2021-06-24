
import { EntityRepository, Repository } from 'typeorm'
import { Block } from '../entity'

@EntityRepository(Block)
export class BlockRepository extends Repository<Block> {
  getFindWhereParams(hash?: string, sequence?: number): { hash?: string; sequence?: number } {
    let where = null
    if (hash) {
      where = { hash }
    }

    if (sequence) {
      where = { sequence }
    }

    if (!where) {
      throw 'Missing hash or sequence param'
    }

    return where
  }
  async findWithInstances(hash?: string, sequence?: number): Promise<Block | null> {
    const where = this.getFindWhereParams(hash, sequence)
    const block = await this.createQueryBuilder('block')
      .leftJoinAndMapOne(
        'block.previousBlock',
        'block',
        'previousBlock',
        'block.previousBlockHash = previousBlock.hash',
      )
      .leftJoinAndSelect('block.transactions', 'transaction')
      .where(where)
      .getOne()
    return block || null
  }

  async getWithInstances(hash?: string, sequence?: number): Promise<Block> {
    const block = await this.findWithInstances(hash, sequence)
    if (!block) {
      throw Error(`Block ${hash || ''} ${sequence || ''} not found`)
    }
    return block
  }
}
