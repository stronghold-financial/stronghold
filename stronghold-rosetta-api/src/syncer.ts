
import { Logger } from './utils/logger'

import { Syncer } from './syncer/'
import { connection } from './config/database'

const SLEEP_BETWEEN_SYNC = 20000

const startSyncer = async () => {
  await connection

  const syncer = await Syncer.new()

  for (;;) {
    await syncer.start()
    await new Promise((resolve) => setTimeout(resolve, SLEEP_BETWEEN_SYNC))
  }
}

startSyncer().catch((error) => {
  Logger.error(error)
})
