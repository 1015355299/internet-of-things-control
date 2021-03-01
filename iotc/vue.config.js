
module.exports = {
  productionSourceMap: false,
  outputDir: __dirname + '/../../Node_Server/iotc',
  publicPath: './',
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      //配置路径别名
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'views': '@/views',
      }
    }
  }
}
