
import diff from 'jest-diff'
import { makeResult } from './utils'

function toEqualBuffer(
  self: Buffer | null | undefined,
  other: Buffer | null | undefined,
): jest.CustomMatcherResult {
  const pass =
    self === other ||
    (self == null && other == null) ||
    (self != null && other != null && self.equals(other))

  if (!pass) {
    return makeResult(
      false,
      `expected buffers to match:\n\n${String(
        diff(self?.toString('hex'), other?.toString('hex')),
      )}`,
    )
  }

  return makeResult(
    true,
    `expected buffers not to match: ${self?.toString('hex') || String(self)}`,
  )
}

expect.extend({ toEqualBuffer: toEqualBuffer })

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualBuffer(other: Buffer | null | undefined): R
    }
  }
}
