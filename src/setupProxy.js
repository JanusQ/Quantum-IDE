const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
	app.use(
		'/circuit',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/user',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/notice',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/computer',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/ide',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use( 
		'/project',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/doc',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		'/remainder',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
		})
	)
	app.use(
		createProxyMiddleware('/api1',{
			target: 'http://183.129.170.180:10212', // 请求的地址域名
			changeOrigin: true,
			 pathRewrite: { '^/api1': '' },
		})
	)
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://183.129.170.180:10213', // 请求的地址域名
			secure:false,
			changeOrigin: true,
		})
	)
	
	
}
