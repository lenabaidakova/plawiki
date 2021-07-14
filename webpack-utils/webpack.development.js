const sass = require('sass');

module.exports = () => ({
  module: {
    rules: [
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
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    contentBase: './public',
    historyApiFallback: { index: '/', disableDotRule: true },
  }
});
