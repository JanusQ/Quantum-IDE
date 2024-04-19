const path = require('path')
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl)
const WebpackBar = require('webpackbar') // webpack 编译进度条
module.exports = {
  webpack: {
    devtool: false,
    alias: {
      '@': pathResolve('src'),
      '@assets': pathResolve('src/assets'),
      '@components': pathResolve('src/components'),
      '@constants': pathResolve('src/constants'),
      '@containers': pathResolve('src/containers'),
      '@hooks': pathResolve('src/hooks'),
      '@mocks': pathResolve('src/mocks'),
      '@routes': pathResolve('src/routes'),
      '@services': pathResolve('src/services'),
      '@styles': pathResolve('src/styles'),
      '@types': pathResolve('src/types'),
      '@utils': pathResolve('src/utils'),
      '@contexts': pathResolve('src/contexts'),
    },
    plugins: [
      new WebpackBar({
        color: 'green',
        profile: true,
        reporters: ['fancy'],
        fancyProgress: true,
      }),
    ],
    configure: {
      output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'build'), // 修改输出文件目录
        // path: path.resolve(__dirname, 'ide_test'), // 测试代码
      },
    },
  },
  devServer: {
    // 本地服务的端口号
    port: 8888,
    // 本地服务的响应头设置
    headers: {
      // 允许跨域
      'Access-Control-Allow-Origin': '*',
    },
  },
}
