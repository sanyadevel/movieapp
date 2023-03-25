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
    'react/static-property-placement': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-wrap-multilines': 'off',
    'no-useless-constructor': 'off',
    'react/sort-comp': 'off',
    'eslint import/no-cycle': 'off',
  },
};
