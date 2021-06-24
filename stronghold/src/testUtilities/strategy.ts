
import { StrongholdStrategy } from '../strategy'

export class StrongholdTestStrategy extends StrongholdStrategy {
  private _miningReward: number | null = null

  disableMiningReward(): void {
    this._miningReward = 0
  }

  miningReward(sequence: number): number {
    if (this._miningReward !== null) {
      return this._miningReward
    }

    return super.miningReward(sequence)
  }
}
