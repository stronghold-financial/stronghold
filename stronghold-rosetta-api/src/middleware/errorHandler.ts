import { Request, Response, NextFunction } from 'express'

import { RequestError, isRouteErrorType } from '../types/RouteError'

export const errorHandler = (
  error: RequestError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (isRouteErrorType(error)) {
    res.status(error.status).json({
      error: {
        type: 'request_validation',
        message: error.message,
      },
    })
    return
  }
  next(error)
}
