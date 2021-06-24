import { run } from 'graphile-worker'

import { Logger } from '../utils/logger'

import { DATABASE_CONNECTION_STRING } from '../config'
import { getFundsTask } from './FaucetTask'

async function main() {
  const runner = await run({
    connectionString: DATABASE_CONNECTION_STRING,
    concurrency: 1,
    // Install signal handlers for graceful shutdown on SIGINT, SIGTERM, etc
    noHandleSignals: false,
    pollInterval: 1000,
    taskList: {
      getFundsTask,
    },
  })

  await runner.promise
}

main().catch((err) => {
  Logger.error(err)
  process.exit(1)
})
