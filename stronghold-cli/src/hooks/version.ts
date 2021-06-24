
/* eslint-disable no-console */
import { Hook } from '@oclif/config'
import { Package } from 'stronghold'
import { Platform } from 'stronghold'

const VersionHook: Hook<'init'> = (): void => {
  const isVersionCmd = process.argv[2] === 'version'
  const hasDashVersion = process.argv.some((a) => a === '--version')
  const showVersion = isVersionCmd || hasDashVersion

  if (showVersion) {
    const runtime = Platform.getRuntime()

    console.log(`name       ${Package.name}`)
    console.log(`version    ${Package.version}`)
    console.log(`git        ${Package.git || 'src'}`)
    console.log(`runtime    ${runtime.type}/${runtime.runtime}`)

    return process.exit(0)
  }
}

export default VersionHook
