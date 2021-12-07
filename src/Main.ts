import {Handler} from './Handler';
import {Config, KlineData} from './models';
import {getLogger} from './Logger';
import {Utils} from './Utils';

const config: Config = require('./config');
const logger = getLogger();
const pako = require('pako');
const webSocket = require('ws');

class Main {
  ws: any;
  handlers: Handler[] = [];
  connectionLostReminded = false;
  reConnectedReminded = false;
  timeOnConnectionLost: number = 0;

  constructor() {
    this.init();
  }

  handle(data: KlineData) {
    const symbol = data.ch.split('.')[1];
    const handler = this.handlers.filter(handler => handler.getSymbol() === symbol)[0];
    handler.handle(data);
  }

  subscribe() {
    this.handlers = [
      new Handler('btcusdt', 'BTC', 8),
      new Handler('filusdt', 'FIL', 8),
    ];
    for (let trade of this.handlers) {
      this.ws.send(JSON.stringify({
        'sub': `market.${trade.getSymbol()}.kline.1min`,
        'id': `${trade.getSymbol()}`
      }));
    }
  }

  init() {
    logger.debug('尝试连接中...');
    if (config.proxy) {
      const HttpsProxyAgent = require('https-proxy-agent');
      const url = require('url');
      const options = url.parse(config.proxy);
      const agent = new HttpsProxyAgent(options);
      this.ws = new webSocket(config.wsUrl, {agent: agent});
    } else {
      this.ws = new webSocket(config.wsUrl);
    }
    this.ws.on('open', () => {
      logger.debug('连接成功.');
      if (this.timeOnConnectionLost > 0 && this.connectionLostReminded && !this.reConnectedReminded) {
        logger.warn('连接已恢复.');
        Utils.dingPush(`连接已恢复.`);
        this.reConnectedReminded = true;
        this.connectionLostReminded = false;
      }
      this.timeOnConnectionLost = 0;
      this.subscribe();
    });
    this.ws.on('message', (data: any) => {
      let text = pako.inflate(data, {
        to: 'string'
      });
      let msg = JSON.parse(text);
      if (msg.ping) {
        this.ws.send(JSON.stringify({
          pong: msg.ping
        }));
      } else if (msg.tick) {
        this.handle(msg as KlineData);
      } else {
        logger.info(text);
      }
    });
    this.ws.on('close', () => {
      logger.warn('ws close,reconnecting...');
      if (this.timeOnConnectionLost === 0) {
        this.timeOnConnectionLost = new Date().getTime();
      } else {
        if (new Date().getTime() - this.timeOnConnectionLost > 60 * 60 * 1000) {
          if (!this.connectionLostReminded) {
            logger.warn('连接断开已超过60分钟.');
            Utils.dingPush(`连接断开已超过60分钟.`);
            this.connectionLostReminded = true;
            this.reConnectedReminded = false;
          }
        }
      }
      setTimeout(() => {
        this.init();
      }, 5000);
    });
    this.ws.on('error', (err: any) => {
      // logger.warn('ws error,reconnecting...');
      // setTimeout(() => {
      //   this.init();
      // }, 3000);
    });
  }
}

new Main();
