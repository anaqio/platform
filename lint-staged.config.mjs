// Prettier only at commit-time — ESLint runs per-app in CI where each
// app's eslint.config.mjs and correct ESLint version are in scope.
export default {
  '!(mobile-app|ai-studio-base|tsx-playground)/**/*.{ts,tsx,js,mjs,json,md,css}': [
    'prettier --write',
  ],
}
