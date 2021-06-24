
import { StrongholdBlockchain } from '../blockchain'
import {
  StrongholdNoteEncrypted,
  SerializedWasmNoteEncrypted,
  SerializedWasmNoteEncryptedHash,
  WasmNoteEncryptedHash,
} from '../primitives/noteEncrypted'
import { StrongholdTransaction, SerializedTransaction } from '../primitives/transaction'
import { Verifier } from '../consensus'

export class StrongholdTestVerifier extends Verifier<
  StrongholdNoteEncrypted,
  WasmNoteEncryptedHash,
  StrongholdTransaction,
  SerializedWasmNoteEncrypted,
  SerializedWasmNoteEncryptedHash,
  SerializedTransaction
> {
  constructor(chain: StrongholdBlockchain) {
    super(chain)
    this.enableVerifyTarget = false
  }
}
