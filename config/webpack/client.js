const webpack = require('webpack')
const path = require('path')
const babelPlugins = []
const OfflinePlugin = require('offline-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

const CommonConfig = require('./common')
const publicPath = '/static/'
const buildPath = path.join(process.cwd(), 'build', publicPath)
const entry = ['./src/client/index.ts']
const plugins = [
  new webpack.DefinePlugin({'global.GENTLY': false}),
  new CheckerPlugin(),
  new OfflinePlugin({
    externals: ['/'],
    publicPath,
    relativePaths: false,
    ServiceWorker: {
      publicPath: '/sw.js'
    }
  })
]
const devServer = {}

if (process.env.NODE_ENV === 'development') {
  console.log('Develoment Mode: Enabling HMR...')
  CommonConfig.module.rules[0].use[0].options.babelOptions.plugins.push(['cycle-hmr/xstream', {
    include: ['**/src/**.js'],
    exclude: ['**/src/main.js'],
    testExportName: '^[A-Z]|default'
  }])

  plugins.unshift(new webpack.HotModuleReplacementPlugin())
  entry.unshift('webpack-hot-middleware/client')

  devServer['hot'] = true
  devServer['noInfo'] = true
  devServer['publicPath'] = publicPath
}

const ClientConfig = {
  name: 'Client',
  entry,
  plugins,
  devServer,
  devtool: 'source-map',
  context: path.join(process.cwd()),
  resolve: {
    extensions: CommonConfig.resolve.extensions,
    alias: {
      'inherits': 'inherits/inherits_browser.js',
      'superagent': 'superagent/lib/client',
      'emitter': 'component-emitter',
    }
  },
  output: {
    path: buildPath,
    publicPath,
    filename: 'bundle.js'
  },
  module: {
    rules: CommonConfig.module.rules
  },
  target: 'web',
  externals: [
    'net',
    'fs'
  ]
}


module.exports = ClientConfig
