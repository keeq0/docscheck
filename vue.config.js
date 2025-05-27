const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'DocsCheck — сервис проверки документов';
        return args;
      });
  }
}
