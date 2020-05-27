const path = require('path')
// 删除console
const TerserPlugin = require('terser-webpack-plugin')
// gzip压缩
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
// const cdn = {
//   css: [],
//   js: [
//     'https://cdn.bootcss.com/vue/2.5.17/vue.runtime.min.js',
//     'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
//     'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
//     'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
//   ]
// }
const port = 9999
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: ['element-ui'], // 解决IE浏览器本地启动白屏现象
  // outputDir: process.env.outputDir || 'dist', // 输出文件名称
  // publicPath: '/',//部署应用包时的基本 URL
  productionSourceMap: !isProduction, // 解决vue项目打包后浏览器F12查看到项目源代码false不能看到
  // productionSourceMap: true, // 测试调试打断点
  // lintOnSave: false,// 去掉eslint校验
  devServer: {
    port: port, // 设置端口号
    open: true, // 启动项目自动打开浏览器
    proxy: { // 解决跨域问题
      '/invoice': {
        // target: 'http://10.0.28.38:10004', // ivoice路径 dev
        // target: 'http://10.0.17.233:10004', // ivoice路径 sit2
        target: process.env.VUE_APP_BASE_API, // ivoice路径
        authorization: false,
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/invoice': '/invoice'
        }
      },
      '/local': {
        target: 'http://localhost:9999/', // 本地路径
        authorization: false,
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '/local': '/mock'
        }
      }
    }
  },
  // 底层是webpack-chain
  chainWebpack: config => {
    // 配置兼容IE浏览器
    config.entry.app = ['babel-polyfill', './src/main.js']
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
    // .set("@img", resolve("src/assets/img"))
    // .set("@scss", resolve("src/assets/css"));
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        // maxSize: 100000 // 大于100kb做二次分割
      })
      // 生产环境注入cdn
      // config.plugin('html')
      //   .tap(args => {
      //     args[0].cdn = cdn;
      //     return args;
      //   });
    }
  },
  // 底层是webpack-merge
  configureWebpack: config => {
    if (isProduction) {
      // 用cdn方式引入
      // config.externals = {
      //   'vue': 'Vue',
      //   'vuex': 'Vuex',
      //   'vue-router': 'VueRouter',
      //   'axios': 'axios'
      // }
      // 为生产环境修改配置...
      config.plugins.push(
        // 生产环境自动删除console
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      )
      // 生产环境自动删除console
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // gzip压缩
      // const productionGzipExtensions = ['html', 'js', 'css', 'svg', 'woff', 'ttf', 'eot']
      // config.plugins.push(
      //   new CompressionWebpackPlugin({
      //     filename: '[path].gz[query]',
      //     algorithm: 'gzip',
      //     test: new RegExp(
      //       '\\.(' + productionGzipExtensions.join('|') + ')$'
      //     ),
      //     threshold: 10240, // 只有大小大于该值的资源会被处理 10240
      //     minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      //     deleteOriginalAssets: false // 删除原文件
      //   })
      // )
      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }
  }
}
