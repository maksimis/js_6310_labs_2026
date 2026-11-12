export default {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'CommonJS', esModuleInterop: true } }] },
  moduleNameMapper: { '\\.css$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: ['src/StepSequencer.tsx', 'src/SoundBrowser.tsx'],
  coverageDirectory: 'coverage',
  coverageThreshold: { global: { statements: 90, branches: 90, functions: 90, lines: 90 } }
}
