import { ConnectionOptions } from 'typeorm'
import {
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_BASE,
} from './src/config'

const config: ConnectionOptions = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_BASE,
}

export default config
