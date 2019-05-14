import { INestExpressApplication } from '@nestjs/common'
import * as RateLimit from 'express-rate-limit'

export const rateLimiter = (app: INestExpressApplication) => {
  app.enable('trust proxy')

  const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
  })

  return limiter
}
