var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: [
      'babel-polyfill',
      APP_DIR + '/index.js'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map',
  },
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader: 'babel-loader',
        query : {
            presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader','css-loader', 'sass-loader']
      },
      {
          test: /\.css$/,
          loaders: ['style-loader','css-loader']
      }
    ]
  },
  devServer: {
      historyApiFallback: true
  }
};

module.exports = config;