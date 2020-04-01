import { Configuration } from '@solid-soda/config'
import { format } from 'date-fns'
import * as redis from 'redis'

const createKey = (id: string) => `claim-answer-${id}`

const createDateMark = () => format(new Date(), 'YYYY-MM-DD, HH:mm:ss:SSS')

export const answerRedisMiddleware = (config: Configuration) => {
  const client = redis.createClient({
    host: config.getStringOrElse('REDIS_HOST', 'localhost'),
    port: config.getNumberOrElse('REDIS_PORT', 6379),
    password: config.getStringOrElse('REDIS_PASSWORD', undefined),
  })

  const get = (key: string): Object =>
    new Promise((resolve, reject) =>
      client.get(key, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(JSON.parse(data || '{}'))
      }),
    )

  const set = (key: string, data: string) =>
    new Promise((resolve, reject) =>
      client.set(key, data, err => {
        if (err) {
          reject(err)
        }

        resolve()
      }),
    )

  return async (req, _, next) => {
    if (req.path.includes('answer')) {
      const key = createKey(req.body.claimId)
      const oldLog = await get(key)

      const newLog = {
        ...oldLog,
        [createDateMark()]: req.body.answers,
      }

      await set(key, JSON.stringify(newLog))
    }

    next()
  }
}
