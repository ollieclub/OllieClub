const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  entry: { 
      main: './src/index.js',
      vendor: ['phaser']
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].bundle.js',
    chunkFilename: 'js/[name].[chunkhash].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization:{
      minimizer:[
        new UglifyJSPlugin({
          parallel: true,
          sourceMap:false,
          uglifyOptions:{
            output:{
              comments: false
            },
            compress: {
              unused: true,
              dead_code: true,
              warnings: false,
              drop_debugger: true,
              conditionals: true,
              evaluate: true,
              drop_console: true,
              sequences: true,
              booleans: true,
            }
          }
        })
      ],
      runtimeChunk: true,
      splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                enforce: true,
                chunks: "initial"
            }
        }
    }
  },
  plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
        new HtmlWebpackPlugin({
            minify: {
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true,
                removeEmptyAttributes: true
            },
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([
          { from: 'assets', to: 'assets' }
        ]),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })  
    ]
}