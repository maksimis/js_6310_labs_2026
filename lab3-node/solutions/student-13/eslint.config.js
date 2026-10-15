import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['coverage/**', 'node_modules/**'] },
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-var': 'error',
      indent: ['error', 2, {
        FunctionDeclaration: { parameters: 'first' },
        MemberExpression: 2
      }]
    }
  }
]);
