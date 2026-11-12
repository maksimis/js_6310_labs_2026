"use strict";

// Плагин «Осень» для kai.ru
// Фон цвета охры (#fff3e0), текст коричневый (#6d4c41).
// Кнопка включает/выключает тему, статус хранится в localStorage.

const STORAGE_KEY = "autumn-theme";

// Стили темы. Они работают, только когда у <body> есть класс autumn
// или когда скрипт повесил класс на элемент (autumn-page, autumn-panel...).
const css = `
#autumn-btn {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 99999;
  padding: 8px 14px;
  border: none;
  border-radius: 16px;
  background-color: #8d6e63;
  color: #ffffff;
  cursor: pointer;
}
body.autumn,
.autumn-page {
  background-color: #fff3e0 !important;
  color: #6d4c41 !important;
  font-family: Georgia, serif !important;
}
body.autumn header,
body.autumn .portlet {
  background-color: #fff3e0 !important;
}
body.autumn #content p,
body.autumn #content h2 {
  color: #6d4c41 !important;
}
body.autumn #content h2 {
  border-bottom: 2px solid #ffb74d !important;
}
body.autumn #content .research_box p {
  color: #ffffff !important;
}
.autumn-panel {
  background-color: #ffe0b2 !important;
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}
.autumn-card {
  border: 1px solid #d7b48a !important;
}
.autumn-item {
  border-bottom: 1px solid #ffb74d !important;
}
`;

// Добавляем стили на страницу
const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

// Включает (on = true) или выключает (on = false) тему
function applyTheme(on) {
  document.body.classList.toggle("autumn", on);

  // getElementById: главный контейнер страницы
  const page = document.getElementById("page_wrapper");
  if (page) {
    page.classList.toggle("autumn-page", on);
  }

  // querySelector: блок новостей
  const news = document.querySelector(".news_box");
  if (news) {
    news.classList.toggle("autumn-panel", on);

    // children: каждая новость внутри блока
    for (const card of news.children) {
      card.classList.toggle("autumn-card", on);
    }
  }

  // querySelectorAll со сложным селектором: ссылки внутри пунктов списков
  const links = document.querySelectorAll("ul li > a[href]");
  links.forEach((link) => {
    // parentElement: пункт <li>, в котором лежит ссылка
    link.parentElement.classList.toggle("autumn-item", on);
  });
}

// Кнопка со статусом
const button = document.createElement("button");
button.id = "autumn-btn";
document.body.appendChild(button);

function updateButton(on) {
  button.textContent = on ? "Осень: включена" : "Осень: выключена";
}

button.addEventListener("click", () => {
  const on = !document.body.classList.contains("autumn");
  applyTheme(on);
  updateButton(on);
  localStorage.setItem(STORAGE_KEY, on);
});

// При загрузке страницы восстанавливаем сохранённый статус
const savedOn = localStorage.getItem(STORAGE_KEY) === "true";
applyTheme(savedOn);
updateButton(savedOn);
