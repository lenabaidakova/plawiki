const path = require('path');
const webpack = require('webpack');
const sass = require('sass');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  mode: 'none',
  cache: true,
  entry: './src/app/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /app\/vendors/],
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              useBuiltIns: 'usage',
              corejs: 3,
            }],
            '@babel/react',
          ],
          plugins: [
            '@babel/plugin-transform-modules-commonjs',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-optional-chaining',
          ],
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-url')({
                  url: 'inline',
                  maxSize: 5,
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sourceMap: true,
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../src/app')],
              },
            },
          },
          {
            loader: '@funboxteam/scss-imports-loader',
            options: {
              paths: require(path.resolve(__dirname, '../src/app/common/scss')),
            },
          },
          '@funboxteam/scss-vars-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /svg-icon__symbol/,
        use: [
          {
            loader: 'file-loader?name=images/[hash].[ext]',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: 'file-loader?name=fonts/[hash].[ext]',
          },
        ],
      },
      {
        test: /svg-icon__symbol.+\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'svg-symbol-[name]-[hash]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/app/index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.ProvidePlugin({
      b: 'bem-react-helper',
    }),
    new SpriteLoaderPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
  }
};
