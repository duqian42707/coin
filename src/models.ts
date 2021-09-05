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

export interface RedisConfig {
  host: string;
  port: number;
  pass: string;
  database: number;
}

export interface Config {
  log4js: 'default' | 'fileOnly';
  wsUrl: string;
  // 代理，为空则直连
  proxy: string | null;
  // 钉钉推送接口地址
  dingUrl: string;
  redis: RedisConfig;
}
