const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/pages/index.html'),
      filename: path.resolve(__dirname, 'dist/index.htm'),
      hash: true,
    })
  ],
  module:{
    rules: [
      { test: /\.js$/, include: path.resolve(__dirname, 'src'), loader: 'babel-loader' }
    ]
  }
};