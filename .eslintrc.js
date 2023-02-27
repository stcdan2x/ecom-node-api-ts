const os = require('os');

module.exports = {
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb/hooks',
    'plugin:eslint-comments/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['gql/**/types', '!.storybook'],
  overrides: [{
    files: ['**/*.ts', '**/*.tsx'],
    extends: ['airbnb-typescript'],
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
      '@typescript-eslint/brace-style': ['error', 'stroustrup'],
    },
  }, {
    files: ['**/*.stories.*', '.storybook/preview.tsx'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'react/destructuring-assignment': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  }],
  rules: {
    'id-length': ['error', { exceptions: ['_', 'e'] }],
    'linebreak-style': ['error', os.EOL === '\n' ? 'unix' : 'windows'],
    'no-restricted-exports': ['error', {
      restrictedNamedExports: [
        'then',
      ],
    }],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': ['error', {
      html: 'enforce',
      custom: 'ignore',
      explicitSpread: 'ignore',
      exceptions: [],
    }],
    'react/no-array-index-key': 'off',
  },
};
