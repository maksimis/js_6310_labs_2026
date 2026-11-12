export default {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'CommonJS', esModuleInterop: true } }] },
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime',
    '\\.css$': 'identity-obj-proxy',
    '^@student-13/music-ui$': '<rootDir>/../ui-library/src/index.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: ['src/App.tsx', 'src/audio.ts', 'src/model.ts'],
  coverageDirectory: 'coverage'
}
