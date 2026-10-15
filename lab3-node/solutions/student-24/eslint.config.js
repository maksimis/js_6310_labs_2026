// eslint.config.js
export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Отступы: 2 пробела
      'indent': ['error', 2],
      // Кавычки: только одинарные
      'quotes': ['error', 'single'],
      // Точки с запятой: обязательны
      'semi': ['error', 'always'],
      // Запрет на неиспользуемые переменные (но игнорируем те, что начинаются с _)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Запрещаем var, используем только let и const
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
];