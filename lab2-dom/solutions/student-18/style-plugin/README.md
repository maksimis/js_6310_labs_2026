# KAI Sepia / Old Paper

Расширение для браузера Google Chrome (Manifest V3), которое добавляет на сайт [kai.ru](https://kai.ru/) кнопку переключения стиля **«Состаренная бумага» (Sepia / Old Paper)**.

## Описание стиля

- Фон: `#f4ecd8` (тёплый бежевый, как старая бумага)
- Цвет текста: `#5a4a42` (коричневато-серый)
- Шрифты с засечками (Times New Roman, Georgia, Palatino)
- Лёгкая текстура «зерна» бумаги (SVG noise)
- Изменены фоны блоков, заголовков, ссылок, кнопок, границ, теней, отступов и т.д. (более 8 CSS-свойств)

## Функциональные возможности

- Кнопка 📄 / 📜 появляется рядом с блоком ссылок на главной и других страницах сайта
- По нажатию стиль включается / выключается
- Статус кнопки отражает текущее состояние
- Выбор сохраняется в `localStorage` и восстанавливается после перезагрузки
- Работает на главной странице и на страницах навигации (новости, события и т.д.)

## Структура проекта

```
kai-sepia-extension/
├── manifest.json
├── content.js
├── styles.css
├── README.md
└── images/
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
    ├── before.png          # пример исходного вида
    └── after.png           # пример после применения стиля
```

## Установка (режим разработчика)

1. Откройте Chrome и перейдите на `chrome://extensions/`
2. Включите **«Режим разработчика»** (переключатель в правом верхнем углу)
3. Нажмите **«Загрузить распакованное расширение»**
4. Выберите папку `kai-sepia-extension`
5. Перейдите на https://kai.ru/ — кнопка появится автоматически

## Примеры результатов

### До применения стиля

![Исходный вид главной страницы](lab2-dom/solutions/student-18/images/kai-main-before.png)
![Исходный вид вкладки студента](lab2-dom/solutions/student-18/images/kai-student-before.png)

### После применения стиля Sepia

![Стилизованный вид главной страницы](lab2-dom/solutions/student-18/images/kai-main-after.png)
![Стилизованный вид вкладки студента](lab2-dom/solutions/student-18/images/kai-student-after.png)

## Технические детали

- Используется `'use strict'`
- Нет `var`, нет `import` / `require`
- Применяются: `getElementById`, `querySelector`, `querySelectorAll` (в т.ч. сложный селектор `.box.cf .box_links`), `parentElement`, `children`
- Стили задаются через CSS-класс `kai-sepia-theme` (не прямым изменением `element.style`)
- Изменено более 8 свойств: `background-color`, `color`, `font-family`, `border`, `box-shadow`, `padding`, `line-height`, `text-decoration`, `letter-spacing`, `filter` и др.