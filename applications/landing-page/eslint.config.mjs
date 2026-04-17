import anaqioNext from '@anaqio/eslint-config/nextjs'

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.vercel/**',
      '.agents/**',
      '.agent/**',
      '.claude/**',
      '.husky/**',
      '.kiro/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'test-results/**',
      '*.config.ts',
      '*.config.mjs',
      '*.config.js',
      '*.min.js',
    ],
  },
  ...anaqioNext,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
    },
  },
]
