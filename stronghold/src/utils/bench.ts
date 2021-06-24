
type HRTime = [seconds: number, nanoseconds: number]

function start(): HRTime {
  return process.hrtime()
}

/**
 * @returns milliseconds since start
 */
function end(start: HRTime): number {
  const [sec, nanosec] = process.hrtime(start)
  return sec * 1000 + nanosec / 1e6
}

export const BenchUtils = { start, end }
