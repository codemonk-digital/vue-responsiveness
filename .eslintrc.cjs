module.exports = {
  env: {
    node: true,
  	browser: true,
  	es2021: true
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
	'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false
    }
  },
  plugins: ['prettier'],
  rules: {
    'vue/no-v-html': 0,
    'prettier/prettier': 'error'
  },
  globals: {
    "vi": true
  }
}