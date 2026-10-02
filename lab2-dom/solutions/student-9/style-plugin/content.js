'use strict';

const styleId = 'air-nomad-style';
if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
        /* 1-2. Базовый фон главных контейнеров */
        html.air-nomad-active,
        body.air-nomad-active,
        body.air-nomad-active #wrapper,
        body.air-nomad-active #content,
        body.air-nomad-active .portlet-column-content,
        body.air-nomad-active .portlet-column-content-only {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
        }
        
        /* 3. Цвет всех ссылок */
        body.air-nomad-active a {
            color: #d35400 !important;
        }

        /* 4. Прочее */
        body.air-nomad-active .portlet,
        body.air-nomad-active .portlet-boundary,
        body.air-nomad-active .portlet-topper,
        body.air-nomad-active .portlet-content,
        body.air-nomad-active .portlet-body,
        body.air-nomad-active .portlet-content-container,
        body.air-nomad-active .journal-content-article,
        body.air-nomad-active .section,
        body.air-nomad-active .tabs,
        body.air-nomad-active .tab_items,
        body.air-nomad-active .nav,
        body.air-nomad-active .institutes_slider_box,
        body.air-nomad-active .institutes_box,
        body.air-nomad-active .events_nav,
        body.air-nomad-active .bar_btns,
        body.air-nomad-active .list,
        body.air-nomad-active .slick-list,
        body.air-nomad-active .slick-track,
        body.air-nomad-active .page_holder,
        body.air-nomad-active .slider_box,
        body.air-nomad-active .desc {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
        }

        /* 5-10. Красим конечные блоки-карточки */
        body.air-nomad-active .main_slider_holder,
        body.air-nomad-active .news_box,
        body.air-nomad-active .events_box,
        body.air-nomad-active .research_box,
        body.air-nomad-active .welcome_box,
        body.air-nomad-active .box_items .item,
        body.air-nomad-active .events_box .item,
        body.air-nomad-active .welcome_box .item {
            background-color: #ffac7a !important;
            border: 2px solid #e67e22 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            padding: 15px !important;
            margin-bottom: 15px !important;
        }

        /* Для .item со стратегическими проектами */
        body.air-nomad-active .research_box .item {
            background-color: transparent !important;
            border: 2px solid #e67e22 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            padding: 15px !important;
            margin-bottom: 15px !important;
        }

        /* Описание карточек: цвет #fde8c8 */
        body.air-nomad-active .box_items .item .desc,
        body.air-nomad-active .events_box .item .desc,
        body.air-nomad-active .welcome_box .item .desc,
        body.air-nomad-active .research_box .item .desc {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
            border-radius: 8px !important;
            padding: 12px !important;
        }

        /*  АКТИВНАЯ вкладка : цвет #fde8c8 */
        body.air-nomad-active .tab_items .nav a.active,
        body.air-nomad-active .institutes_box .nav a.active {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
            font-weight: bold !important;
            border: 1px solid #e67e22 !important;
            border-radius: 6px !important;
        }

        /* Кнопки */
        body.air-nomad-active .kai-btn-block {
            background-color: #ffac7a !important;
            color: #4a3b2a !important;
            border: 2px solid #e67e22 !important;
            border-radius: 8px !important;
            font-weight: bold !important;
        }
        body.air-nomad-active .kai-btn-block:hover {
            background-color: #e67e22 !important;
            color: #ffffff !important;
        }

        /* Сложный селектор  */
        body.air-nomad-active .box_links > div,
        body.air-nomad-active .portlet-title-text {
            background-color: #fff8f0 !important;
            color: #d35400 !important;
            font-weight: bold !important;
            border-radius: 6px !important;
            padding: 4px 8px !important;
        }

        /* Стили кнопки переключения */
        #air-toggle-btn {
            float: left;
            padding: 6px 14px !important;
            border-radius: 18px !important;
            border: 2px solid #e67e22 !important;
            font-size: 13px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            margin-left: 8px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
            transition: transform 0.15s !important;
            z-index: 9999 !important;
        }
        #air-toggle-btn:hover {
            transform: scale(1.05) !important;
        }
    `;
    document.head.appendChild(styleEl);
    console.log('[Lab2] Стили "Воздух" успешно внедрены!');
}

function initAirStylePlugin() {
    console.log('[Lab2] Запуск плагина...');
    
    // getElementById 
    if (document.getElementById('air-toggle-btn')) {
        return;
    }

    // querySelector 
    let buttonContainer = document.querySelector('.box_links');
    const button = document.createElement('button');
    button.id = 'air-toggle-btn';
    button.textContent = 'Воздух: Выкл';

    // localStorage 
    const isThemeActive = localStorage.getItem('kai_air_theme_active') === 'true';

    function updateThemeState(isActive) {
        if (isActive) {
            document.documentElement.classList.add('air-nomad-active');
            document.body.classList.add('air-nomad-active');
            button.textContent = 'Воздух: Вкл';
            button.style.backgroundColor = '#ffac7a';
            button.style.color = '#ffffff';
            console.log('[Lab2] Стиль ВКЛЮЧЕН');
        } else {
            document.documentElement.classList.remove('air-nomad-active');
            document.body.classList.remove('air-nomad-active');
            button.textContent = 'Воздух: Выкл';
            button.style.backgroundColor = '#fde8c8';
            button.style.color = '#4a3b2a';
            console.log('[Lab2] Стиль ВЫКЛЮЧЕН');
        }
    }

    updateThemeState(isThemeActive);

    // Обработчик клика + демонстрация требуемых методов DOM
    button.addEventListener('click', () => {
        const newState = !document.body.classList.contains('air-nomad-active');
        localStorage.setItem('kai_air_theme_active', newState.toString());
        updateThemeState(newState);

        // querySelectorAll 
        const elements = document.querySelectorAll('.portlet-boundary, .news_box, #wrapper');
        console.log(`[Lab2] querySelectorAll нашёл элементов: ${elements.length}`);
        
        // parentElement и children 
        const firstLink = document.querySelector('a');
        if (firstLink) {
            console.log(`[Lab2] parentElement ссылки:`, firstLink.parentElement.tagName);
            console.log(`[Lab2] Количество children у родителя:`, firstLink.parentElement.children.length);
        }
    });

    // Вставка кнопки
    if (buttonContainer) {
        // children 
        if (buttonContainer.children.length > 0) {
            buttonContainer.appendChild(button);
        } else {
            buttonContainer.appendChild(button);
        }
        console.log('[Lab2] Кнопка добавлена в .box_links. ParentElement:', button.parentElement.tagName);
    } else {
        console.log('[Lab2] .box_links не найден, кнопка будет в правом нижнем углу');
        Object.assign(button.style, {
            position: 'fixed', bottom: '30px', right: '30px', zIndex: '2147483647',
            padding: '12px 24px', borderRadius: '30px', fontSize: '16px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(button);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAirStylePlugin);
} else {
    initAirStylePlugin();
}