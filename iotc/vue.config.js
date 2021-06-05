const webpack = require('webpack')
const path = require('path')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const config = {
  productionSourceMap: false,
  outputDir: path.resolve(__dirname, './dist'),
  publicPath:
    process.env.NODE_ENV === 'production'
      ? 'https://multer-1258613188.file.myqcloud.com/iot/assets/'
      : '/',
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      //配置路径别名
      alias: {
        assets: '@/assets',
        common: '@/common',
        views: '@/views',
      },
    },
    // module: {
    //   rules: [

    //   ],
    // },
    plugins: [
      new webpack.DllReferencePlugin({
        // 配置manifest映射关系文件位置
        manifest: path.resolve(__dirname, 'build/dll/manifest.json'),
      }),
      new AddAssetHtmlPlugin({
        // dll文件位置
        filepath: path.resolve(__dirname, 'build/dll/*.js'),
        // dll 引用路径
        publicPath:
          'https://multer-1258613188.file.myqcloud.com/iot/assets/dll',
        // dll最终输出的目录
        outputPath: './dll',
      }),
      // new BundleAnalyzerPlugin(),
    ],
    mode: 'development', // 开发环境模式
    devServer: {
      // 自动化开发服务器，在内存中自动编译，自动打开浏览器，自动实时刷新代码
      // contentBase: path.resolve(__dirname, 'dist'), // 服务器运行根目录，设置为打包后的根目录
      compress: true, // 使用gzip压缩
      open: true, // 自动打开浏览器
    },
  },
}

module.exports = config
