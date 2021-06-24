import { Entity, PrimaryColumn, Column } from 'typeorm'

/**
 * Key value store to store informations about the indexer and syncer state
 * */
@Entity()
export class Config {
  @PrimaryColumn()
  key!: string

  @Column()
  value!: string
}
