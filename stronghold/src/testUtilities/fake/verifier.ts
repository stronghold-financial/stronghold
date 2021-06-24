
import { Verifier, VerificationResult, VerificationResultReason } from '../../consensus'
import {
  SerializedTestTransaction,
  TestBlock,
  TestBlockHeader,
  TestTransaction,
} from './strategy'

export class TestVerifier extends Verifier<
  string,
  string,
  TestTransaction,
  string,
  string,
  SerializedTestTransaction
> {
  isValidTarget(): boolean {
    return true
  }

  isValidAgainstPrevious(
    current: TestBlock,
    previousHeader: TestBlockHeader,
  ): VerificationResult {
    let result = super.isValidAgainstPrevious(current, previousHeader)

    if (result.reason === VerificationResultReason.INVALID_TARGET) {
      result = { valid: true }
    }

    return result
  }
}
