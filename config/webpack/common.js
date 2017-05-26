const path = require('path')

const CommonConfig = {
  context: __dirname,
  stats: {
    modules: true,
    assets: false,
    cached: false,
    colors: true,
    depth: true,
    errors: true,
    errorDetals: true,
    warnings: true
  },
  resolve: {
    alias: {
      'README.md': path.join(process.cwd(), 'README.md')
    },
    extensions: ['.ts', '.js', '.node', '.less', '.json', '.md']
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules|webpack)/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: 'tsconfig.json',
            useBabel: true,
            useCache: true,
            babelOptions: {
              presets: ['latest'],
              sourceMaps: 'inline',
              plugins: []
            }
          }
        }]
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.wav$|\.mp3$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.md$/,
        loader: 'html!markdown'
      }
    ]
  }
}

module.exports = CommonConfig
