const webpack = require("webpack");

module.exports = {
  entry: {
    main: './tmp/app/main.ts'
  },
  output: {
    filename: '[name].bundle.[hash].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    root: ['./node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ]
  }
};
