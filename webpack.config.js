const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  entry: './cli/index.js',
  output: {
    path: path.resolve(__dirname, 'cli/build'),
    publicPath: 'cli/build/',
    filename: 'dist.js'
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.node/,
        loader: 'ignore-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.IgnorePlugin(/\.node$/)
  ],
  devServer: {
    contentBase: __dirname,
    compress: true,
    historyApiFallback: true,
    noInfo: true,
    before: function (app) {
      let allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
      };

      app.use(allowCrossDomain);
    },
  }
};
