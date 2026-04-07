import anaqioNext from '@anaqio/eslint-config/nextjs'

export default [
  { ignores: ['.next/', 'node_modules/', 'components/ui/', 'aistudio/'] },
  ...anaqioNext,
  {
    // setMounted(true) in empty-dep useEffect is the standard SSR hydration-safety
    // pattern in Next.js — not a cascading render concern
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
