
export class DuplicateKeyError extends Error {}
export class DatabaseOpenError extends Error {}
export class DatabaseIsOpenError extends DatabaseOpenError {}
export class DatabaseIsLockedError extends DatabaseOpenError {}
