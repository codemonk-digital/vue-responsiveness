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
    ecmaVersion: 2022,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false
    }
  },
  rules: {
    'vue/no-v-html': 0,
    'arrow-body-style': 0,
    'prefer-arrow-callback': 0,
    'prettier/prettier': [
      2,
      {
        singleQuote: true,
        trailingComma: 'none',
        semi: false
      }
    ]
  },
  globals: {
    vi: true
  }
}
