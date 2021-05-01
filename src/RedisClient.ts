import {Constants} from './Constants';
import {getLogger} from './Logger';

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
        host: Constants.redis.host,
        port: Constants.redis.port,
        password: Constants.redis.pass,
        db: Constants.redis.database
      });
      logger.info('创建redis客户端完成。');
    }
    return this.instance;
  }

}
