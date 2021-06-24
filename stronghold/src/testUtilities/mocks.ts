
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export function mockEvent(): any {
  return { on: jest.fn() }
}

export function mockAccounts(): any {
  return {
    onBroadcastTransaction: mockEvent(),
  }
}

export function mockChain(): any {
  return {
    head: { hash: 'mockhash', sequence: 1, work: BigInt(0) },
    synced: true,
  }
}

export function mockStrategy(): any {
  return {}
}

export function mockNode(): any {
  return {
    accounts: mockAccounts(),
    miningDirector: mockDirector(),
    syncer: mockSyncer(),
  }
}

export function mockPeerNetwork(): any {
  return {}
}

export function mockDirector(): any {
  return {
    onNewBlock: mockEvent(),
  }
}

export function mockSyncer(): any {
  return {
    addNewBlock: jest.fn(),
  }
}
