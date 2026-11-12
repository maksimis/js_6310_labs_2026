const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/index.ts',
    '!src/types.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    'src/QuestionCard/QuestionCard.tsx': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}

export default config