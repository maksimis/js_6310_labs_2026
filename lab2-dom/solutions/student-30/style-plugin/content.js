'use strict';

(function () {
    const STORAGE_KEY = 'kai_high_visibility_enabled';
    const HTML_CLASS = 'kai-high-visibility';
    const STYLE_ID = 'kai-hv-styles';

    // ============================================================
    // 1. Внедрение CSS внутрь страницы (замена styles.css)
    // ============================================================
    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            html.kai-high-visibility,
            html.kai-high-visibility body {
                background-color: #ffff00 !important;
                color: #000000 !important;
                font-weight: bold !important;
            }

            html.kai-high-visibility div,
            html.kai-high-visibility section,
            html.kai-high-visibility article,
            html.kai-high-visibility main,
            html.kai-high-visibility header,
            html.kai-high-visibility footer,
            html.kai-high-visibility nav,
            html.kai-high-visibility aside {
                background-color: #ffff00 !important;
                color: #000000 !important;
                border-color: #000000 !important;
            }

            html.kai-high-visibility a,
            html.kai-high-visibility a:visited {
                color: #000000 !important;
                font-weight: bold !important;
                text-decoration: underline !important;
            }

            html.kai-high-visibility h1,
            html.kai-high-visibility h2,
            html.kai-high-visibility h3,
            html.kai-high-visibility h4,
            html.kai-high-visibility h5,
            html.kai-high-visibility h6 {
                color: #000000 !important;
                font-weight: 900 !important;
                border-bottom: 3px solid #000000 !important;
                padding-bottom: 4px !important;
            }

            html.kai-high-visibility button,
            html.kai-high-visibility input[type="submit"],
            html.kai-high-visibility input[type="button"] {
                background-color: #000000 !important;
                color: #ffff00 !important;
                font-weight: bold !important;
                border: 3px solid #000000 !important;
                padding: 6px 12px !important;
            }

            html.kai-high-visibility input,
            html.kai-high-visibility textarea,
            html.kai-high-visibility select {
                background-color: #ffffff !important;
                color: #000000 !important;
                border: 3px solid #000000 !important;
                font-weight: bold !important;
            }

            html.kai-high-visibility table,
            html.kai-high-visibility th,
            html.kai-high-visibility td {
                border: 2px solid #000000 !important;
                background-color: #ffff00 !important;
                color: #000000 !important;
                font-weight: bold !important;
            }

            html.kai-high-visibility p,
            html.kai-high-visibility li {
                margin: 6px 0 !important;
                line-height: 1.6 !important;
            }

            #kai-style-toggle {
                background-color: #000000 !important;
                color: #ffff00 !important;
                border: 3px solid #000000 !important;
                font-weight: bold !important;
                padding: 8px 16px !important;
                cursor: pointer !important;
                margin: 10px !important;
                z-index: 999999 !important;
                border-radius: 4px !important;
            }

            #kai-style-toggle:hover {
                background-color: #333333 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // 2. Работа с localStorage
    // ============================================================
    function isEnabled() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    function setEnabled(value) {
        localStorage.setItem(STORAGE_KEY, String(value));
    }

    // ============================================================
    // 3. Применение / снятие класса на <html>
    // ============================================================
    function applyStyle(enabled) {
        const html = document.documentElement;
        if (enabled) {
            html.classList.add(HTML_CLASS);
        } else {
            html.classList.remove(HTML_CLASS);
        }
    }

    // ============================================================
    // 4. Обновление текста кнопки
    // ============================================================
    function updateButtonText(btn, enabled) {
        if (!btn) return;
        btn.textContent = enabled
            ? '🔆 Стиль High Visibility: ВКЛЮЧЁН (нажмите, чтобы выключить)'
            : '🔅 Стиль High Visibility: ВЫКЛЮЧЕН (нажмите, чтобы включить)';
    }

    // ============================================================
    // 5. Создание кнопки и вставка в шапку
    // ============================================================
    function createToggleButton() {
        // Если кнопка уже есть — не дублируем
        const existing = document.getElementById('kai-style-toggle');
        if (existing) return existing;

        const btn = document.createElement('button');
        btn.id = 'kai-style-toggle';
        btn.type = 'button';

        // Сложный селектор: ищем шапку / навигацию / верхний контейнер
        const headerCandidate = document.querySelector(
            'header, div[class*="header"], div[class*="Header"], nav[class*="main"], div[class*="top"], div[class*="menu"]'
        );

        if (headerCandidate) {
            headerCandidate.insertBefore(btn, headerCandidate.firstChild);
        } else {
            // Fallback: вставляем в начало body
            document.body.insertBefore(btn, document.body.firstChild);
        }

        // Обработчик клика
        btn.addEventListener('click', function () {
            const currentlyEnabled = isEnabled();
            const newState = !currentlyEnabled;

            setEnabled(newState);
            applyStyle(newState);
            updateButtonText(btn, newState);
        });

        return btn;
    }

    // ============================================================
    // 6. Демонстрация обязательных методов
    //    getElementById, querySelector, querySelectorAll,
    //    parentElement, children
    // ============================================================
    function demonstrateRequiredMethods() {
        // getElementById
        const toggleBtn = document.getElementById('kai-style-toggle');

        if (toggleBtn) {
            // parentElement — родитель кнопки
            const parent = toggleBtn.parentElement;
            if (parent) {
                // children — дети родителя
                const siblings = parent.children;
                console.log('[KAI HV] Кнопка вставлена. Детей у родителя:', siblings.length);
            }
        }

        // querySelectorAll со сложным селектором (два класса / класс + модификатор / вложенность)
        const navLinks = document.querySelectorAll(
            'header nav a, header div[class*="menu"] a, nav[class*="main"] a, div[class*="nav"] a[class*="link"]'
        );
        console.log('[KAI HV] Найдено навигационных ссылок (сложный селектор):', navLinks.length);

        // Ещё один querySelectorAll: карточки и блоки контента
        const cards = document.querySelectorAll(
            'div[class*="card"], article[class*="card"], div[class*="item"]'
        );
        console.log('[KAI HV] Найдено карточек/элементов:', cards.length);

        // querySelector — поиск главного контейнера контента
        const mainContent = document.querySelector(
            'main, div[class*="content"], div[class*="main"]'
        );
        if (mainContent) {
            console.log('[KAI HV] Найден основной контейнер:', mainContent.className || mainContent.tagName);
        }
    }

    // ============================================================
    // 7. Инициализация
    // ============================================================
    function init() {
        injectStyles();              // 1. Внедряем CSS
        const enabled = isEnabled(); // 2. Читаем статус
        applyStyle(enabled);         // 3. Применяем/снимаем класс

        const btn = createToggleButton(); // 4. Создаём кнопку
        updateButtonText(btn, enabled);   // 5. Обновляем её текст

        demonstrateRequiredMethods();     // 6. Демонстрация методов в консоли
    }

    // Запуск после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();