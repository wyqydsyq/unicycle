const path = require('path')

const CommonConfig = {
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
      },
      {
        test: /\.less$|\.css$/,
        loader: 'style!css?camelCase&minimize&discardDuplicates&-import&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
      }
    ]
  }
}

module.exports = CommonConfig
