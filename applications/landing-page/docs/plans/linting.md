# Linting and Formatting Guide

This document describes the linting and formatting setup for the Anaqio project.

## Overview

The project uses:

- **ESLint 9.x** - JavaScript and TypeScript linting (flat config format)
- **Prettier 3.x** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Tailwind CSS Plugin** - Tailwind class ordering

## Available Scripts

```bash
# Run ESLint
bun lint

# Run ESLint with auto-fix
bun lint:fix

# Format all files with Prettier
bun format

# Check formatting without making changes
bun format:check
```

## Configuration Files

### ESLint (`eslint.config.mjs`)

The ESLint configuration uses the new flat config format (ESLint 9+) and includes:

#### Plugins

- `@next/eslint-plugin-next` - Next.js 16 specific rules
- `eslint-plugin-react` - React 19 rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-import` - Import statement ordering
- `eslint-plugin-jsx-a11y` - Accessibility linting
- `eslint-plugin-tailwindcss` - Tailwind CSS class ordering
- `typescript-eslint` - TypeScript type-checking rules

#### Key Rules

- **React**: JSX runtime, self-closing components, prop sorting
- **React Hooks**: Rules of hooks, exhaustive deps
- **TypeScript**: Strict type checking with some warnings
- **Import Order**: Grouped and alphabetized imports
- **Tailwind CSS**: Class ordering for consistency
- **General**: `const` over `let`, `===` over `==`, no console (except warn/error)

#### Ignored Files

- `node_modules/`
- `.next/`
- `.vercel/`
- `build/`, `dist/`, `out/`
- `coverage/`, `test-results/`
- `*.min.js`

### Prettier (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### EditorConfig (`.editorconfig`)

Ensures consistent editor settings across different IDEs:

- 2 space indentation
- LF line endings
- UTF-8 charset
- Trim trailing whitespace

## VSCode Integration

The project includes `.vscode/settings.json` with:

- Format on save (Prettier)
- ESLint auto-fix on save
- Tailwind CSS IntelliSense
- TypeScript support

### Recommended Extensions

- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

## Next.js 16 Specific Rules

The ESLint configuration includes Next.js 16 specific rules:

- Core Web Vitals compliance
- App Router best practices
- Server Component linting
- Image optimization rules

## Supabase SSR Best Practices

For Supabase client files (`lib/supabase/**/*.ts`):

- Non-null assertions allowed for environment variables
- Proper cookie handling patterns
- Server Component vs Client Component separation

Example:

```typescript
// Allowed in Supabase client files
process.env.NEXT_PUBLIC_SUPABASE_URL!
```

## React 19 Compatibility

The configuration supports React 19 features:

- JSX transform (no need for `import React`)
- Updated hooks rules
- Server Components support

## Tailwind CSS v3

Tailwind CSS plugin ensures:

- Consistent class ordering
- No contradictory classes
- Proper variant ordering

Example:

```tsx
// ✅ Good
<button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90" />

// ❌ Will be auto-fixed
<button className="text-sm bg-primary px-4 py-2 rounded-md font-medium flex shadow items-center text-primary-foreground hover:bg-primary/90 gap-2" />
```

## TypeScript Strict Mode

The configuration uses TypeScript ESLint's recommended rules:

- Type safety enforcement
- No explicit `any` (use `unknown` or proper types)
- Prefer nullish coalescing (`??`)
- Prefer optional chain (`?.`)
- Unused variable detection

## Common Issues and Solutions

### "Unexpected token '/'" Error

This was a known issue with ESLint 9 flat config and certain plugin combinations. The current configuration has been tested and works correctly.

### `.next` Directory Linting

The `.next` directory is properly ignored. If you see errors from `.next` files, ensure your ESLint config has the ignore patterns.

### Tailwind Class Ordering

If Prettier isn't sorting Tailwind classes:

1. Ensure `prettier-plugin-tailwindcss` is installed
2. Check `.prettierrc` has the plugin configured
3. Restart VSCode

### TypeScript Errors in `.next/types`

Generated TypeScript types in `.next/types` are ignored. If you see errors, add to ignores.

## CI/CD Integration

Add to your CI pipeline:

```bash
# Check code quality
bun lint
bun format:check

# Or fix and commit
bun lint:fix
bun format
```

## Pre-commit Hooks (Optional)

To add pre-commit linting, install `lint-staged` and `husky`:

```bash
bun add -d lint-staged husky
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Migration Notes

### From ESLint 8 (eslintrc)

This project uses ESLint 9 flat config format. Key differences:

- No more `.eslintrc` file
- Config is `eslint.config.mjs` (ES module)
- Plugins are imported directly
- No `extends` - use spread operator with config objects

### From Prettier 2.x

Prettier 3.x changes:

- ESM-only (no CommonJS)
- Plugin API changes
- Faster formatting

## Resources

- [ESLint 9 Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Next.js ESLint Plugin](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Prettier](https://prettier.io/docs/en/)
- [Tailwind CSS Plugin](https://github.com/francoismassart/eslint-plugin-tailwindcss)
