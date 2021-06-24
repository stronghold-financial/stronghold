
// From https://github.com/Level/errors

declare module 'level-errors' {
  class LevelUPError extends Error {}
  class NotFoundError extends LevelUPError {}
  class InitializationError extends LevelUPError {}
  class OpenError extends LevelUPError {}
  class ReadError extends LevelUPError {}
  class WriteError extends LevelUPError {}
  class NotFoundError extends LevelUPError {}
  class EncodingError extends LevelUPError {}

  export default {
    LevelUPError: LevelUPError,
    InitializationError: InitializationError,
    OpenError: OpenError,
    ReadError: ReadError,
    WriteError: WriteError,
    NotFoundError: NotFoundError,
    EncodingError: EncodingError,
  }
}
