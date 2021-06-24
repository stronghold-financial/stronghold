
export function makeError(
  error: string | null,
  success: string,
): { pass: boolean; message: () => string } {
  if (error !== null) {
    return {
      pass: false,
      message: () => error,
    }
  } else {
    return {
      pass: true,
      message: () => success,
    }
  }
}

export function makeResult(
  pass: boolean,
  message: string,
): { pass: boolean; message: () => string } {
  return {
    pass: pass,
    message: () => message,
  }
}
