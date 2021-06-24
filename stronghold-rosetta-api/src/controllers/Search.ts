
import { Request, Response } from 'express'
import { HandleRequest } from './Controller'

export const searchBlocks = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}

export const searchTransactions = async (
  request: Request,
  response: Response,
): Promise<void> => {
  await HandleRequest(request, response)
}
