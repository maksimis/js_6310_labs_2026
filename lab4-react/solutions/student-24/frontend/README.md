# Kanbex Frontend

Демонстрационное React-приложение Kanban-доски, использующее компоненты `KanbanColumn` и `TaskCard` из `@my-app/ui-library`.

Приложение показывает три колонки, drag-and-drop, перемещение задач стрелками и форму добавления задачи с выбором приоритета, исполнителя, колонки и тегов.

![Общий вид Kanban-доски](../images/01-board-overview.png)

![Форма добавления задачи с выбранными тегами](../images/02-add-task-form.png)

![Добавленная задача в колонке «В работе»](../images/03-added-task.png)

## Запуск

Сначала соберите библиотеку компонентов:

```sh
cd ../ui-library
npm install
npm run build
```

Затем запустите приложение:

```sh
cd ../frontend
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

## Проверки

```sh
npm run lint
npm test
npm run build
```

Полное описание проекта, структура, инструкция по запуску и остальные скриншоты находятся в [../README.md](../README.md).
