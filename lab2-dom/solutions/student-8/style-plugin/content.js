'use strict';

// ===== НАСТРОЙКИ =====
const STORAGE_KEY = 'griffindor_theme_active';

// ===== ГЛАВНАЯ ФУНКЦИЯ =====
function initGriffindorTheme() {
    // 1. getElementById — ищем главный контейнер
    let pageWrapper = document.getElementById('page_wrapper');
    if (!pageWrapper) {
        pageWrapper = document.body;
    }

    // 2. querySelector со СЛОЖНЫМ селектором — ищем меню
    const menuElement = document.querySelector('div#menu.menu, .box_links, header');

    // 3. querySelectorAll — собираем элементы для стилизации
    const allCards = document.querySelectorAll(
        '.portlet-boundary, .portlet-content, .journal-content-article, .news_box'
    );
    const allLinks = document.querySelectorAll('a');
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // ===== СТИЛИ =====
    const style = document.createElement('style');
    style.id = 'griffindor-styles';
    style.textContent = `
        /* 1. Основной фон — тёмно-бордовый */
        body.griffindor-mode {
            background-color: #1a0400 !important;
            color: #f5e6c8 !important;
        }

        /* 2. Заголовки — золотые */
        body.griffindor-mode h1,
        body.griffindor-mode h2,
        body.griffindor-mode h3,
        body.griffindor-mode h4,
        body.griffindor-mode h5,
        body.griffindor-mode h6 {
            color: #eeba30 !important;
            text-shadow: 0 0 8px rgba(238, 186, 48, 0.4) !important;
        }

        /* 3. Карточки и блоки — алые с золотой рамкой */
        body.griffindor-mode .portlet-boundary,
        body.griffindor-mode .portlet-content,
        body.griffindor-mode .journal-content-article,
        body.griffindor-mode .news_box {
            background-color: #740001 !important;
            border: 1px solid #eeba30 !important;
            color: #f5e6c8 !important;
        }

        /* 4. Ссылки — золотые */
        body.griffindor-mode a {
            color: #ffd966 !important;
        }
        body.griffindor-mode a:hover {
            color: #fff2b3 !important;
            text-shadow: 0 0 10px #ffd966 !important;
        }

        /* 5. Меню и навигация */
        body.griffindor-mode .menu,
        body.griffindor-mode #menu,
        body.griffindor-mode header {
            background-color: #2b0606 !important;
            border-bottom: 2px solid #eeba30 !important;
        }

        /* 6. Кнопки */
        body.griffindor-mode button,
        body.griffindor-mode .btn {
            background-color: #a62122 !important;
            color: #eeba30 !important;
            border: 1px solid #eeba30 !important;
        }
        body.griffindor-mode button:hover,
        body.griffindor-mode .btn:hover {
            background-color: #eeba30 !important;
            color: #740001 !important;
        }

        /* 7. Футер */
        body.griffindor-mode footer,
        body.griffindor-mode #footer {
            background-color: #2b0606 !important;
            color: #a62122 !important;
            border-top: 2px solid #eeba30 !important;
        }

        /* 8. Текст в параграфах */
        body.griffindor-mode p,
        body.griffindor-mode span,
        body.griffindor-mode li,
        body.griffindor-mode td {
            color: #f5e6c8 !important;
        }

        /* 9. Изображения — лёгкий тёплый фильтр */
        body.griffindor-mode img {
            filter: sepia(0.3) brightness(0.9) !important;
        }
    `;        
    document.head.appendChild(style);

    // ===== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ =====
    let isActive = localStorage.getItem(STORAGE_KEY) === 'true';

    function toggleTheme() {
        if (isActive) {
            // ВКЛЮЧАЕМ
            document.body.classList.add('griffindor-mode');

            // Дополнительно меняем стили через JS (требование использовать методы DOM)
            // 4. parentElement + 5. children — обходим всех детей контейнера
            if (pageWrapper && pageWrapper.children) {
                for (let i = 0; i < pageWrapper.children.length; i++) {
                    const child = pageWrapper.children[i];
                    if (child.classList && child.classList.contains('portlet-boundary')) {
                        child.style.marginBottom = '10px';
                    }
                }
            }

            // Меняем цвет ссылок через JS (не только через CSS)
            allLinks.forEach(function(link) {
                link.style.color = '#ffd966';
            });

            // Меняем заголовки через JS
            allHeadings.forEach(function(heading) {
                heading.style.color = '#eeba30';
            });

            console.log('[Гриффиндор] Тема включена');
        } else {
            // ВЫКЛЮЧАЕМ
            document.body.classList.remove('griffindor-mode');

            // Возвращаем стили ссылок
            allLinks.forEach(function(link) {
                link.style.color = '';
            });

            allHeadings.forEach(function(heading) {
                heading.style.color = '';
            });

            console.log('[Гриффиндор] Тема выключена');
        }

        // Сохраняем состояние
        localStorage.setItem(STORAGE_KEY, isActive.toString());
        updateButton();
    }

    // ===== СОЗДАНИЕ КНОПКИ =====
    function createToggleButton() {
        // Проверяем, что кнопки ещё нет
        if (document.getElementById('griffindor-toggle-btn')) {
            return;
        }

        const button = document.createElement('div');
        button.id = 'griffindor-toggle-btn';
        button.title = 'Переключить тему Гриффиндора';

        // Стили кнопки
        Object.assign(button.style, {
            width: '40px',
            height: '40px',
            border: '2px solid #eeba30',
            backgroundColor: '#740001',
            color: '#eeba30',
            fontSize: '20px',
            cursor: 'pointer',
            textAlign: 'center',
            lineHeight: '38px',
            borderRadius: '50%',
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: '99999',
            boxShadow: '0 0 12px rgba(238, 186, 48, 0.7)',
            userSelect: 'none'
        });

        // Клик — переключение
        button.addEventListener('click', function() {
            isActive = !isActive;
            toggleTheme();
        });

        // Наведение — увеличиваем
        button.addEventListener('mouseenter', function() {
            button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', function() {
            button.style.transform = 'scale(1)';
        });

        document.body.appendChild(button);
        updateButton();

        // Если тема была включена ранее — включаем сразу
        if (isActive) {
            toggleTheme();
        }
    }

    // ===== ОБНОВЛЕНИЕ ИКОНКИ КНОПКИ =====
    function updateButton() {
        const btn = document.getElementById('griffindor-toggle-btn');
        if (btn) {
            btn.textContent = isActive ? '🦁' : '⚡';
            btn.title = isActive
                ? 'Тема Гриффиндора: ВКЛ'
                : 'Тема Гриффиндора: ВЫКЛ';
        }
    }

    // ===== ЗАПУСК =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

// Запускаем
initGriffindorTheme();