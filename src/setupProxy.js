const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/series',
    createProxyMiddleware({
      target: '/localhost', // 请求的地址域名
      changeOrigin: true,
      pathRewrite:{
          '^/series':""
      }
    })
  );
};
