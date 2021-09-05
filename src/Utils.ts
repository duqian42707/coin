import axios from 'axios';
import {getLogger} from './Logger';
import {Config} from './models';

const config: Config = require('./config');
const logger = getLogger();

export class Utils {
  /**
   * 钉钉机器人文档 https://developers.dingtalk.com/document/app/custom-robot-access
   * @param msg
   */
  static dingPush(msg: string) {
    const url = config.dingUrl;
    const data = {
      msgtype: 'text',
      text: {
        content: '【数字货币提醒】' + msg
      }
    };
    axios({
      url: url,
      data: data,
      method: 'post'
    }).then(res => {
      logger.info('发送推送成功:' + msg);
    }).catch(err => {
      logger.info('发送推送异常:', err);
    });
  }
}

