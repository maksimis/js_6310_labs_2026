# frontend

Демонстрационное приложение лабораторной работы №4, использующее компоненты `ShoppingList` и `ParticipantsPanel` из `@my-app/ui-library`.

## Запуск

Перед запуском приложения соберите библиотеку компонентов (`npm run build` в папке `../ui-library`) — она подключена как локальная зависимость.

```sh
npm install
npm run dev          # http://localhost:5173
```

## Скрипты

```sh
npm run build        # production-сборка
npm run lint         # проверка ESLint
npm run lint:fix     # автоисправление
npm test             # тесты
npm run test:coverage
```
