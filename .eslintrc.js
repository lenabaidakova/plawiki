module.exports = {
  extends: '@funboxteam',
  env: {
    browser: true
  },
  globals: {
    fetcher: true,
    System: true,
    moment: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config/webpack.config.dev.js',
      }
    }
  },
}
