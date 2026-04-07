import anaqioNext from '@anaqio/eslint-config/nextjs'

export default [
  { ignores: ['.next/', 'node_modules/', 'src/components/ui/'] },
  ...anaqioNext,
  {
    files: ['**/lib/supabase/**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
]
