const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/app/index.tsx',
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|jts)x?$/,
        loader: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/graphql': {
        target: {
          port: 3000
        }
      },
      '/csrf-token': {
        target: {
          port: 3000
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'app', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: './src/yourfile.css',
    }),
  ],
};
