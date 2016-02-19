const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const styleLoader = new ExtractTextPlugin('[name].css')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production' || false

module.exports = {
  cache: !isProduction,
  debug: !isProduction,
  devtool: !isProduction ? 'eval' : null,
  entry: {
    bundle: [ './src/index.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    //filename: isProduction ? '[name].[hash].js' : '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        DEBUG: process.env.DEBUG,
        NODE_ENV: process.env.NODE_ENV,
      })
    }),
    styleLoader,
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
      minify: isProduction,

      // Custom attributes to use in template:
      //foo: 'bar',
    }),
  ],
  module: {
    loaders:  [
      {
        test: /\.js$/,
        exclude: /(node_modules|src\/styles)/,
        loader: 'babel',
      },
      {
        test: /\.scss/,
        exclude: /node_modules/,
        loader: styleLoader.extract(
          'style-loader',
          'css-loader!autoprefixer-loader!sass-loader'
        ),
      },
      {
        test: /\.(svg|woff|woff2|eot|dtd|png|gif|jpg|jpeg|ttf)(\?.*)?$/,
        loader: 'file',
      },
    ]
  },
  //resolve: {
    //extensions: [ '', '.js', '.less' ],
    //modulesDirectories: ['node_modules'],
    //alias: {
      //'app': path.join(process.cwd(), './app'),
    //},
  //},
}
