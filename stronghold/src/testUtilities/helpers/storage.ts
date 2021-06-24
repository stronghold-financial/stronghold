
import { IDatabase, LevelupDatabase } from '../../storage'
import leveldown from 'leveldown'

/** Generate a test database name from the given test if not provided*/
export function makeDbName(): string {
  const id = (Math.random() * Number.MAX_SAFE_INTEGER).toFixed(0)
  return expect.getState().currentTestName + '-' + id
}

/**Init a database with the given name, or generate one from the current test */
export function makeDb(name?: string): IDatabase {
  if (!name) name = makeDbName()
  return new LevelupDatabase(leveldown(`./testdbs/${name}`))
}

export function makeDbPath(name?: string): string {
  if (!name) name = makeDbName()
  return `./testdbs/${name}`
}
