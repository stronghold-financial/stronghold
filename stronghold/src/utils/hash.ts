
import { StrongholdBlock } from '../primitives/block'
import { StrongholdBlockHeader } from '../primitives/blockheader'

function renderHashHex(hashHex: string | null | undefined): string {
  if (!hashHex) return ''
  return `${hashHex.slice(0, 5)}...${hashHex.slice(-5)}`
}

function renderHash(hash: Buffer | null | undefined): string {
  if (!hash) return ''
  return renderHashHex(hash.toString('hex'))
}

function renderBlockHeaderHash(header: StrongholdBlockHeader | null | undefined): string {
  if (!header) return ''
  return renderHash(header.hash)
}

function renderBlockHash(block: StrongholdBlock | null | undefined): string {
  if (!block) return ''
  return renderHash(block.header.hash)
}

export const HashUtils = {
  renderHashHex,
  renderHash,
  renderBlockHeaderHash,
  renderBlockHash,
}
