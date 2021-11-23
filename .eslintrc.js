module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'no-console': 'warn',
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 'warn',
    'no-unused-vars': 'warn',
  },
}
