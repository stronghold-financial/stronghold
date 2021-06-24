
declare module 'hex-array' {
  export function toString(
    array: Uint8Array,
    options?: { grouping: number; rowLength: number; uppercase: boolean },
  ): string
  export function fromString(value: string): Uint8Array
}
