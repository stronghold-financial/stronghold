
export class SyncerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SyncerError'
  }
}
