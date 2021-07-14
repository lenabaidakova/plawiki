module.exports = {
  extends: '@funboxteam',
  env: {
    browser: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
        argv: {
          mode: 'development'
        }
      }
    }
  },
};
