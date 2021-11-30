// Required if Docker is used.

const { createProxyMiddleware } = require('http-proxy-middleware');

const HOST = process.env.HOST_ADDR || 'localhost';

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${HOST}:5000/`,
    })
  );
};
