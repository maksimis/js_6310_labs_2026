'use strict';

(function () {
    const STORAGE_KEY = 'kaiSepiaThemeEnabled';
    const THEME_CLASS = 'kai-sepia-theme';
    const BUTTON_ID = 'kai-sepia-toggle-btn';

    function isThemeEnabled() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    function setThemeEnabled(enabled) {
        localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
    }

    function applyTheme(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.add(THEME_CLASS);
        } else {
            body.classList.remove(THEME_CLASS);
        }
        updateButtonState(enabled);
    }

    function updateButtonState(enabled) {
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) {
            return;
        }
        btn.textContent = enabled ? '📜' : '📄';
        btn.title = enabled ? 'Сепия: включена (нажмите, чтобы выключить)' : 'Сепия: выключена (нажмите, чтобы включить)';
        if (enabled) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    function toggleTheme() {
        const currentlyEnabled = isThemeEnabled();
        const newState = !currentlyEnabled;
        setThemeEnabled(newState);
        applyTheme(newState);
    }

    function createToggleButton() {
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const buttonContainer = document.querySelector('.box.cf .box_links') ||
            document.querySelector('.box_links') ||
            document.querySelector('.access-box');

        if (!buttonContainer) {
            console.log('[KAI Sepia] Контейнер для кнопки не найден');
            return;
        }

        const button = document.createElement('div');
        button.id = BUTTON_ID;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');

        const parent = buttonContainer.parentElement;
        if (parent && parent.children) {
            const siblingCount = parent.children.length;
            console.log('[KAI Sepia] Родитель контейнера имеет детей:', siblingCount);
        }

        const pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            const allBoxes = pageWrapper.querySelectorAll('.news_box, .slider_box, .box_items');
            console.log('[KAI Sepia] Найдено блоков для стилизации:', allBoxes.length);
        }

        button.addEventListener('click', toggleTheme);
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });

        buttonContainer.appendChild(button);
        console.log('[KAI Sepia] Кнопка добавлена');

        applyTheme(isThemeEnabled());
    }

    function init() {
        if (isThemeEnabled()) {
            document.body.classList.add(THEME_CLASS);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToggleButton);
        } else {
            createToggleButton();
        }

        setTimeout(createToggleButton, 1500);
    }

    init();
})();