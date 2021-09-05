import {getLogger} from './Logger';
import {Config} from './models';

const config: Config = require('./config');
const logger = getLogger();

// redis使用说明 https://www.npmjs.com/package/redis

export class RedisClient {

  private static instance: any;

  private constructor() {
  }

  public static getInstance(): any {
    if (this.instance == null) {
      const redis = require('redis');
      this.instance = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.pass,
        db: config.redis.database
      });
      logger.info('创建redis客户端完成。');
    }
    return this.instance;
  }

}
