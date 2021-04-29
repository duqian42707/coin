export interface Tick {
  id: number,
  open: number,
  close: number,
  low: number,
  high: number,
  amount: number,
  vol: number,
  count: number
}

export interface KlineData {
  ch: string;
  ts: number;
  tick: Tick;
}

export class TradePair {
  symbol: string;
  name: string;
  initPrice: number;
  rate: number;

  constructor(symbol: string, name: string, initPrice: number, rate: number) {
    this.symbol = symbol;
    this.name = name;
    this.initPrice = initPrice;
    this.rate = rate;
  }
}
