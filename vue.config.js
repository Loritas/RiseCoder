const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
          proxy: {
              '/api': {
                  //1.必须添加http前缀，没添加我运行不了
                  //2.localhost、127.0.0.1、公网地址三者都可以使用
                  //3.结尾加不加/都ok
                  target: 'http://localhost:11451',
                  // 允许跨域
                  changeOrigin: true,
                  ws: true,
                  pathRewrite: {
                      '^/api': ''
                  }
              }
          }
    },
})
