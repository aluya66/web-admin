const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin') // Gzip
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

const env = {
  isDebug: process.env.NODE_ENV === 'development'
}

module.exports = {
  publicPath: !env.isDebug ? process.env.VUE_APP_BASEURLPATH : '',
  outputDir: `dist${process.env.VUE_APP_BASEURLPATH}`,
  // 放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  assetsDir: '',
  // indexPath: 'index.html',
  // transpileDependencies: ["vue-echarts", "resize-detector"],
  chainWebpack: config => {
    /**
		 * 删除懒加载模块的 prefetch preload，降低带宽压力
		 * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
		 * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
		 * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
		 */
    config.plugins.delete('prefetch').delete('preload')

    config.module
      .rule('svg')
      .exclude.add(path.resolve('src/themes/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve('src/themes/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.resolve
      .set('symlinks', false) // https://github.com/vuejs/vue-cli/issues/2675
      .extensions.merge(['.js', '.jsx', '.vue', '.json'])

    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('styles', path.resolve('src/themes/styles'))
      .set('images', path.resolve('src/themes/images'))
      .set('components', path.resolve('src/components'))
      .set('api', path.resolve('src/api'))
      .set('utils', path.resolve('src/utils'))
      .set('mixins', path.resolve('src/views/mixins'))
      .set('plugins', path.resolve('src/plugins'))

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(
        process.env.NODE_ENV === 'development',
        // sourcemap不包含列信息
        config => config.devtool('cheap-source-map')
      )
      .when(process.env.NODE_ENV !== 'development', config => {
        config
          .plugin('ScriptExtHtmlWebpackPlugin')
          .use('script-ext-html-webpack-plugin', [
            {
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }
          ])
        config.optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial' // 只打包初始时依赖的第三方
            },
            elementUI: {
              name: 'chunk-elementUI', // 单独将 elementUI 拆包
              priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
              test: /[\\/]node_modules[\\/]element-ui[\\/]/
            }
          }
        })
        config.optimization.runtimeChunk('single')
      })
  },
  // 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件
  pages: undefined,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  // 是否在保存的时候检查
  lintOnSave: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  configureWebpack: config => {
    // 生产and测试环境
    const pluginsPro = [
      new CompressionPlugin({
        // 文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(`\\.(${['js', 'css'].join('|')})$`),
        threshold: 8192,
        minRatio: 0.8
      }),
      // Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      // new BundleAnalyzerPlugin(),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './server'),
          to: path.resolve(__dirname, './dist'),
          ignore: ['.*', 'node_modules/**/*']
        }
      ]),
      new UglifyJsPlugin({
        uglifyOptions: {
          // 移除 console
          // 其它优化选项 https://segmentfault.com/a/1190000010874406
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        },
        // 并行压缩
        parallel: true
      })
    ]
    // 开发环境
    const pluginsDev = []
    if (!env.isDebug) {
      // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
      config.plugins = [...config.plugins, ...pluginsPro]
    } else {
      // 为开发环境修改配置...
      config.plugins = [...config.plugins, ...pluginsDev]
    }
    // 在html cdn引入，比人echart
    // config.externals = {
    //   echarts: 'echarts'
    // };
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !env.isDebug,
    // 开启 CSS source maps
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 100, // 基于750或640设计图，100px->1rem
            // propList: ['*', '!font*']
            propList: ['*'],
            selectorBlackList: []
          })
        ]
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // 反向代理
  devServer: {
    // 环境配置
    port: process.env.VUE_APP_PORT || '3839',
    disableHostCheck: true, // 本地hosts配域名调试用
    overlay: {
      warnings: true,
      errors: true
    },
    https: false,
    hotOnly: false,
    // 配置自动启动浏览器
    open: false,
    proxy: {
      [process.env.VUE_APP_CONSOLE_COMMON]: {
        target: process.env.VUE_APP_SERVERPATH_CONSOLE,
        ws: false,
        pathRewrite: {}
      },
      [process.env.VUE_APP_IPX]: {
        target: process.env.VUE_APP_SERVERPATH_IPX,
        ws: false,
        pathRewrite: {
          '^/api-ipx': '/'
        }
      }
    },
    // dev模拟数据
    before: require('./devMock')
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/themes/styles/variables.less'),
        path.resolve(__dirname, 'src/themes/styles/mixin.less')
      ]
    }
  }
}
