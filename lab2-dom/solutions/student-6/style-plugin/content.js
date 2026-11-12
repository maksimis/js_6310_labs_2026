'use strict';

function addDarkItTheme() {
    const STORAGE_KEY = 'kai_dark_theme_active';
    let isActive = localStorage.getItem(STORAGE_KEY) === 'true';

    const globalStyle = document.createElement('style');
    globalStyle.id = 'dark-it-global-styles';
    globalStyle.textContent = `
        /* 1. Основной фон и текст */
        body.dark-it-mode { 
            background-color: #121212 !important; 
            color: #e0e0e0 !important;
        }
        
        /* 2. Все изображения */
        body.dark-it-mode img { 
            filter: brightness(0.8) !important; 
        }
        
        /* 3. Все блоки с контентом */
        body.dark-it-mode .portlet-boundary,
        body.dark-it-mode .journal-content-article,
        body.dark-it-mode .portlet-content,
        body.dark-it-mode .portlet-layout,
        body.dark-it-mode .portlet-column {
            background-color: #1a1a1a !important;
            border-color: #2a2a2a !important;
            color: #e0e0e0 !important;
        }
        
        /* 4. Меню */
        body.dark-it-mode .menu,
        body.dark-it-mode #menu {
            background-color: #1e1e1e !important;
            border-color: #2a2a2a !important;
        }
        
        /* 5. Боковые панели и секции */
        body.dark-it-mode .section-wide,
        body.dark-it-mode .slider_box,
        body.dark-it-mode .section-wide.slider_box,
        body.dark-it-mode [class*="slider_box"],
        body.dark-it-mode .institutes_slider_box,
        body.dark-it-mode .page_holder,
        body.dark-it-mode .main_slider_holder {
            background-color: #121212 !important;
        }
        
        /* 6. Голубые блоки институтов */
        body.dark-it-mode .institutes_box,
        body.dark-it-mode [class*="institutes"],
        body.dark-it-mode .column-1,
        body.dark-it-mode .columns-1 {
            background-color: #1a1a1a !important;
        }
        
        /* 7. Заголовки */
        body.dark-it-mode h1,
        body.dark-it-mode h2,
        body.dark-it-mode h3,
        body.dark-it-mode h4,
        body.dark-it-mode h5,
        body.dark-it-mode h6 {
            color: #f0f0f0 !important;
        }
        
        /* 8. Ссылки */
        body.dark-it-mode a {
            color: #7ab8e0 !important;
        }
        body.dark-it-mode a:hover {
            color: #9fd0f0 !important;
        }
        
        /* 9. Текст в параграфах и span */
        body.dark-it-mode p,
        body.dark-it-mode span,
        body.dark-it-mode div,
        body.dark-it-mode li,
        body.dark-it-mode td,
        body.dark-it-mode th {
            color: #d0d0d0 !important;
        }
        
        /* 10. Карточки новостей */
        body.dark-it-mode .portlet-message-boards,
        body.dark-it-mode .journal-content,
        body.dark-it-mode .entry-body {
            background-color: #1a1a1a !important;
            border-color: #2a2a2a !important;
        }
        
        /* 11. Футер */
        body.dark-it-mode footer,
        body.dark-it-mode [class*="footer"],
        body.dark-it-mode #footer {
            background-color: #0f0f0f !important;
            color: #a0a0a0 !important;
        }
        
        /* 12. Шапка */
        body.dark-it-mode header,
        body.dark-it-mode [class*="header"],
        body.dark-it-mode #header {
            background-color: #1a1a1a !important;
        }
        
        /* 13. Все div элементы */
        body.dark-it-mode div {
            background-color: transparent !important;
        }
        
        /* 14. Конкретные блоки с background-color */
        body.dark-it-mode [style*="background-color"] {
            background-color: #1a1a1a !important;
        }
        
        /* 15. Границы */
        body.dark-it-mode * {
            border-color: #2a2a2a !important;
        }
        
        /* 16. Кнопки kai-btn-block (ВСЕ НОВОСТИ, стрелки) */
        body.dark-it-mode a.kai-btn-block,
        body.dark-it-mode button.kai-btn-block,
        body.dark-it-mode .kai-btn-block,
        body.dark-it-mode button.prev-arr,
        body.dark-it-mode button.next-arr {
            background-color: #1a1a1a !important;
            color: #7ab8e0 !important;
            border-color: #2a2a2a !important;
        }
        
        body.dark-it-mode a.kai-btn-block:hover,
        body.dark-it-mode button.kai-btn-block:hover,
        body.dark-it-mode button.prev-arr:hover,
        body.dark-it-mode button.next-arr:hover {
            background-color: #252525 !important;
            color: #9fd0f0 !important;
        }
        
        /* 16a. Disabled состояние (стрелки) */
        body.dark-it-mode button.kai-btn-block.slick-disabled,
        body.dark-it-mode button.prev-arr.slick-disabled,
        body.dark-it-mode button.next-arr.slick-disabled,
        body.dark-it-mode button.kai-btn-block[disabled],
        body.dark-it-mode button.prev-arr[disabled],
        body.dark-it-mode button.next-arr[disabled] {
            background-color: #151515 !important;
            color: #555555 !important;
            border-color: #2a2a2a !important;
            opacity: 0.5 !important;
        }
        
        /* 17. Табы и навигация авиатех */
        body.dark-it-mode .nav a,
        body.dark-it-mode .tabs .item {
            background-color: #1a1a1a !important;
            color: #7ab8e0 !important;
        }
        
        body.dark-it-mode .nav a.active,
        body.dark-it-mode .tabs .item.active {
            background-color: #252525 !important;
            border-color: #3a6a9a !important;
        }
        
        /* 18. Табы с background-image (затемняем фон) */
        body.dark-it-mode .tabs .item[style*="background-image"] {
            background-color: rgba(26, 26, 26, 0.9) !important;
        }
        
        /* 19. Описание в табах */
        body.dark-it-mode .tabs .item .desc,
        body.dark-it-mode .tabs .item .desc p {
            color: #d0d0d0 !important;
            background-color: transparent !important;
        }
        
        /* 20. Контейнер табов */
        body.dark-it-mode .tab_items,
        body.dark-it-mode .tabs {
            background-color: #121212 !important;
        }
        
        /* 20.1. Кнопки социальных сетей */
        body.dark-it-mode .socials a.max,
        body.dark-it-mode .socials a.rutube,
        body.dark-it-mode .socials a.telegram,
        body.dark-it-mode .socials a.vk {
            background-color: transparent !important;
            filter: brightness(0.75) saturate(0.8) !important;
        }

        body.dark-it-mode .socials a.max:hover,
        body.dark-it-mode .socials a.rutube:hover,
        body.dark-it-mode .socials a.telegram:hover,
        body.dark-it-mode .socials a.vk:hover {
            filter: brightness(0.9) saturate(1) !important;
        }
        
        /* 21. Боковое меню навигации */
        body.dark-it-mode ul.layouts,
        body.dark-it-mode ul.layouts.level-2,
        body.dark-it-mode li.open.selected,
        body.dark-it-mode li.selected {
            background-color: #1a1a1a !important;
        }
        
        body.dark-it-mode ul.layouts li a,
        body.dark-it-mode li.open.selected > a,
        body.dark-it-mode li.selected > a {
            background-color: #1a1a1a !important;
            color: #7ab8e0 !important;
            border-color: #2a2a2a !important;
        }
        
        body.dark-it-mode ul.layouts li a:hover {
            background-color: #252525 !important;
            color: #9fd0f0 !important;
        }
        
        /* 22. Хлебные крошки (breadcrumb) */
        body.dark-it-mode ul.breadcrumb,
        body.dark-it-mode ul.breadcrumb-horizontal,
        body.dark-it-mode .breadcrumb {
            background-color: #1a1a1a !important;
            border-color: #2a2a2a !important;
        }
        
        body.dark-it-mode ul.breadcrumb li,
        body.dark-it-mode ul.breadcrumb-horizontal li {
            background-color: #1a1a1a !important;
        }
        
        body.dark-it-mode ul.breadcrumb a,
        body.dark-it-mode ul.breadcrumb-horizontal a {
            color: #7ab8e0 !important;
            background-color: transparent !important;
        }
        
        body.dark-it-mode ul.breadcrumb span.divider {
            color: #555 !important;
        }
    `;
    document.head.appendChild(globalStyle);

    function toggleTheme() {
        // 1) getElementById
        const pageWrapper = document.getElementById('page_wrapper') || document.body;

        // 2) querySelector
        const menuElement = document.querySelector('div#menu.menu');
        const newsBlock = document.querySelector('.portlet-boundary');

        // 3) querySelectorAll сложный селектор
        const articleHeadings = document.querySelectorAll(
            '.journal-content-article h3, .portlet-content h2, .portlet-boundary h4'
        );

        const allPortlets = document.querySelectorAll('.portlet-boundary');
        const allLinks = document.querySelectorAll('a');
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const allSections = document.querySelectorAll('section, .section-wide, .slider_box, .institutes_box, .page_holder');

        if (isActive) {
            document.body.classList.add('dark-it-mode');

            // основной фон и текст
            pageWrapper.style.backgroundColor = '#121212';
            pageWrapper.style.color = '#e0e0e0';

            // меню
            if (menuElement) {
                menuElement.style.backgroundColor = '#1e1e1e';
                menuElement.style.borderColor = '#2a2a2a';
            }

            allPortlets.forEach(function(portlet) {
                portlet.style.backgroundColor = '#1a1a1a';
                portlet.style.borderColor = '#2a2a2a';
            });

            articleHeadings.forEach(function(el) {
                el.style.color = '#f0f0f0';
                el.style.textShadow = 'none';
            });

            allLinks.forEach(function(el) {
                el.style.color = '#7ab8e0';
            });

            allHeadings.forEach(function(el) {
                el.style.color = '#f0f0f0';
            });
            
            allSections.forEach(function(section) {
                section.style.backgroundColor = '#121212';
            });

            // 4) parentElement + 5) children
            const container = document.querySelector('.portlet-content-container');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        const child = parent.children[i];
                        if (child.classList.contains('portlet-boundary')) {
                            child.style.backgroundColor = '#1a1a1a';
                            child.style.marginBottom = '10px';
                        }
                    }
                    console.log('[Dark it] Обработано детей:', parent.children.length);
                }
            }

            console.log('[Dark it] Тёмная тема включена');

        } else {
            // ВЫКЛЮЧЕНИЕ ТЕМЫ
            document.body.classList.remove('dark-it-mode');

            pageWrapper.style.backgroundColor = '';
            pageWrapper.style.color = '';

            if (menuElement) {
                menuElement.style.backgroundColor = '';
                menuElement.style.borderColor = '';
            }

            allPortlets.forEach(function(portlet) {
                portlet.style.backgroundColor = '';
                portlet.style.borderColor = '';
            });

            articleHeadings.forEach(function(el) {
                el.style.color = '';
                el.style.textShadow = '';
            });

            allLinks.forEach(function(el) {
                el.style.color = '';
            });

            allHeadings.forEach(function(el) {
                el.style.color = '';
            });
            
            allSections.forEach(function(section) {
                section.style.backgroundColor = '';
            });

            const container = document.querySelector('.portlet-content-container');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        parent.children[i].style.backgroundColor = '';
                        parent.children[i].style.marginBottom = '';
                    }
                }
            }

            console.log('[Dark it] Тёмная тема выключена');
        }

        localStorage.setItem(STORAGE_KEY, isActive.toString());
        updateButton();
    }

    function updateButton() {
        const btn = document.getElementById('dark-it-toggle-btn');
        if (btn) {
            btn.textContent = isActive ? '🌙' : '☀️';
            btn.title = isActive
                ? 'Тёмная тема: ВКЛ'
                : 'Тёмная тема: ВЫКЛ';

            btn.style.backgroundColor = isActive ? '#2a5a8a' : '#ffffff';
            btn.style.color = isActive ? '#ffffff' : '#333333';
            btn.style.borderColor = isActive ? '#3a6a9a' : '#cccccc';
        }
    }

    function createToggleButton() {
        if (document.getElementById('dark-it-toggle-btn')) {
            return;
        }

        const menuElement = document.querySelector('div#menu.menu');
        const buttonContainer = menuElement || document.body;

        const button = document.createElement('div');
        button.id = 'dark-it-toggle-btn';
        button.title = 'Переключить тёмную тему';

        Object.assign(button.style, {
            width: '32px',
            height: '32px',
            border: '1px solid #cccccc',
            backgroundColor: '#ffffff',
            color: '#333333',
            fontSize: '18px',
            cursor: 'pointer',
            margin: '0 0 0 8px',
            textAlign: 'center',
            lineHeight: '30px',
            float: 'right',
            boxSizing: 'border-box',
            userSelect: 'none',
            borderRadius: '4px',
            zIndex: '9999'
        });

        button.addEventListener('click', function () {
            isActive = !isActive;
            toggleTheme();
        });

        buttonContainer.appendChild(button);
        updateButton();
        if (isActive) {
            toggleTheme();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addDarkItTheme();