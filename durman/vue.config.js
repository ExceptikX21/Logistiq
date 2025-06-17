const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'https://192.168.0.14:443',       // Puerto del frontend
    https: true,
    hot: true,   // Usa HTTPS si es necesario
  
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'LogistIQ',
    }
  },


})
