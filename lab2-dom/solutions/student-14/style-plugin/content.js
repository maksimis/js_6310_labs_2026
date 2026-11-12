'use strict';

// ===== КОНСТАНТЫ =====
const THEME_KEY = 'kaiSummerTheme';
const BUTTON_ID = 'kai-summer-toggle-btn';

// ===== СЛОЖНЫЙ СЕЛЕКТОР: два класса + псевдокласс =====
const MENU_LINK_SELECTOR = '.box_links .link:not(:first-child)';

// ===== ПРИМЕНЕНИЕ / СНЯТИЕ ТЕМЫ (одна функция на оба случая) =====
function setSummerTheme(on) {
    const set = (el, prop, val) => { if (el) el.style[prop] = on ? val : ''; };

    // 1–3. Основные стили страницы
    const wrapper = document.getElementById('page_wrapper');
    set(wrapper, 'backgroundColor', '#fff9c4');
    set(wrapper, 'color', '#5d4037');
    set(wrapper, 'fontFamily', 'Georgia, serif');

    // 4–5. Слайдер
    const slider = document.querySelector('.main_slider_holder');
    set(slider, 'background', '#fff9c4');
    set(slider, 'borderBottom', '3px solid #ffb300');

    // 6–8. Блок новостей
    const news = document.querySelector('.news_box');
    set(news, 'background', '#fffde7');
    set(news, 'borderLeft', '4px solid #ffb300');
    set(news, 'padding', '15px');

    // 9. Все ссылки
    document.querySelectorAll('a').forEach(a => set(a, 'color', '#e65100'));

    // 10. Сложный селектор + fontWeight
    document.querySelectorAll(MENU_LINK_SELECTOR).forEach(a => set(a, 'fontWeight', 'bold'));

    // 11. parentElement + children + borderRadius
    if (news && news.parentElement) {
        for (const child of news.parentElement.children) {
            set(child, 'borderRadius', '12px');
        }
    }

    // 12. Заголовки
    document.querySelectorAll('h1, h2, h3').forEach(h => set(h, 'color', '#ff6d00'));

    localStorage.setItem(THEME_KEY, on ? 'on' : 'off');
    updateButton();
}

// ===== КНОПКА =====
function updateButton() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    const on = localStorage.getItem(THEME_KEY) === 'on';
    btn.textContent = on ? '☀️ Лето: вкл' : '☀️ Лето: выкл';
    btn.style.backgroundColor = on ? '#ffb300' : '#8bc34a';
}

function createButton() {
    if (document.getElementById(BUTTON_ID)) return;
    const container = document.querySelector('.box_links');
    if (!container) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.title = 'Переключить летнюю тему';
    Object.assign(btn.style, {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '20px',
        color: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
        marginLeft: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    });
    btn.addEventListener('click', () => {
        setSummerTheme(localStorage.getItem(THEME_KEY) !== 'on');
    });
    container.appendChild(btn);
    updateButton();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
function init() {
    if (localStorage.getItem(THEME_KEY) === 'on') setSummerTheme(true);
    createButton();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}