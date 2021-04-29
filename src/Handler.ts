import {KlineData} from './models';
import {Utils} from './Utils';
import moment from 'moment';


export class Handler {

  private readonly symbol: string;
  private readonly name: string;
  // 涨跌幅达到百分之几时进行提醒
  private readonly rate: number;
  private lastRemindedPrice: number;

  constructor(symbol: string, name: string, initPrice: number, rate?: number) {
    this.symbol = symbol;
    this.name = name;
    this.lastRemindedPrice = initPrice;
    this.rate = rate || 5;
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
      const msg = `[${time}][${this.name}][${type}]${this.rate}%，达到[${targetHighPrice}],当前[${current}]`
      Utils.dingPush(msg)
    }

    const targetLowPrice = Number((this.lastRemindedPrice * (1 - this.rate / 100)).toFixed(4));
    if (current <= targetLowPrice) {
      this.lastRemindedPrice = targetLowPrice;
      const type = '跌';
      const msg = `[${time}][${this.name}][${type}]${this.rate}%，达到[${targetLowPrice}],当前[${current}]`
      Utils.dingPush(msg)
    }
  }

}
