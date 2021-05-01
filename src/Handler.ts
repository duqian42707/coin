import {KlineData} from './models';
import {Utils} from './Utils';
import moment from 'moment';
import {RedisClient} from './RedisClient';


export class Handler {

  private readonly symbol: string;
  private readonly name: string;
  // 涨跌幅达到百分之几时进行提醒
  private readonly rate: number;
  private lastRemindedPrice: number;
  private redisClient: any;

  constructor(symbol: string, name: string, initPrice: number, rate?: number) {
    this.symbol = symbol;
    this.redisClient = RedisClient.getInstance();
    this.name = name;
    this.rate = rate || 5;
    this.lastRemindedPrice = initPrice;
    this.redisClient.get('coin:' + this.symbol, (err: any, data: any) => {
      if (data) {
        this.lastRemindedPrice = data;
      }
    });
  }

  getSymbol(): string {
    return this.symbol;
  }

  getName(): string {
    return this.name;
  }

  /**
   * 处理数据，价格波动时发送提醒
   * @param data
   */
  handle(data: KlineData) {
    const current = data.tick.close;
    const time = moment(data.ts).format('HH:mm');

    const targetHighPrice = Number((this.lastRemindedPrice * (1 + this.rate / 100)).toFixed(4));
    if (current >= targetHighPrice) {
      this.lastRemindedPrice = targetHighPrice;
      const type = '涨';
      const msg = `[${time}][${this.name}][${type}]${this.rate}%，达到[${targetHighPrice}],当前[${current}]`;
      Utils.dingPush(msg);
      this.redisClient.getClient().set('coin:' + this.symbol, this.lastRemindedPrice, () => {

      });
    }

    const targetLowPrice = Number((this.lastRemindedPrice * (1 - this.rate / 100)).toFixed(4));
    if (current <= targetLowPrice) {
      this.lastRemindedPrice = targetLowPrice;
      const type = '跌';
      const msg = `[${time}][${this.name}][${type}]${this.rate}%，达到[${targetLowPrice}],当前[${current}]`;
      Utils.dingPush(msg);
      this.redisClient.getClient().set('coin:' + this.symbol, this.lastRemindedPrice, () => {
      });
    }
  }

}
