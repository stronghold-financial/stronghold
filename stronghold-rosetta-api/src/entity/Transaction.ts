import { Entity, PrimaryColumn, Column, Index, ManyToOne } from 'typeorm'
import { Hash, Timestamp } from './SharedColumnType'
import { Block } from './Block'
import { bigint } from './ValueTransformer'

export interface Note {
  commitment: string
}

export interface Spend {
  nullifier: string
}

@Entity()
export class Transaction {
  @PrimaryColumn(Hash)
  hash!: string

  @Column({
    type: 'bigint',
    transformer: bigint,
  })
  fee!: number

  @Column()
  size!: number

  @Column(Timestamp)
  timestamp!: number

  @Index()
  @ManyToOne(() => Block, (block) => block.transactions, { onDelete: 'CASCADE' })
  block!: Block

  @Column('jsonb')
  notes!: Note[]

  @Column('jsonb')
  spends!: Spend[]
}
