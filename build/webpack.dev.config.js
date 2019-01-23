const webpackBaseConfig = require('../webpack.config');
const merge = require('webpack-merge');

/**
 * mode: development
 */
module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 8081,
    progress: true,
    contentBase: './dist',
    historyApiFallback: true
  }
});