This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

The project follows a feature-based architecture with Next.js App Router:

```
├── src/                    # Source code
│   ├── app/                # Next.js App Router
│   │   ├── checkout/       # Checkout route group
│   │   │   ├── confirmation/
│   │   │   ├── payment/
│   │   │   └── shipping/
│   │   └── page.tsx        # Homepage
│   ├── features/           # Feature modules
│   │   ├── cart/           # Cart feature
│   │   │   ├── __tests__/  # Tests for cart feature
│   │   │   ├── components/ # Cart-specific components
│   │   │   ├── hooks/      # Cart-related hooks
│   │   │   ├── services/   # Cart API services
│   │   │   ├── store/      # Cart state management
│   │   │   ├── types/      # TypeScript interfaces
│   │   │   └── utils/      # Utility functions
│   │   ├── checkout/
│   │   ├── confirmation/
│   │   └── shipping/
│   ├── shared/             # Shared code across features
│   │   ├── components/     # Shared components
│   │   │   ├── forms/      # Form components
│   │   │   └── ui/         # UI components
│   │   ├── constants/      # App constants
│   │   ├── hooks/          # Shared hooks
│   │   ├── lib/           
│   │   │   └── utils/      # Utility functions
│   │   └── store/          # Root store setup
│   └── types/              # Global TypeScript types
├── public/                 # Static files
├── .husky/                 # Git hooks
│   └── pre-commit          # Pre-commit hook
├── eslint.config.mjs       # ESLint configuration
├── .prettierrc             # Prettier configuration
├── next.config.ts          # Next.js configuration
└── tsconfig.json           # TypeScript configuration
```

## Code Quality Tools

### ESLint Configuration

The project uses ESLint with a flat configuration format (`eslint.config.mjs`):

```javascript
// ESLint configuration highlights
export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
```

Run ESLint checks:
```bash
npm run lint
```

Fix automatically fixable issues:
```bash
npm run lint:fix
```

### Prettier Configuration

The project uses Prettier for consistent code formatting (`.prettierrc`):

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Format your code:
```bash
npm run format
```

### Husky and lint-staged

The project uses Husky to manage Git hooks and lint-staged to run linters on staged files.

#### Husky

Husky is automatically installed when running `npm install` via the `prepare` script:

```json
"scripts": {
  "prepare": "husky install"
}
```

The pre-commit hook runs lint-staged to ensure code quality before each commit:

```bash
#!/bin/sh
npx lint-staged
```

#### lint-staged

lint-staged configuration in `package.json` runs Prettier and ESLint on staged files:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

This setup ensures:
- Code is automatically formatted before commit
- Linting issues are fixed when possible
- Only quality code gets committed to the repository

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code issues |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code using Prettier |
| `npm run type-check` | Check TypeScript types without emitting files |
| `npm test` | Run Jest tests |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
