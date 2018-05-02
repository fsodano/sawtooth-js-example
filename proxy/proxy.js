const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin');
  next();
};

app.use(allowCrossDomain);
app.use('/', proxy(() => { return true; }, {
  target: 'http://rest-api:8008',
  changeOrigin: false,
  onProxyRes: async (proxyRes, req, res) => {
    proxyRes.statusCode = 200;
  }
}));
app.listen(3000);
