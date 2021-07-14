const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const modeConfig = (mode) => require(`./webpack-utils/webpack.${mode}`)(mode);

module.exports = (env, argv) => merge(
  {
    mode: argv.mode,
    entry: './src/app/index.js',
    output: {
      path: path.resolve(__dirname, './public'),
      filename: '[name].[contenthash].js',
      publicPath: '/',
      chunkFilename: '[name].lazy-chunk.[contenthash].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['./src', 'node_modules'],
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
        template: './src/app/index.html',
        filename: 'index.html',
        inject: 'body'
      }),
      new webpack.ProvidePlugin({
        b: 'bem-react-helper',
      }),
      new SpriteLoaderPlugin(),
    ],
  },
  modeConfig(argv.mode),
);
