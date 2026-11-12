# SnakeBot — бот для игры «Змейка»

Мультиплеерная «Змейка» в VK + REST API.

## Возможности

- `/create_game` — создать партию, получить код приглашения
- `/join <код>` — подключиться к партии
- `/move <direction>` — ход (`up`, `down`, `left`, `right`)
- `/field` — показать поле

## Запуск

1. `npm install`
2. Скопируйте `.env.example` в `.env`, укажите `VK_GROUP_TOKEN`
3. `npm start`

## API

### POST /api/games

Создаёт партию. Ответ: `{ id, code }`.

### POST /api/games/:id/move

Тело: `{ player, direction }`. Ответ: `{ id, field, score }`.

## Проверки

```sh
npm run lint
npm run test:coverage