export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.test.*', '!src/setupTests.ts', '!src/main.tsx', '!src/index.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    './src/SourcesPanel.tsx': { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
}
