
export type PartialRecursive<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? PartialRecursive<U>[]
    : T[P] extends Record<string, unknown>
    ? PartialRecursive<T[P]>
    : T[P]
}
