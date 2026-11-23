/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          target: 'ES2020',
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          allowJs: true //разрешаем ts-jest читать JS файлы из dist
        }
      }
    ]
  },
  //разрешаем Jest трансформировать файлы библиотеки, чтобы он понял ESM из dist
  transformIgnorePatterns: [
    'node_modules/(?!(@my-app/ui-library)/)'
  ],
  moduleNameMapper: {
    // Подключаем собранную библиотеку из dist
    '^@my-app/ui-library$': '<rootDir>/../ui-library/dist/index.js',
    // Жестко фиксируем один React из папки frontend
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
}