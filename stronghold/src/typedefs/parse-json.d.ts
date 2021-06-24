
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'parse-json' {
  type Reviver = (this: any, key: string, value: any) => any

  function parse(string: string, filename: string): any
  function parse(string: string, reviver: Reviver, filename: string): any

  export class JSONError extends Error {
    fileName: string
    codeFrame: string
  }

  export default parse
}
