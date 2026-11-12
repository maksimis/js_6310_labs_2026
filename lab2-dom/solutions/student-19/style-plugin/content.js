'use strict';

// 1. Внедрение CSS-стилей темы
function injectThemeStyles() {
    if (document.getElementById('south-park-theme-style')) return;
    
    const style = document.createElement('style');
    style.id = 'south-park-theme-style';
    style.textContent = `
        /* ===== НЕБО ===== */
        html.south-park-active,
        body.south-park-active {
            background-color: #87CEEB !important;
            background-attachment: fixed !important;
            color: #2C2C2C !important;
            font-family: 'Arial', sans-serif !important;
            min-height: 100% !important;
        }

        /* ===== СКРЫВАЕМ ОВЕРЛЕЙ #blur, который блокирует экран ===== */
        body.south-park-active #blur {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* ===== ОБНУЛЯЕМ ФОН ТОЛЬКО У КОНТЕНТНЫХ ОБЁРТОК ===== */
        body.south-park-active #page_wrapper,
        body.south-park-active #content,
        body.south-park-active #main-content,
        body.south-park-active .columns-1,
        body.south-park-active .portlet-layout,
        body.south-park-active .portlet-column,
        body.south-park-active .portlet-dropzone,
        body.south-park-active .portlet-content,
        body.south-park-active .portlet-content-container,
        body.south-park-active .portlet-body,
        body.south-park-active .journal-content-article,
        body.south-park-active .main_slider_holder,
        body.south-park-active .news_box,
        body.south-park-active .events_box,
        body.south-park-active .research_box,
        body.south-park-active .welcome_box,
        body.south-park-active .institutes_slider_box,
        body.south-park-active .slider_box,
        body.south-park-active .box_items,
        body.south-park-active .list,
        body.south-park-active .tab_items,
        body.south-park-active .tabs,
        body.south-park-active .page_buffer,
        body.south-park-active .row-fluid,
        body.south-park-active .span12 {
            background-color: transparent !important;
            background-image: none !important;
        }

        /* Прозрачными делаем только секции внутри контента (НЕ трогаем навигацию) */
        body.south-park-active #content .section,
        body.south-park-active #content .section-wide,
        body.south-park-active .portlet-body .section,
        body.south-park-active .portlet-body .page_holder {
            background-color: transparent !important;
            background-image: none !important;
        }

        /* ===== ДЕКОРАТИВНЫЙ КОНТЕЙНЕР (солнце + горы) ===== */
        .south-park-bg-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            display: none;
            overflow: hidden;
        }
        body.south-park-active .south-park-bg-elements {
            display: block;
        }

        /* Базовый каркас сайта */
        body.south-park-active #page_wrapper {
            position: relative;
            z-index: 2;
        }

        /* ===== КВАДРАТНОЕ СОЛНЦЕ ===== */
        .sp-sun {
            position: absolute;
            top: 30px;
            right: 80px;
            width: 90px;
            height: 90px;
            background-color: #FFD166 !important;
            border: 3px solid #333333 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* ===== ЗЕЛЁНЫЕ ГОРЫ ===== */
        .sp-mountains-back {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 45vh;
            background-color: #2D6A4F !important;
            clip-path: polygon(
                0% 100%, 0% 50%, 8% 35%, 15% 50%, 22% 28%, 30% 45%,
                38% 18%, 45% 38%, 52% 12%, 60% 35%, 68% 20%, 75% 40%,
                82% 15%, 90% 32%, 100% 25%, 100% 100%
            );
        }

        .sp-mountains-back-snow {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 45vh;
            background-color: #FFFFFF !important;
            clip-path: polygon(
                0% 50%, 8% 35%, 12% 42%, 15% 50%, 18% 42%, 22% 28%,
                26% 36%, 30% 45%, 34% 32%, 38% 18%, 42% 28%, 45% 38%,
                48% 25%, 52% 12%, 56% 22%, 60% 35%, 64% 27%, 68% 20%,
                72% 30%, 75% 40%, 78% 27%, 82% 15%, 86% 24%, 90% 32%,
                95% 28%, 100% 25%,
                100% 38%, 95% 42%, 90% 38%, 86% 45%, 82% 35%, 78% 42%,
                75% 48%, 72% 40%, 68% 35%, 64% 42%, 60% 45%, 56% 38%,
                52% 30%, 48% 40%, 45% 48%, 42% 40%, 38% 35%, 34% 45%,
                30% 52%, 26% 45%, 22% 40%, 18% 50%, 15% 55%, 12% 48%,
                8% 45%, 0% 55%
            );
        }

        .sp-mountains-front {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 28vh;
            background-color: #52B788 !important;
            clip-path: polygon(
                0% 100%, 0% 55%, 10% 40%, 20% 60%, 30% 35%, 42% 55%,
                55% 30%, 65% 50%, 78% 35%, 88% 50%, 100% 40%, 100% 100%
            );
        }

        .sp-mountains-front-snow {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 28vh;
            background-color: #FFFFFF !important;
            clip-path: polygon(
                0% 55%, 10% 40%, 15% 48%, 20% 60%, 25% 48%, 30% 35%,
                36% 45%, 42% 55%, 48% 42%, 55% 30%, 60% 40%, 65% 50%,
                72% 42%, 78% 35%, 83% 42%, 88% 50%, 94% 44%, 100% 40%,
                100% 50%, 94% 54%, 88% 58%, 83% 52%, 78% 48%, 72% 55%,
                65% 58%, 60% 52%, 55% 45%, 48% 55%, 42% 62%, 36% 55%,
                30% 50%, 25% 58%, 20% 65%, 15% 58%, 10% 52%, 0% 62%
            );
        }

        /* ===== НАВИГАЦИЯ — ПОДНИМАЕМ НАВЕРХ ===== */
        /* Header получает собственный контекст стека с высоким z-index */
        body.south-park-active header {
            background-color: #E8D5B5 !important;
            border-bottom: 3px solid #333333 !important;
            border-radius: 0 !important;
            position: relative !important;
            z-index: 1000 !important; /* ВЫШЕ всего контента */
        }

        /* Меню тоже поднимаем */
        body.south-park-active #menu,
        body.south-park-active .menu {
            background-color: #E8D5B5 !important;
            position: relative !important;
            z-index: 1000 !important;
        }

        body.south-park-active .menu .section {
            background-color: #E8D5B5 !important;
        }

        body.south-park-active .menu-list {
            background-color: #E8D5B5 !important;
        }

        body.south-park-active .menu-list > li {
            position: relative !important;
        }

        body.south-park-active .menu-list > li > a {
            color: #1B4332 !important;
            font-weight: bold !important;
        }

        body.south-park-active .menu-list > li > a:hover {
            background-color: #FFD166 !important;
            color: #000000 !important;
        }

        /* Выпадающее подменю — САМЫЙ ВЫСОКИЙ z-index */
        body.south-park-active .menu .sub {
            background-color: #FFFFFF !important;
            border: 3px solid #333333 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            position: absolute !important;
            z-index: 99999 !important; /* Максимальный приоритет */
        }

        body.south-park-active .menu .sub .page_holder {
            background-color: #FFFFFF !important;
        }

        body.south-park-active .menu .child-menu {
            background-color: #FFFFFF !important;
        }

        body.south-park-active .menu .child-menu li a {
            color: #1B4332 !important;
            background-color: #FFFFFF !important;
        }

        body.south-park-active .menu .child-menu li a:hover {
            background-color: #FFD166 !important;
            color: #000000 !important;
        }

        /* ===== ПОДВАЛ ===== */
        body.south-park-active footer {
            background-color: #E8D5B5 !important;
            border-top: 3px solid #333333 !important;
            border-radius: 0 !important;
            position: relative;
            z-index: 3;
        }

        body.south-park-active footer .section,
        body.south-park-active footer .box {
            background-color: #E8D5B5 !important;
        }

        /* ===== БЕЛЫЕ БЛОКИ КОНТЕНТА ===== */
        body.south-park-active .portlet-boundary.portlet-static {
            background-color: #FFFFFF !important;
            border: 3px solid #333333 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 15px auto !important;
            padding: 15px !important;
            position: relative;
            z-index: 3;
        }

        /* ===== КНОПКИ ===== */
        body.south-park-active .kai-btn, 
        body.south-park-active .kai-btn-block,
        body.south-park-active button {
            background-color: #FFD166 !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            font-weight: bold !important;
        }

        body.south-park-active .kai-btn:hover, 
        body.south-park-active .kai-btn-block:hover,
        body.south-park-active button:hover {
            background-color: #EF476F !important;
            color: #FFFFFF !important;
        }

        /* ===== КАРТИНКИ ===== */
        body.south-park-active img {
            border: 2px solid #333333 !important;
            border-radius: 0 !important;
        }

        body.south-park-active .slick-slide.slick-active {
            background-color: #FFFFFF !important;
            border: 2px dashed #333333 !important;
        }

        /* ===== ССЫЛКИ ===== */
        body.south-park-active a {
            color: #1B4332 !important;
        }

        body.south-park-active a:hover {
            color: #EF476F !important;
        }

        /* ===== ВЕРХНЯЯ ПАНЕЛЬ ===== */
        body.south-park-active .access-box {
            background-color: #E8D5B5 !important;
        }

        /* ===== ЛОГОТИП И СЛОГАН ===== */
        body.south-park-active .slogan {
            color: #1B4332 !important;
        }

        /* ===== ПОИСК ===== */
        body.south-park-active .search_text {
            background-color: #FFFFFF !important;
            border: 2px solid #333333 !important;
            border-radius: 0 !important;
            color: #000000 !important;
        }

        /* ===== МОДАЛЬНОЕ ОКНО ВХОДА ===== */
        body.south-park-active .popup_wrapper {
            z-index: 100000 !important;
        }

        body.south-park-active .popup_box {
            background-color: #FFFFFF !important;
            border: 3px solid #333333 !important;
            border-radius: 0 !important;
        }
    `;
    document.head.appendChild(style);
}

