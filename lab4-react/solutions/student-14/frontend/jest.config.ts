// frontend/jest.config.ts
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  moduleNameMapper: {
    // ... твои старые маппинги для стилей
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // ДОБАВЛЯЕМ ЭТУ СТРОКУ:
    // Говорим Jest, что пакет @my-app/ui-library лежит в соседней папке
    '^@my-app/ui-library$': '<rootDir>/../ui-library/src/index.ts',
    
    // Если вдруг Jest будет ругаться на импорт стилей библиотеки, добавь еще это:
    '^@my-app/ui-library/style.css$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', 
    '!src/**/*.d.ts',
    '!src/main.tsx', 
    '!src/setupTests.ts'
  ],
  coverageDirectory: 'coverage',
}

export default config