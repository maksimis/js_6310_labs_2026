'use strict';

/**
 * Расширение для сайта kai.ru
 * Вариант 15: Steampunk / Victorian Machinery
 * Цветовая палитра: Бронза, медь, тёплые металлические тона, состаренная бумага.
 * Элементы стиля: Викторианские двойные рамки, шестерёнки, эффект патины и пара.
 */
function initSteampunkTheme() {
    const STORAGE_KEY = 'kai_steampunk_theme_active';
    let isActive = localStorage.getItem(STORAGE_KEY) === 'true';

    // Внедрение глобальной таблицы стилей темы
    const globalStyle = document.createElement('style');
    globalStyle.id = 'steampunk-global-styles';
    globalStyle.textContent = `
        /* === 1. Базовый фон, шрифт и текст (Викторианская эстетика) === */
        body.steampunk-mode,
        body.steampunk-mode #page_wrapper {
            background-color: #1a130f !important;
            background-image: radial-gradient(circle at 50% 20%, rgba(184, 115, 51, 0.08) 0%, rgba(15, 10, 8, 0.98) 100%) !important;
            color: #ebdcb9 !important;
            font-family: 'Georgia', 'Palatino Linotype', 'Book Antiqua', 'Times New Roman', serif !important;
        }

        /* === 2. Викторианские заголовки (Бронза и полированная латунь) === */
        body.steampunk-mode h1,
        body.steampunk-mode h2,
        body.steampunk-mode h3,
        body.steampunk-mode h4,
        body.steampunk-mode h5,
        body.steampunk-mode h6,
        body.steampunk-mode .slogan {
            color: #d4af37 !important;
            font-family: 'Georgia', 'Palatino Linotype', serif !important;
            text-shadow: 1px 1px 2px #0a0705, 0 0 10px rgba(212, 175, 55, 0.45) !important;
            letter-spacing: 0.5px !important;
        }

        /* === 3. Медные акцентные ссылки с теплым свечением === */
        body.steampunk-mode a {
            color: #e08544 !important;
            transition: color 0.25s ease, text-shadow 0.25s ease !important;
        }
        body.steampunk-mode a:hover {
            color: #ffaa5e !important;
            text-shadow: 0 0 8px rgba(224, 133, 68, 0.7) !important;
        }

        /* === 4. Шапка сайта и информационные панели === */
        body.steampunk-mode header,
        body.steampunk-mode header .section,
        body.steampunk-mode header .relative,
        body.steampunk-mode header .infos {
            background-color: #140e0b !important;
            border-bottom: 2px solid #8c6239 !important;
            color: #ebdcb9 !important;
        }

        /* === 5. Главное меню (Машинное литьё, медно-бронзовый градиент) === */
        body.steampunk-mode div#menu.menu,
        body.steampunk-mode .menu,
        body.steampunk-mode #menu {
            background: linear-gradient(180deg, #3d2b20 0%, #291c16 50%, #1c130e 100%) !important;
            border-top: 2px solid #cd7f32 !important;
            border-bottom: 2px solid #8c6239 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 215, 0, 0.2) !important;
        }
        body.steampunk-mode div#menu.menu a,
        body.steampunk-mode .menu a {
            color: #f5e6cb !important;
            text-shadow: 1px 1px 2px #000000 !important;
            font-weight: 500 !important;
        }
        body.steampunk-mode div#menu.menu a:hover,
        body.steampunk-mode .menu a:hover {
            color: #ffd700 !important;
            text-shadow: 0 0 8px rgba(255, 215, 0, 0.6) !important;
        }

        /* === 6. Викторианские рамки для блоков контента и портлетов === */
        body.steampunk-mode .portlet-boundary,
        body.steampunk-mode .journal-content-article,
        body.steampunk-mode .portlet-content,
        body.steampunk-mode .portlet-layout,
        body.steampunk-mode .portlet-column,
        body.steampunk-mode .news_box,
        body.steampunk-mode .institutes_box {
            background-color: #251c16 !important;
            border: 2px solid #8c6239 !important;
            outline: 1px solid #b87333 !important;
            outline-offset: -3px !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.65), inset 0 0 12px rgba(184, 115, 51, 0.12) !important;
            border-radius: 4px !important;
            color: #ebdcb9 !important;
        }

        /* === 7. Секции и слайдеры === */
        body.steampunk-mode .section-wide,
        body.steampunk-mode .slider_box,
        body.steampunk-mode .section-wide.slider_box,
        body.steampunk-mode .main_slider_holder,
        body.steampunk-mode .page_holder {
            background-color: #17110e !important;
            border-color: #704214 !important;
        }

        /* === 8. Винтажные фотографии (Эффект дагеротипа / сепия) === */
        body.steampunk-mode img:not(.medals):not(#steampunk-toggle-btn img) {
            filter: sepia(0.55) contrast(1.12) brightness(0.88) hue-rotate(-10deg) !important;
            border: 1px solid #704214 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
            border-radius: 3px !important;
            transition: filter 0.3s ease !important;
        }
        body.steampunk-mode img:not(.medals):not(#steampunk-toggle-btn img):hover {
            filter: sepia(0.2) contrast(1.05) brightness(0.96) !important;
        }

        /* === 9. Кнопки сайта (Медная фурнитура, заклепки) === */
        body.steampunk-mode a.kai-btn-block,
        body.steampunk-mode button.kai-btn-block,
        body.steampunk-mode .kai-btn-block,
        body.steampunk-mode button.prev-arr,
        body.steampunk-mode button.next-arr {
            background: linear-gradient(180deg, #965d38 0%, #704214 50%, #4a2c0d 100%) !important;
            color: #fff1d6 !important;
            border: 2px solid #cd7f32 !important;
            border-radius: 4px !important;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
            text-shadow: 1px 1px 2px #000000 !important;
            font-family: 'Georgia', serif !important;
        }
        body.steampunk-mode a.kai-btn-block:hover,
        body.steampunk-mode button.kai-btn-block:hover,
        body.steampunk-mode button.prev-arr:hover,
        body.steampunk-mode button.next-arr:hover {
            background: linear-gradient(180deg, #b87333 0%, #8c531b 50%, #5e360f 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 0 12px rgba(205, 127, 50, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
        }

        /* === 10. Боковое меню навигации (Для страниц разделов) === */
        body.steampunk-mode ul.layouts,
        body.steampunk-mode ul.layouts.level-2,
        body.steampunk-mode li.open.selected,
        body.steampunk-mode li.selected {
            background-color: #241b16 !important;
            border-color: #8c6239 !important;
        }
        body.steampunk-mode ul.layouts li a,
        body.steampunk-mode li.open.selected > a,
        body.steampunk-mode li.selected > a {
            background-color: #241b16 !important;
            color: #e08544 !important;
            border-left: 3px solid #b87333 !important;
            padding-left: 10px !important;
        }
        body.steampunk-mode ul.layouts li a:hover {
            background-color: #35251d !important;
            color: #ffd700 !important;
        }

        /* === 11. Хлебные крошки (Викторианский указатель) === */
        body.steampunk-mode ul.breadcrumb,
        body.steampunk-mode ul.breadcrumb-horizontal,
        body.steampunk-mode .breadcrumb {
            background-color: #201713 !important;
            border: 1px solid #8c6239 !important;
            border-radius: 3px !important;
            color: #d4b483 !important;
            padding: 6px 12px !important;
        }
        body.steampunk-mode ul.breadcrumb a,
        body.steampunk-mode ul.breadcrumb-horizontal a {
            color: #e08544 !important;
        }
        body.steampunk-mode ul.breadcrumb span.divider {
            color: #8c6239 !important;
        }

        /* === 12. Подвал сайта (Чугунное основание с бронзовой отделкой) === */
        body.steampunk-mode footer,
        body.steampunk-mode [class*="footer"],
        body.steampunk-mode #footer {
            background-color: #120c0a !important;
            border-top: 3px double #b87333 !important;
            color: #bfa88f !important;
        }

        /* === 13. Таблицы и разделители === */
        body.steampunk-mode table,
        body.steampunk-mode th,
        body.steampunk-mode td {
            border-color: #704214 !important;
            color: #ebdcb9 !important;
        }
        body.steampunk-mode th {
            background-color: #38271e !important;
            color: #d4af37 !important;
        }

        /* === 14. Стили кнопки переключения режимов (Часовой безель) === */
        #steampunk-toggle-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 4px 12px;
            height: 32px;
            box-sizing: border-box;
            cursor: pointer;
            user-select: none;
            border-radius: 4px;
            font-family: 'Georgia', 'Palatino Linotype', serif;
            font-size: 13px;
            font-weight: bold;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            z-index: 99999;
        }
        #steampunk-toggle-btn .gear-icon {
            display: inline-block;
            font-size: 16px;
            transition: transform 0.6s ease-in-out;
        }
        #steampunk-toggle-btn:hover .gear-icon {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(globalStyle);

    /**
     * Основная функция переключения и применения стилей
     * Использует обязательные методы: getElementById, querySelector, querySelectorAll, parentElement, children
     */
    function applyTheme() {
        // 1) Использование document.getElementById
        const pageWrapper = document.getElementById('page_wrapper') || document.body;
        const accessBox = document.getElementById('access-box');

        // 2) Использование document.querySelector со сложным селектором (тег + id + класс)
        const menuElement = document.querySelector('div#menu.menu');

        // 3) Использование document.querySelectorAll со сложными составными селекторами
        // Сложный селектор заголовков
        const articleHeadings = document.querySelectorAll(
            '.journal-content-article h3, .portlet-content h2, .portlet-boundary h4'
        );

        // Сложный селектор тега с двумя классами и модификаторами
        const sectionBoxes = document.querySelectorAll(
            'div.section-wide.slider_box, .institutes_box, .page_holder'
        );

        // Сложный селектор кнопок
        const kaiButtons = document.querySelectorAll(
            'a.kai-btn-block, button.kai-btn-block'
        );

        const allPortlets = document.querySelectorAll('.portlet-boundary');
        const allLinks = document.querySelectorAll('a');
        const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (isActive) {
            // Включение темы: добавление класса
            document.body.classList.add('steampunk-mode');

            // 1. Изменение фона, цвета и шрифта страницы
            pageWrapper.style.backgroundColor = '#1a130f';
            pageWrapper.style.color = '#ebdcb9';
            pageWrapper.style.fontFamily = 'Georgia, "Palatino Linotype", "Book Antiqua", serif';

            // 2. Стилизация главного меню
            if (menuElement) {
                menuElement.style.backgroundColor = '#291c16';
                menuElement.style.borderTop = '2px solid #cd7f32';
                menuElement.style.borderBottom = '2px solid #8c6239';
                menuElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.7)';
            }

            // 3. Стилизация блоков portlet (викторианские рамки)
            allPortlets.forEach(function (portlet) {
                portlet.style.backgroundColor = '#251c16';
                portlet.style.borderColor = '#8c6239';
                portlet.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.65)';
                portlet.style.borderRadius = '4px';
            });

            // 4. Стилизация заголовков (золотистый отблеск, викторианский интервал)
            articleHeadings.forEach(function (el) {
                el.style.color = '#d4af37';
                el.style.textShadow = '1px 1px 2px #0a0705, 0 0 10px rgba(212, 175, 55, 0.45)';
                el.style.letterSpacing = '0.5px';
            });

            allHeadings.forEach(function (el) {
                el.style.color = '#d4af37';
            });

            // 5. Стилизация ссылок (медь)
            allLinks.forEach(function (link) {
                link.style.color = '#e08544';
            });

            // 6. Стилизация секций
            sectionBoxes.forEach(function (box) {
                box.style.backgroundColor = '#17110e';
            });

            // 7. Стилизация кнопок
            kaiButtons.forEach(function (btn) {
                btn.style.background = 'linear-gradient(180deg, #965d38 0%, #704214 50%, #4a2c0d 100%)';
                btn.style.color = '#fff1d6';
                btn.style.borderColor = '#cd7f32';
            });

            // 4) и 5) Использование parentElement и children для обхода структуры DOM
            const container = document.querySelector('.portlet-content-container') ||
                                  document.querySelector('.portlet-layout') ||
                                  document.querySelector('.page_holder');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        const child = parent.children[i];
                        if (child.classList.contains('portlet-boundary') || child.classList.contains('portlet-layout')) {
                            child.style.backgroundColor = '#251c16';
                            child.style.border = '2px solid #8c6239';
                            child.style.marginBottom = '12px';
                            child.style.padding = '8px';
                        }
                    }
                }
            }

            if (accessBox) {
                accessBox.style.backgroundColor = '#140e0b';
                accessBox.style.borderBottom = '1px solid #704214';
            }

            console.log('[Steampunk] Стиль Steampunk / Victorian Machinery активирован');
        } else {
            // Выключение темы: удаление класса и сброс inline стилей
            document.body.classList.remove('steampunk-mode');

            pageWrapper.style.backgroundColor = '';
            pageWrapper.style.color = '';
            pageWrapper.style.fontFamily = '';

            if (menuElement) {
                menuElement.style.backgroundColor = '';
                menuElement.style.borderTop = '';
                menuElement.style.borderBottom = '';
                menuElement.style.boxShadow = '';
            }

            allPortlets.forEach(function (portlet) {
                portlet.style.backgroundColor = '';
                portlet.style.borderColor = '';
                portlet.style.boxShadow = '';
                portlet.style.borderRadius = '';
            });

            articleHeadings.forEach(function (el) {
                el.style.color = '';
                el.style.textShadow = '';
                el.style.letterSpacing = '';
            });

            allHeadings.forEach(function (el) {
                el.style.color = '';
            });

            allLinks.forEach(function (link) {
                link.style.color = '';
            });

            sectionBoxes.forEach(function (box) {
                box.style.backgroundColor = '';
            });

            kaiButtons.forEach(function (btn) {
                btn.style.background = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            });

            const container = document.querySelector('.portlet-content-container') ||
                                  document.querySelector('.portlet-layout') ||
                                  document.querySelector('.page_holder');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        const child = parent.children[i];
                        child.style.backgroundColor = '';
                        child.style.border = '';
                        child.style.marginBottom = '';
                        child.style.padding = '';
                    }
                }
            }

            if (accessBox) {
                accessBox.style.backgroundColor = '';
                accessBox.style.borderBottom = '';
            }

            console.log('[Steampunk] Стиль Steampunk / Victorian Machinery отключен');
        }

        // Сохранение состояния в localStorage
        localStorage.setItem(STORAGE_KEY, isActive.toString());
        updateToggleButton();
    }

    /**
     * Обновление визуального состояния и текста кнопки статуса
     */
    function updateToggleButton() {
        const btn = document.getElementById('steampunk-toggle-btn');
        if (!btn) {
            return;
        }

        if (isActive) {
            btn.innerHTML = '<span class="gear-icon">⚙️</span> Steampunk: ВКЛ';
            btn.title = 'Стиль Steampunk: ВКЛ (нажмите для выключения)';
            btn.style.background = 'linear-gradient(135deg, #cd7f32 0%, #8c5a2b 50%, #54371a 100%)';
            btn.style.color = '#fff4dc';
            btn.style.border = '2px ridge #ffd700';
            btn.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
        } else {
            btn.innerHTML = '<span class="gear-icon">⚙️</span> Steampunk: ВЫКЛ';
            btn.title = 'Стиль Steampunk: ВЫКЛ (нажмите для включения)';
            btn.style.background = 'linear-gradient(135deg, #3d342f 0%, #25201d 100%)';
            btn.style.color = '#c7b299';
            btn.style.border = '2px solid #705845';
            btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.4)';
        }
    }

    /**
     * Создание кнопки управления стилем на странице
     */
    function createToggleButton() {
        if (document.getElementById('steampunk-toggle-btn')) {
            return;
        }

        // Поиск оптимального контейнера для размещения кнопки
        const menuSection = document.querySelector('div#menu.menu .section') || document.querySelector('.menu .section');
        const menuElement = document.querySelector('div#menu.menu') || document.querySelector('.menu');
        const boxLinks = document.querySelector('.box_links');
        const buttonContainer = menuSection || menuElement || boxLinks || document.body;

        const button = document.createElement('div');
        button.id = 'steampunk-toggle-btn';

        if (buttonContainer === document.body) {
            // Фиксированное позиционирование в верхнем правом углу, если разметка не содержит меню
            button.style.position = 'fixed';
            button.style.top = '12px';
            button.style.right = '16px';
        } else {
            // Встраивание в блок меню / шапки
            button.style.float = 'right';
            button.style.margin = '3px 10px 3px 0';
        }

        button.addEventListener('click', function () {
            isActive = !isActive;
            applyTheme();
        });

        buttonContainer.appendChild(button);
        updateToggleButton();

        // Если стиль был включен ранее — применяем его
        if (isActive) {
            applyTheme();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

initSteampunkTheme();
