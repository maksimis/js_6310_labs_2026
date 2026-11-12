export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true
        }
      }
    ]
  },
  moduleNameMapper: {
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
}