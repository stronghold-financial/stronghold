
import pkg from '../package.json'

export const Package = {
  name: pkg.name,
  license: pkg.license,
  version: pkg.version,
  git: pkg.gitHash,
}
