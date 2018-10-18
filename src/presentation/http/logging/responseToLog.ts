import { Response } from 'express'

export default (res: Response) =>
  `HTTP ${res.statusCode} <== ${res.req.method} ${res.req.path}`
