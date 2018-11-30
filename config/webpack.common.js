const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const helpers = require('./helpers');

const NODE_ENV = process.env.NODE_ENV;
const REACT_APP_apiKey=process.env.REACT_APP_apiKey;
const REACT_APP_authDomain=process.env.REACT_APP_authDomain;
const REACT_APP_databaseURL=process.env.REACT_APP_databaseURL;
const REACT_APP_messagingSenderId=process.env.REACT_APP_messagingSenderId;
const REACT_APP_projectId=process.env.REACT_APP_projectId;
const REACT_APP_storageBucket=process.env.REACT_APP_storageBucket;

const REACT_APP_text=process.env.REACT_APP_text;

const isProd = NODE_ENV === 'production';

module.exports = {
  entry: {
    'app': [
      helpers.root('client/app/index.js')
    ]
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.json', '.css', '.scss', '.html'],
    alias: {
      'app': 'client/app'
    }
  },

  module: {
    rules: [
      // JS files
      {
        test: /\.jsx?$/,
        include: helpers.root('client'),
        loader: 'babel-loader',
        query:{
          plugins: ['transform-class-properties']
        }
      },

      // SCSS files
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                'sourceMap': true,
                'importLoaders': 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer
                ]
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
     {
      test: /\.(png|svg|jpg|gif)$/,
       use: [
         'file-loader'
       ]
     }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
                        NODE_ENV: JSON.stringify(NODE_ENV),
                        REACT_APP_apiKey: JSON.stringify(REACT_APP_apiKey),
                        REACT_APP_authDomain: JSON.stringify(REACT_APP_authDomain),
                        REACT_APP_databaseURL: JSON.stringify(REACT_APP_databaseURL),
                        REACT_APP_messagingSenderId: JSON.stringify(REACT_APP_messagingSenderId),
                        REACT_APP_projectId: JSON.stringify(REACT_APP_projectId),
                        REACT_APP_storageBucket: JSON.stringify(REACT_APP_storageBucket),
                        REACT_APP_text: JSON.stringify(REACT_APP_text)
                      }
    }),

    new HtmlWebpackPlugin({
      template: helpers.root('client/public/index.html'),
      inject: 'body'
    }),

    new ExtractTextPlugin({
      filename: 'css/[name].[hash].css',
      disable: !isProd
    }),

    new CopyWebpackPlugin([{
      from: helpers.root('client/public')
    }])
  ]
};
