const config = {
  // Use jsdom to simulate a browser environment for React components
  testEnvironment: 'jsdom',
  // Configure ts-jest to transpile TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    // один экземпляр React для приложения и библиотеки, иначе будет "Invalid hook call"
    '^react$': '<rootDir>/node_modules/react',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime',
    '^react/jsx-dev-runtime$': '<rootDir>/node_modules/react/jsx-dev-runtime',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
  },
  // Specify file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Setup file for global configurations or mocks (e.g., extending Jest matchers)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Ignore patterns for coverage reporting
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
}

export default config