// 2. Добавление фоновых декоративных элементов
function addBackgroundElements() {
    if (document.querySelector('.south-park-bg-elements')) return;
    
    const bgContainer = document.createElement('div');
    bgContainer.className = 'south-park-bg-elements';
    
    const sun = document.createElement('div');
    sun.className = 'sp-sun';
    bgContainer.appendChild(sun);
    
    const mountainsBack = document.createElement('div');
    mountainsBack.className = 'sp-mountains-back';
    bgContainer.appendChild(mountainsBack);
    
    const mountainsBackSnow = document.createElement('div');
    mountainsBackSnow.className = 'sp-mountains-back-snow';
    bgContainer.appendChild(mountainsBackSnow);
    
    const mountainsFront = document.createElement('div');
    mountainsFront.className = 'sp-mountains-front';
    bgContainer.appendChild(mountainsFront);
    
    const mountainsFrontSnow = document.createElement('div');
    mountainsFrontSnow.className = 'sp-mountains-front-snow';
    bgContainer.appendChild(mountainsFrontSnow);
    
    document.body.appendChild(bgContainer);
}

// 3. Функция переключения темы
function toggleTheme() {
    const html = document.documentElement;
    const body = document.body;
    const isActive = body.classList.contains('south-park-active');
    
    if (isActive) {
        html.classList.remove('south-park-active');
        body.classList.remove('south-park-active');
        localStorage.setItem('kai_south_park_theme', 'disabled');
        updateButtonState(false);
    } else {
        html.classList.add('south-park-active');
        body.classList.add('south-park-active');
        addBackgroundElements();
        localStorage.setItem('kai_south_park_theme', 'enabled');
        updateButtonState(true);
    }
}

