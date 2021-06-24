
import { DATABASE_CONNECTION_STRING } from '../config'

import { Job, quickAddJob } from 'graphile-worker'
export const JOB_NAME = 'getFundsTask'

export async function FaucetJob(publicKey: string, email: string | undefined): Promise<Job> {
  return await quickAddJob({ connectionString: DATABASE_CONNECTION_STRING }, JOB_NAME, {
    publicKey,
    email,
  })
}
