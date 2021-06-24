import 'reflect-metadata'
import { createConnection } from 'typeorm'

import ormConfig from '../../ormconfig'
import { Block, Config, Transaction } from '../entity'

export const connection = createConnection({
  ...ormConfig,
  entities: [Block, Config, Transaction],
  synchronize: true,
  logging: ['error'],
})
