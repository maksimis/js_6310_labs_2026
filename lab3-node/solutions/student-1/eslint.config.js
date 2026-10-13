import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'indent': ['error', 2],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-var': 'error'
    }
  }
]);
