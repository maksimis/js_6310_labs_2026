const config = {
  // Use jsdom to simulate a browser environment for React components
  testEnvironment: 'jsdom',
  // Configure ts-jest to transpile TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {tsconfig: 'tsconfig.app.json'}],
  },
  moduleNameMapper: {
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    '^@my-app/ui-library/style.css$': 'identity-obj-proxy',
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpe?g|gif|webp)$': '<rootDir>/src/test/fileMock.ts',
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
    '!src/main.tsx',
    '!src/setupTests.ts',
    '!src/test/**',
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