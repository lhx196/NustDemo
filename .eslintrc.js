module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: [
    "@babel/plugin-proposal-private-methods", { "loose": true }
  ],
  // add your custom rules here
  rules: {},
}
