const webpack = require('webpack')
const path = require('path')
const babelPlugins = []
const OfflinePlugin = require('offline-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
  }),
  new FaviconsWebpackPlugin({
    emitStats: true,
    title: require('../../package.json').title || 'Unicycle',
    logo: './public/favicon.png',
    statsFilename: 'favicons.json'
  }),
  new CopyWebpackPlugin([
    {
      from: 'public/*',
      to: 'static/'
    }
  ])
]
const devServer = {}

if (process.env.NODE_ENV === 'development') {
  console.log('Development: Injecting HMR client into bundle...')

  entry.unshift('webpack-hot-middleware/client')
  plugins.unshift(new webpack.HotModuleReplacementPlugin())

  devServer['hot'] = true
  devServer['noInfo'] = true
  devServer['publicPath'] = publicPath
  devServer['stats'] = CommonConfig.stats
}

const ClientConfig = {
  name: 'Client',
  entry,
  plugins,
  devServer,
  devtool: 'source-map',
  context: path.join(process.cwd()),
  stats: CommonConfig.stats,
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
