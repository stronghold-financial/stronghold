import { Request, Response } from 'express'
import { HandleRequest } from './Controller'

export const networkList = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}

export const networkOptions = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}

export const networkStatus = async (request: Request, response: Response): Promise<void> => {
  await HandleRequest(request, response)
}
