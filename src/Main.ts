import {Handler} from './Handler';
import {KlineData} from './models';
import {Constants} from './Constants';
import {getLogger} from './Logger';

const logger = getLogger();
const pako = require('pako');
const webSocket = require('ws');

class Main {
  ws: any;
  handlers: Handler[] = [];

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
      new Handler('btcusdt', 'BTC', 5),
      new Handler('filusdt', 'FIL', 5),
      new Handler('dogeusdt', 'DOGE', 5),
    ];
    for (let trade of this.handlers) {
      this.ws.send(JSON.stringify({
        'sub': `market.${trade.getSymbol()}.kline.1min`,
        'id': `${trade.getSymbol()}`
      }));
    }
  }

  init() {
    logger.debug('程序启动中...');
    if (Constants.proxy) {
      const HttpsProxyAgent = require('https-proxy-agent');
      const url = require('url');
      const options = url.parse(Constants.proxy);
      const agent = new HttpsProxyAgent(options);
      this.ws = new webSocket(Constants.wsUrl, {agent: agent});
    } else {
      this.ws = new webSocket(Constants.wsUrl);
    }
    this.ws.on('open', () => {
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
      this.init();
    });
    this.ws.on('error', (err: any) => {
      logger.warn('ws error,reconnecting...');
      this.init();
    });
  }
}

new Main();
