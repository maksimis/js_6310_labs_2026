// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['coverage/**', 'data/**']
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    }
  },
  {
    rules: {
      // Отступы: 2 пробела
      'indent': [
        'error',
        2,
        {
          'FunctionDeclaration': { 'parameters': 'first' },
          'MemberExpression': 2
        }
      ],
      // Кавычки: только одинарные
      'quotes': ['error', 'single'],
      // Точки с запятой: обязательны
      'semi': ['error', 'always'],
      // Запрет на неиспользуемые переменные (но игнорируем те, что начинаются с _)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Запрет на использование необъявленных переменных
      'no-undef': 'error',
      // Запрещаем var, используем только let и const
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
]);
