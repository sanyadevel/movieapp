module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': [
      'error',
      { varsIgnorePattern: '.*', argsIgnorePattern: '.*' },
    ],
    'react/jsx-wrap-multilines': 'off',
    'no-useless-constructor': 'off',
    'react/sort-comp': 'off',
  },
};
