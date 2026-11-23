import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'react': react,
      'import': importPlugin
    },
  }, {
    rules: {
      "indent": ["error", 2],
      'semi': ['error', 'never'],// Правильный порядок импортов
      'import/order': ['error', {
        'groups': [
          'builtin',    // Встроенные модули (path, fs и т.д.)
          'external',   // Внешние зависимости (react, lodash и т.д.)
          'internal',   // Внутренние модули (алиасы и т.д.)
          ['parent', 'sibling'], // Родительские и соседние директории
          'index',      // index файлы
          'object',     // Object imports
          'type'        // Type imports
        ],
        'pathGroups': [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true
        }
      }],      
      // Запрет лишних переносов
      'no-multiple-empty-lines': ['error', {
        max: 1,        // максимум 1 пустая строка подряд
        maxEOF: 0,     // не допускать пустых строк в конце файла
        maxBOF: 0      // не допускать пустых строк в начале файла
      }],
      'padded-blocks': ['error', 'never'], // запрет пустых строк в начале/конце блоков
      'lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: true // разрешить без пустой строки после однострочных членов класса
      }],
      'padding-line-between-statements': [
        'error',
        // Пустая строка перед return
        { blankLine: 'always', prev: '*', next: 'return' },
        // Пустая строка перед блоками
        { blankLine: 'always', prev: '*', next: ['block', 'block-like'] },
        // Пустая строка между объявлениями переменных и следующим кодом
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        // Пустая строка между импортами и следующим кодом
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        // Пустая строка между экспортами и следующим кодом
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        // Пустая строка между функциями
        { blankLine: 'always', prev: 'function', next: 'function' },
        // Пустая строка между классами
        { blankLine: 'always', prev: 'class', next: 'class' }
      ],
    },
  },
])
