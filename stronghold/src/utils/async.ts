
export class AsyncUtils {
  static async materialize<T>(iter: AsyncIterable<T>): Promise<Array<T>> {
    const results = []
    for await (const result of iter) {
      results.push(result)
    }
    return results
  }

  static async count<T>(iter: AsyncIterable<T>): Promise<number> {
    let count = 0
    for await (const _result of iter) ++count
    return count
  }
}
