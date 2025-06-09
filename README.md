# Ecommerce Checkout Application

A modern, feature-rich ecommerce checkout flow built with Next.js 15, Redux, TypeScript, and Tailwind CSS.

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/espython/ecommerce-checkout.git
   cd ecommerce-checkout
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env.local` file with the following (replace with your actual values):
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**  
   Go to [http://localhost:3000](http://localhost:3000)

**To build and run for production:**

6. **Build the app:**
   ```bash
   npm run build
   ```

7. **Start the production server:**
   ```bash
   npm start
   ```



## Architecture Overview

### Folder Structure

This project follows a feature-based architecture with the Next.js App Router:

```
src/
├── app/                # Next.js App Router
│   ├── checkout/       # Checkout route group
│   │   ├── confirmation/
│   │   ├── payment/
│   │   └── shipping/
│   └── page.tsx        # Homepage
├── features/           # Feature modules
│   ├── cart/           # Cart feature
│   │   ├── __tests__/  # Tests for cart feature
│   │   ├── components/ # Cart-specific components
│   │   ├── hooks/      # Cart-related hooks
│   │   ├── services/   # Cart API services
│   │   ├── store/      # Cart state management
│   │   ├── types/      # TypeScript interfaces
│   │   └── utils/      # Utility functions
│   ├── checkout/
│   ├── confirmation/
│   └── shipping/
├── shared/             # Shared code across features
│   ├── components/     # Shared components
│   │   ├── forms/      # Form components
│   │   └── ui/         # UI components
│   ├── constants/      # App constants
│   ├── hooks/          # Shared hooks
│   ├── lib/           
│   │   └── utils/      # Utility functions
│   └── store/          # Root store setup
└── types/              # Global TypeScript types
```

### State Management

- **Redux Toolkit**: We use Redux with the Redux Toolkit for global state management, particularly for the shopping cart and checkout flow.
- **Redux Persist**: Cart data is persisted in local storage so customers don't lose their carts on page refresh.
- **RTK Query**: Used for data fetching, caching, and synchronization with server state.

### Routing

We use Next.js App Router for:
- Clean URL structure for the checkout flow
- Route groups for related features
- Loading and error states per route
- Server and client components as appropriate

## Implementation Details

### Why Redux?

We chose Redux (specifically Redux Toolkit) for several reasons:

1. **Complex state requirements**: The checkout process involves multiple steps with interdependent states that need to be accessible across components.
2. **Predictable state management**: The unidirectional data flow of Redux ensures predictable behavior.
3. **Persistence requirements**: Using redux-persist allows us to easily save cart state between sessions.
4. **DevTools integration**: Redux DevTools provides excellent debugging capabilities.
5. **RTK Query**: Integrates API calls with the store, providing automatic loading states and cache invalidation.

### Key Design Decisions

1. **Feature-based architecture**: Code is organized by business domain rather than technical role, making it easier to understand and maintain.
2. **Custom hooks for state access**: We abstract Redux usage behind custom hooks like `useCart()` so components don't need to know about Redux implementation details.
3. **Separation of concerns**: Each feature manages its own state, components, and logic.
4. **Form validation strategy**: Using react-hook-form with zod for robust validation with TypeScript integration.
5. **Testing approach**: Unit tests for utilities and components, with Jest for testing framework.

### Trade-offs

1. **Bundle size vs. developer experience**: We chose Redux Toolkit despite its bundle size impact because it significantly improves developer experience and productivity.
2. **Client-side vs. server-side rendering**: We use a mix of client and server components based on their needs, leveraging Next.js App Router capabilities.
3. **API design**: We implemented API validation on both client and server for better UX and security, with some added complexity.

## Extra Features

### FormGenerator

The application includes a powerful dynamic form generation system that simplifies form creation and validation:

```typescript
// Example usage
import { FormGenerator, FormFieldSchema } from '@/components/forms'

// Define your form schema
const formSchema: FormFieldSchema[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    required: true,
    validation: z.string().email('Invalid email address'),
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    required: true,
    validation: z.string().min(8, 'Password must be at least 8 characters'),
  },
]

// Use the FormGenerator component
<FormGenerator
  schema={formSchema}
  validationSchema={zodSchema}
  onSubmit={handleSubmit}
  submitText="Sign In"
/>
```

#### FormGenerator Advantages

1. **Reduced Boilerplate**: Define forms using a declarative schema rather than repetitive markup
2. **Built-in Validation**: Integrates with React Hook Form and Zod for robust type-safe validation
3. **Consistency**: Ensures UI consistency across all forms in the application
4. **Field Types**: Supports various field types including text, email, password, select, and checkbox
5. **Extensibility**: Easy to extend with additional field types or validation rules
6. **Accessibility**: All generated form elements are fully accessible by default
7. **Custom Styling**: Supports custom styling and theming
8. **Responsive Design**: Forms adapt to different screen sizes automatically
9. **Progressive Enhancement**: Works with both JavaScript enabled and disabled browsers

This abstraction is used throughout the checkout flow to maintain consistency while reducing development time for complex forms like shipping address collection and payment information.

### Stripe Integration

The project includes Stripe integration for payment processing:

```javascript
// Usage example
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Initialize Stripe in your payment component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
```

To test payments, use Stripe's test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002


### Testing

The project uses Jest and React Testing Library for tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Steps to Reproduce

1. **Clone the repository**:
   ```bash
   git clone https://github.com/espython/ecommerce-checkout
   cd ecommerce-checkout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file with the following (replace with your actual values):
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Known Issues and Limitations

1. **Mobile responsiveness**: While the UI is responsive, some complex components like the payment form may need additional optimization for smaller screens.

2. **Browser compatibility**: The application is optimized for modern browsers. Internet Explorer is not supported.

3. **API rate limiting**: The Google Maps API has usage limits. Implement proper error handling in production.

4. **Payment limitations**: Currently, the Stripe integration only supports card payments. Additional payment methods could be added.

5. **Performance considerations**: 
   - Large cart sizes may impact performance on low-end devices
   - Consider implementing virtualization for large product lists

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
