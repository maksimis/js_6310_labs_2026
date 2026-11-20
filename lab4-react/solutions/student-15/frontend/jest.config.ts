const config = {
  // Use jsdom to simulate a browser environment for React components
  testEnvironment: 'jsdom',
  // Configure ts-jest to transpile TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {tsconfig: 'tsconfig.app.json'}],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    '^react/jsx-dev-runtime$': '<rootDir>/node_modules/react/jsx-dev-runtime',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime',
    '^react$': '<rootDir>/node_modules/react',
  },
  // Specify file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Setup file for global configurations or mocks (e.g., extending Jest matchers)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Adjust path as needed
  // Ignore patterns for coverage reporting
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage'],
  // Optional: collect coverage information
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
}

export default config