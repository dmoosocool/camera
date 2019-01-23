const webpackBaseConfig = require('../webpack.config');
const merge = require('webpack-merge');

/**
 * mode: production
 */
module.exports = merge(webpackBaseConfig, {
  mode: 'production',
});