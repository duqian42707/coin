const WebSocket = require('ws');
const pako = require('pako');
const moment = require('moment');
const HttpsProxyAgent = require('https-proxy-agent');
const url = require('url');

const PROXY = 'http://127.0.0.1:11187';
const WS_URL = 'wss://api.huobi.pro/ws';
const parsed = url.parse(WS_URL);
const options = url.parse(PROXY);
const agent = new HttpsProxyAgent(options);


var orderbook = {};

exports.OrderBook = orderbook;


/**
 * 价格波动时发送提醒
 */
function remind(){

}



/**
 * 处理收到的k线数据
 * https://huobiapi.github.io/docs/spot/v1/cn/#websocket
 * {"ch":"market.btcusdt.kline.1min","ts":1619586237294,"tick":{"id":1619586180,"open":54907.85,"close":54840.82,"low":54835.5,"high":54917.74,"amount":13.815438084125795,"vol":758023.92393986,"count":404}}
 * @param data
 */
function handle(data) {
    const ts = data.ts;
    const symbol = data.ch.split('.')[1];
    const period = data.ch.split('.')[3];
    const {id, high, low, open, close} = data.tick;
    const currentTime = moment(ts).format('yyyy-MM-DD HH:mm:ss');
    const ktime = moment(id * 1000).format('HH:mm:ss');
    // console.log(`[${currentTime}]收到k线数据[${symbol}-${period}]`, ktime, open, close, high, low);
    console.log(`[${currentTime}]当前价格[${symbol}] : ${close.toFixed(4)}`);
}

// 订阅K线
function subscribe(ws) {
    var symbols = [
        // 'btcusdt',
        // 'htusdt',
        'filusdt',
    ];
    for (let symbol of symbols) {
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.kline.1min`,
            "id": `${symbol}`
        }));
    }
}

function init() {
    console.log('start init...');
    var ws = new WebSocket(WS_URL, {agent: agent});
    ws.on('open', () => {
        console.log('open');
        subscribe(ws);
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            handle(msg);
        } else {
            console.log(text);
        }
    });
    ws.on('close', () => {
        console.log('close');
        init();
    });
    ws.on('error', err => {
        console.log('error', err);
        init();
    });
}

init();
