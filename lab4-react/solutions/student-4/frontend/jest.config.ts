const config = {
  testEnvironment: 'jsdom',
  transform: {
    // Явно передаем ts-jest нужный tsconfig и разрешаем JSX
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.app.json',
      diagnostics: false 
    }],
  },
  moduleNameMapper: {
    // Указываем Jest брать исходники библиотеки
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    // Игнорируем импорт CSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
}

export default config