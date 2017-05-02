const path = require('path')
const nodeModules = require('webpack-node-externals')

const CommonConfig = require('./common')
const publicPath = '/server/'
const buildPath = path.join(process.cwd(), 'build', publicPath)
const entry = ['./src/server/index.ts']
const plugins = []

const ServerConfig = {
  name: 'Server',
  entry,
  plugins,
  devtool: 'source-map',
  context: path.join(process.cwd()),
  resolve: CommonConfig.resolve,
  output: {
    path: buildPath,
    publicPath: buildPath,
    filename: 'index.js'
  },
  module: {
    rules: CommonConfig.module.rules
  },
  target: 'node',
  externals: [nodeModules()]
}

module.exports = ServerConfig
