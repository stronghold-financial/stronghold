
import { networkIdentifier as networkIdentifierConfig } from '../config'
import { NetworkIdentifier } from '../types'

export const isValidNetworkIdentifier = (networkIdentifier: NetworkIdentifier): boolean => {
  return (
    networkIdentifier.blockchain === networkIdentifierConfig.blockchain &&
    networkIdentifier.network === networkIdentifierConfig.network
  )
}
