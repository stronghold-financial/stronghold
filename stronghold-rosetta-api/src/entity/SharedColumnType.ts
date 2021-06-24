import { ColumnOptions } from 'typeorm'
import { timestamp } from './ValueTransformer'

// Hash stored as hex output
export const Hash: ColumnOptions = {
  length: 64,
  type: 'varchar',
}

export const Timestamp: ColumnOptions = {
  type: 'timestamptz',
  transformer: timestamp,
}
