const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage', '/ui-library/'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
}

export default config
