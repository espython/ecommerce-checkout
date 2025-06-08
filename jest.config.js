// eslint-disable-next-line import/no-anonymous-default-export
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/shared/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/shared/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/shared/types/$1',
    '^@/store/(.*)$': '<rootDir>/src/shared/store/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/shared/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/shared/lib/utils/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
}
