/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  extends: ['eslint:recommended', 'standard', 'plugin:prettier/recommended', 'plugin:vue/vue3-essential', '@vue/eslint-config-prettier/skip-formatting'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }]
  }
}
