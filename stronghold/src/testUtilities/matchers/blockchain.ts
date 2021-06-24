
import diff from 'jest-diff'
import { StrongholdBlockchain } from '../../blockchain'
import { StrongholdBlock } from '../../primitives/block'
import { BlockHash } from '../../primitives/blockheader'
import { Nullifier } from '../../primitives/nullifier'
import { makeError, makeResult } from './utils'

function toEqualHash(
  self: BlockHash | null | undefined,
  other: BlockHash | null | undefined,
): jest.CustomMatcherResult {
  let error: string | null = null

  if (!self || !other) {
    error = `Expected or actual == null:\n\nDifference:\n\n${String(diff(self, other))}`
  }

  if (!error && self && other && !self.equals(other)) {
    error = `Hashes do not match:\n\nDifference:\n\n${String(diff(self, other))}`
  }

  return makeError(error, `Expected two serde elements to match, but they didn't`)
}

function toEqualNullifier(self: Nullifier, other: Nullifier): jest.CustomMatcherResult {
  let error: string | null = null

  if (!self || !other) {
    error = `Expected or actual == null:\n\nDifference:\n\n${String(diff(self, other))}`
  }

  if (!error && self && other && !self.equals(other)) {
    error = `Nullifiers do not match:\n\nDifference:\n\n${String(diff(self, other))}`
  }

  return makeError(error, `Expected two serde elements to match, but they didn't`)
}

function toEqualBlock(self: StrongholdBlock, other: StrongholdBlock): jest.CustomMatcherResult {
  let error: string | null = null

  if (!self.header.strategy.blockSerde.equals(self, other)) {
    error = `Blocks do not match:\n\nDifference:\n\n${String(diff(self, other))}`
  }

  return makeError(error, `Expected two blocks to match, but they didn't`)
}

async function toAddBlock(
  self: StrongholdBlockchain,
  other: StrongholdBlock,
): Promise<jest.CustomMatcherResult> {
  const result = await self.addBlock(other)

  if (!result.isAdded) {
    return makeResult(false, `Could not add block: ${String(result.reason)}`)
  }

  return makeResult(true, `Expected to not add block at ${String(other.header.sequence)}`)
}

expect.extend({
  toEqualHash: toEqualHash,
  toEqualNullifier: toEqualNullifier,
  toEqualBlock: toEqualBlock,
  toAddBlock: toAddBlock,
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualNullifier(other: Nullifier): R
      toEqualHash(other: BlockHash | null | undefined): R
      toEqualBlock(block: StrongholdBlock): Promise<R>
      toAddBlock(block: StrongholdBlock): Promise<R>
    }
  }
}
