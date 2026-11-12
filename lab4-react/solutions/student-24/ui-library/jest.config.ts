const config = {
  // Use jsdom to simulate a browser environment for React components
  testEnvironment: 'jsdom',
  // Configure ts-jest to transpile TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Specify file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Setup file for global configurations or mocks (e.g., extending Jest matchers)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Adjust path as needed
  // Ignore patterns for coverage reporting
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage'],
  // Optional: collect coverage information
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  coverageDirectory: 'coverage',
}

export default config