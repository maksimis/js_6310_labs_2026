'use strict';

// ===== КОНСТАНТЫ =====
const THEME_KEY = 'kaiSpringTheme';
const BUTTON_ID = 'kai-spring-toggle-btn';

// ===== СЛОЖНЫЙ СЕЛЕКТОР (два класса) =====
const MENU_LINK_SELECTOR = '.box_links .link';

// ===== ПРИМЕНЕНИЕ ВЕСЕННЕЙ ТЕМЫ =====
function applySpringTheme() {
    // 1. Основной фон страницы
    const pageWrapper = document.getElementById('page_wrapper');
    if (pageWrapper) {
        pageWrapper.style.backgroundColor = '#f1f8e9';
        pageWrapper.style.color = '#2e7d32';
        pageWrapper.style.fontFamily = 'Georgia, serif';
    }

    // 2. Слайдер
    const mainSlider = document.querySelector('.main_slider_holder');
    if (mainSlider) {
        mainSlider.style.background = '#e8f5e9';
        mainSlider.style.borderBottom = '3px solid #ff80ab';
    }

    // 3. Блок новостей
    const newsBox = document.querySelector('.news_box');
    if (newsBox) {
        newsBox.style.background = '#ffffff';
        newsBox.style.borderLeft = '4px solid #ff80ab';
        newsBox.style.padding = '15px';
    }

    // 4. Все ссылки — розовые
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.style.color = '#ff80ab';
    });

    // 5. Ссылки в меню — через сложный селектор
    const menuLinks = document.querySelectorAll(MENU_LINK_SELECTOR);
    menuLinks.forEach(link => {
        link.style.color = '#ff80ab';
        link.style.fontWeight = 'bold';
    });

    // 6. Работа с parentElement и children
    if (newsBox && newsBox.parentElement) {
        const parent = newsBox.parentElement;
        for (const child of parent.children) {
            if (child.classList && child.classList.contains('news_box')) {
                child.style.borderRadius = '12px';
            }
        }
    }

    // 7. Цветочные акценты в заголовках
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(h => {
        if (!h.textContent.startsWith('🌸')) {
            h.textContent = '🌸 ' + h.textContent;
        }
    });
}

// ===== СНЯТИЕ ТЕМЫ =====
function removeSpringTheme() {
    const pageWrapper = document.getElementById('page_wrapper');
    if (pageWrapper) {
        pageWrapper.style.backgroundColor = '';
        pageWrapper.style.color = '';
        pageWrapper.style.fontFamily = '';
    }

    const mainSlider = document.querySelector('.main_slider_holder');
    if (mainSlider) {
        mainSlider.style.background = '';
        mainSlider.style.borderBottom = '';
    }

    const newsBox = document.querySelector('.news_box');
    if (newsBox) {
        newsBox.style.background = '';
        newsBox.style.borderLeft = '';
        newsBox.style.padding = '';
    }

    document.querySelectorAll('a').forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
    });

    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(h => {
        h.textContent = h.textContent.replace(/^🌸 /, '');
    });
}

// ===== ПЕРЕКЛЮЧЕНИЕ =====
function toggleTheme() {
    const enabled = localStorage.getItem(THEME_KEY) === 'on';
    if (enabled) {
        removeSpringTheme();
        localStorage.setItem(THEME_KEY, 'off');
    } else {
        applySpringTheme();
        localStorage.setItem(THEME_KEY, 'on');
    }
    updateButtonLabel();
}

// ===== ОБНОВЛЕНИЕ КНОПКИ =====
function updateButtonLabel() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    const enabled = localStorage.getItem(THEME_KEY) === 'on';
    btn.textContent = enabled ? '🌸 Весна: вкл' : '🌸 Весна: выкл';
    btn.style.backgroundColor = enabled ? '#ff80ab' : '#81c784';
}

// ===== СОЗДАНИЕ КНОПКИ =====
function createToggleButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const container = document.querySelector('.box_links');
    if (!container) {
        console.log('[KAI Spring] контейнер .box_links не найден');
        return;
    }

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.textContent = '🌸 Весна: выкл';
    button.title = 'Переключить весеннюю тему';

    Object.assign(button.style, {
        padding: '6px 12px',
        border: 'none',
        borderRadius: '20px',
        backgroundColor: '#81c784',
        color: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
        margin: '0 0 0 8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    });

    button.addEventListener('click', toggleTheme);
    container.appendChild(button);
    updateButtonLabel();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
if (localStorage.getItem(THEME_KEY) === 'on') {
    applySpringTheme();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggleButton);
} else {
    createToggleButton();
}