
export type RequestError = Record<string, unknown>
export type RouteError = {
  status: number
  message?: string
}

export const isRouteErrorType = (error: RequestError): error is RouteError =>
  error != null &&
  'status' in error &&
  typeof error.status === 'number' &&
  (!('message' in error) || typeof error.message === 'string')
