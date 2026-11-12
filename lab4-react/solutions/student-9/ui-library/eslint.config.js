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
      'semi': ['error', 'never'],
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type'
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
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 0,
        maxBOF: 0
      }],
      'padded-blocks': ['error', 'never'],
      'lines-between-class-members': ['error', 'always', {
        exceptAfterSingleLine: true
      }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: ['block', 'block-like'] },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: 'function', next: 'function' },
        { blankLine: 'always', prev: 'class', next: 'class' }
      ],
    },
  },
])
