'use strict';

const STORAGE_KEY = 'cyberpunk-neon-enabled';

// ===== Применение/снятие стиля =====
function applyCyberpunkStyles(enabled) {
    const body = document.body;
    const html = document.documentElement;
    if (!body) return;

    if (enabled) {
        html.classList.add('cyberpunk-mode');
        body.classList.add('cyberpunk-mode');
    } else {
        html.classList.remove('cyberpunk-mode');
        body.classList.remove('cyberpunk-mode');
    }

    // ===== getElementById =====
    const pageWrapper = document.getElementById('page_wrapper');
    if (pageWrapper) {
        pageWrapper.style.backgroundColor = enabled ? '#05010a' : '';
        pageWrapper.style.color = enabled ? '#e0e0ff' : '';
    }

    // ===== querySelector =====
    const newsBox = document.querySelector('.news_box');
    if (newsBox) {
        newsBox.style.background = enabled ? '#14082a' : '';
    }

    // ===== querySelectorAll — ссылки =====
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = enabled ? '#ff5fff' : '';
    });

    // ===== querySelectorAll — заголовки =====
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(h => {
        h.style.color = enabled ? '#ff00ff' : '';
    });

    // ===== parentElement =====
    const menuLinks = document.querySelectorAll('nav a, .menu a');
menuLinks.forEach(link => {
    if (link.parentElement) {
        link.parentElement.style.borderLeft = '';
    }
});

    // ===== children =====
    if (pageWrapper) {
        const children = pageWrapper.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.transition = enabled ? 'all 0.3s ease' : '';
        }
    }

    // ===== Сложный селектор (2 класса) =====
    const specialBlocks = document.querySelectorAll('.news_box.active, .card.highlight');
    specialBlocks.forEach(block => {
        block.style.boxShadow = enabled
            ? '0 0 20px rgba(255, 0, 255, 0.6)'
            : '';
    });

    updateButtonState(enabled);
    localStorage.setItem(STORAGE_KEY, enabled);
}

// ===== Кнопка =====
function updateButtonState(enabled) {
    const btn = document.getElementById('cyberpunk-toggle-btn');
    if (!btn) return;
    btn.textContent = enabled ? '🌆' : '🌃';
    btn.title = enabled ? 'Выключить Cyberpunk' : 'Включить Cyberpunk';
    btn.classList.toggle('active', enabled);
}

function toggleCyberpunk() {
    const isEnabled = document.body.classList.contains('cyberpunk-mode');
    applyCyberpunkStyles(!isEnabled);
}

function createToggleButton() {
    if (document.getElementById('cyberpunk-toggle-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'cyberpunk-toggle-btn';
    btn.type = 'button';
    btn.textContent = '🌃';
    btn.title = 'Включить Cyberpunk';
    btn.addEventListener('click', toggleCyberpunk);

    document.body.appendChild(btn);
}

// ===== Загрузка сохранённого состояния =====
function loadSavedState() {
    const enabled = localStorage.getItem(STORAGE_KEY) === 'true';
    if (enabled) {
        applyCyberpunkStyles(true);
    } else {
        updateButtonState(false);
    }
}

// ===== Инициализация =====
function init() {
    createToggleButton();
    loadSavedState();
    console.log('Cyberpunk Neon Noir initialized');
}

// ===== Запуск =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}