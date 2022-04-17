const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: '192.168.124.6',
    port: 8080,
    https: false,
    // 以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: { // 配置跨域
      '/app': {
        // target: 'http://ttapi.research.itcast.cn/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
        target: 'http://192.168.124.6:4000/app/',
        ws: false,
        changOrigin: true, // 允许跨域
        pathRewrite: {
          '^/app': ''// 请求的时候使用这个api就可以
        }
      }

    }
  }
})
// Vue.config.js 配置选项
// module.exports = defineConfig({
//   transpileDependencies: true,
//   pluginOptions: {
//     'style-resources-loader': {
//       preProcessor: 'less',
//       // patterns: [path.resolve(__dirname, './src/assets/less/1.less')]
//       patterns: []
//     }
//   }
// })
