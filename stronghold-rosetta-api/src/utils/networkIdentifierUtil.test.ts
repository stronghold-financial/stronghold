
import { isValidNetworkIdentifier } from './networkIdentifierUtil'
import { networkIdentifier } from '../config'

describe('isValidNetworkIdentifier util', () => {
  it(`returns false if it's not valid`, () => {
    expect(
      isValidNetworkIdentifier({ blockchain: 'this is not stronghold', network: 'staging' }),
    ).toBe(false)
  })

  it(`returns true if it's valid`, () => {
    expect(isValidNetworkIdentifier(networkIdentifier)).toBe(true)
  })
})