// 4. Обновление состояния кнопки
function updateButtonState(isActive) {
    const btn = document.getElementById('sp-theme-toggle-btn');
    if (btn) {
        btn.textContent = isActive ? 'Стиль: ВКЛ' : 'Стиль: ВЫКЛ';
        btn.title = isActive ? 'Выключить стиль South Park' : 'Включить стиль South Park';
    }
}

// 5. Создание кнопки переключения
function createToggleButton() {
    const container = document.querySelector('.box_links');
    if (!container) {
        console.warn('Контейнер .box_links не найден');
        return;
    }

    const parentContainer = container.parentElement;
    const siblings = parentContainer.children;
    console.log('Количество дочерних элементов в родителе кнопки:', siblings.length);

    if (document.getElementById('sp-theme-toggle-btn')) {
        return;
    }

    const button = document.createElement('button');
    button.id = 'sp-theme-toggle-btn';
    
    Object.assign(button.style, {
        padding: '8px 12px',
        backgroundColor: '#FFD166',
        color: '#000',
        border: '2px solid #000',
        borderRadius: '0',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        marginLeft: '10px',
        display: 'inline-block'
    });

    button.addEventListener('click', toggleTheme);
    container.appendChild(button);

    const savedState = localStorage.getItem('kai_south_park_theme');
    if (savedState === 'enabled') {
        document.documentElement.classList.add('south-park-active');
        document.body.classList.add('south-park-active');
        addBackgroundElements();
        updateButtonState(true);
    } else {
        updateButtonState(false);
    }
}

// 6. Инициализация
function init() {
    injectThemeStyles();
    
    const staticPortlets = document.querySelectorAll('.portlet-boundary.portlet-static');
    console.log('Найдено статических портлетов для применения стиля:', staticPortlets.length);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createToggleButton();
        });
    } else {
        createToggleButton();
    }
}

init();