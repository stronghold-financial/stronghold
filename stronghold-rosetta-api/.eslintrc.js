
module.exports = {
  extends: ['stronghold'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      // this rules are disabled for auto generated files from openapigenerator
      files: ['*/types/model/*.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
}
