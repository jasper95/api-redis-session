import logger from './logger'
import { ServiceLocator, PromiseRedisClient } from 'types'
import QueryWrapper from 'utils/dbwrapper'
import { schema, database } from 'config'
import redis from 'redis'
import { createProxy } from './tools'

Promise.promisifyAll(redis)
const DB = createProxy(new QueryWrapper(schema, database))
const redis_client = redis.createClient({
  url: process.env.REDIS_URL,
}) as PromiseRedisClient
const serviceLocator: ServiceLocator = {
  services: {
    DB,
    knex: DB.knex,
    logger,
    redis: redis_client,
  },
  registerService(service_name: string, service: object) {
    if (!this.services[service_name]) {
      this.services[service_name] = service
    }
  },
  get(service_name: string) {
    return this.services[service_name]
  },
}

export default serviceLocator
