# 火币K线数据监控

监控目标交易对，到达设置的涨跌幅度，发送钉钉推送。

运行前先修改`src/Constants.ts`中的参数

## 本地运行

```bash
npm start
```

## 后台运行

```bash
npm install -g forever
npm run forever-start
```
