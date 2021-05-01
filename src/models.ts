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
