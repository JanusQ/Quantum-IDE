const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
	app.use(
		'/circuit',
		createProxyMiddleware({
			target: 'http://192.168.23.178:8080', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/user',
		createProxyMiddleware({
			target: 'http://192.168.23.178:8080', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/notice',
		createProxyMiddleware({
			target: 'http://192.168.23.178:8080', // 请求的地址域名
			changeOrigin: true,
		})
	)
}
