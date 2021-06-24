
import { Request, Response } from 'express'
import { HandleRequest } from './Controller'

export const block = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}

export const blockTransaction = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}
