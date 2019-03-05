import Logger from './infrastructure/Logger/Logger'

export const extraLoggerMiddleware = (logger: Logger) => {
  return (req, _, next) => {
    if (req.method !== 'GET') {
      logger.log('Incomeing POST request', {
        path: req.path,
        body: req.body,
      })
    }

    next()
  }
}
