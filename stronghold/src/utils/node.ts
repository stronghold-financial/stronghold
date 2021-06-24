
import { StrongholdNode } from '../node'
import { DatabaseIsLockedError } from '../storage/database/errors'
import { PromiseUtils } from './promise'

/**
 * Try to open the node DB's and wait until they can be opened
 */
async function waitForOpen(node: StrongholdNode, abort?: () => boolean): Promise<void> {
  let logged = false

  while (!abort || !abort()) {
    try {
      await node.openDB()
      return
    } catch (e) {
      if (e instanceof DatabaseIsLockedError) {
        if (!logged) {
          node.logger.info(
            'Another node is using the database, waiting for that node to close.',
          )
          logged = true
        }

        await PromiseUtils.sleep(500)
        continue
      }

      throw e
    }
  }
}

export const NodeUtils = { waitForOpen }
