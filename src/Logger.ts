import {configure, getLogger as log4jsGetLogger, Logger} from 'log4js';
import {Config} from './models';

const config: Config = require('./config');

/**
 * 统一日志配置
 */
export function getLogger(): Logger {
  configure({
    appenders: {
      file: {type: 'dateFile', filename: 'logs/coin.log', daysToKeep: 30},
      console: {type: 'console'},
    },
    categories: {
      default: {appenders: ['file', 'console'], level: 'debug'},
      fileOnly: {appenders: ['file'], level: 'debug'},
    }
  });
  return log4jsGetLogger(config.log4js);
}
