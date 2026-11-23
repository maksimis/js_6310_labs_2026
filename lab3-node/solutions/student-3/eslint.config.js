import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest // Обязательно оставляем для прохождения линтера в тестах
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-var': 'error',
      'indent': [
        'error',
        2,
        {
          'FunctionDeclaration': {
            'parameters': 'first'
          },
          'MemberExpression': 2
        }
      ]
    }
  }
];