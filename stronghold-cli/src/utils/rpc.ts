
import { isResponseUserError, RequestError } from 'stronghold'

export function hasUserResponseError(error: unknown): error is RequestError {
  return (
    error instanceof RequestError && !!error.response && isResponseUserError(error.response)
  )
}
