const os = require('os');

module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:eslint-comments/recommended',
    'airbnb-base-typescript-prettier',
  ],
  ignorePatterns: ['gql/**/types'],
  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['airbnb-typescript'],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/brace-style': ['error', 'stroustrup'],
      },
    },
    {
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
  rules: {
    'id-length': ['error', { exceptions: ['_', 'e'] }],
    'linebreak-style': ['error', os.EOL === '\n' ? 'unix' : 'windows'],
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: ['then'],
      },
    ],
  },
};
