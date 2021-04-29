import {Handler} from './Handler';
import {KlineData, TradePair} from './models';
import {Constants} from './Constants';

const webSocket = require('ws');
const pako = require('pako');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');
const options = url.parse(Constants.proxy);
const agent = new HttpsProxyAgent(options);


class Main {

  handlers: Handler[] = [];

  constructor() {
    this.init();
  }

  handle(data: KlineData) {
    const symbol = data.ch.split('.')[1];
    const handler = this.handlers.filter(handler => handler.getSymbol() === symbol)[0];
    handler.handle(data);
  }

  subscribe(ws: typeof webSocket) {
    const trades = [
      new TradePair('btcusdt', '比特币', 60000, 5),
      new TradePair('filusdt', '菲尔币', 140, 5),
    ];
    for (let trade of trades) {
      ws.send(JSON.stringify({
        'sub': `market.${trade.symbol}.kline.1min`,
        'id': `${trade.symbol}`
      }));
      this.handlers.push(new Handler(trade.symbol, trade.name, trade.initPrice, trade.rate));
    }
  }

  init() {
    console.log('程序启动中...');
    var ws = new webSocket(Constants.wsUrl, {agent: agent});
    ws.on('open', () => {
      this.subscribe(ws);
    });
    ws.on('message', (data: any) => {
      let text = pako.inflate(data, {
        to: 'string'
      });
      let msg = JSON.parse(text);
      if (msg.ping) {
        ws.send(JSON.stringify({
          pong: msg.ping
        }));
      } else if (msg.tick) {
        this.handle(msg as KlineData);
      } else {
        console.log(text);
      }
    });
    ws.on('close', () => {
      console.log('close');
      this.init();
    });
    ws.on('error', (err: any) => {
      console.log('error', err);
      this.init();
    });
  }
}

new Main();
