// this file collates multiple Webpack configs
// so that we can build separate bundles with one call to webpack
// don't actually specify configuration in here, either
// edit the configs required in below or create & add a new one

module.exports = [
  require('./config/webpack/server'),
  require('./config/webpack/client')
]
