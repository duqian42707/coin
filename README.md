# 火币K线数据监控

监控目标交易对，到达设置的涨跌幅度，发送钉钉推送。

接口文档地址：https://huobiapi.github.io/docs/spot/v1/cn/#websocket

运行先将`src/config.js.demo` 复制到 `src/config.js`并修改配置参数。


## 安装依赖包

```bash
npm install
```

## 使用docker安装redis
```bash
docker run -d --name redis -p 6379:6379 redis --requirepass '123.com'
```

## 本地运行

```bash
npm start
```

## 后台运行

```bash
npm install -g forever
npm run forever-start
```

## 效果

![](imgs/1.png)


## 参考文章

1. [火币API - Websocket行情数据](https://huobiapi.github.io/docs/spot/v1/cn/#websocket)
2. [WebSocket-Node.js-demo](https://github.com/huobiapi/WebSocket-Node.js-demo)
