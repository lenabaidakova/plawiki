const sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = () => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
              additionalData: `@import 'common/styles.scss';`,
              sassOptions: {
                includePaths: ['./src/app'],
              },
            },
          },
          '@funboxteam/scss-vars-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].lazy-chunk.[contenthash].css',
      insert: function (linkTag) {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/preload
        var preloadLinkTag = document.createElement('link');
        preloadLinkTag.rel = 'preload';
        preloadLinkTag.as = 'style';
        preloadLinkTag.href = linkTag.href;
        document.head.appendChild(preloadLinkTag);
        document.head.appendChild(linkTag);
      },
    }),
    new CssoWebpackPlugin(),
  ],

});
