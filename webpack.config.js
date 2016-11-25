var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  context: path.join(__dirname, './client'),
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'whatwg-fetch',
    path.join(__dirname, './client/main.jsx')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './client/index.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: ["", ".webpack.js", ".js", ".jsx", ".sass"]
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        include: /client/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|sass)$/,
        loaders: ["style", "css?sourceMap", "sass?sourceMap"]
      }
    ]
  }
};
