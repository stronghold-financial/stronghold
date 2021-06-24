module.exports = {
  extends: ['stronghold'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    'jest/no-standalone-expect': 'off',
  },
}
