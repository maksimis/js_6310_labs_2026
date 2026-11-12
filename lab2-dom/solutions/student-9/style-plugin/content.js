'use strict';

const styleId = 'air-nomad-style';
if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
        /* 1-2. Базовый фон */
        html.air-nomad-active,
        body.air-nomad-active {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
        }

        body.air-nomad-active #wrapper,
        body.air-nomad-active #content {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
        }

        body.air-nomad-active .portlet-column-content,
        body.air-nomad-active .portlet-column-content-only {
            background-color: transparent !important;
            color: #4a3b2a !important;
        }
        
        /* 3. Цвет всех ссылок по умолчанию */
        body.air-nomad-active a {
            color: #d35400 !important;
        }

        /* 4. Прозрачность для оберток Liferay */
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

        /* Скрываем заголовок "Отображение сетевого контента" */
        body.air-nomad-active .portlet-journal-content .portlet-topper {
            display: none !important;
        }

        /* 5-10. Блоки-карточки с центрированием */
        body.air-nomad-active .main_slider_holder,
        body.air-nomad-active .news_box,
        body.air-nomad-active .events_box,
        body.air-nomad-active .research_box,
        body.air-nomad-active .welcome_box {
            background-color: #ffac7a !important;
            border: 2px solid #e67e22 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            padding: 15px !important;
            margin: 0 auto 15px auto !important;
            max-width: 1200px !important;
            box-sizing: border-box !important;
        }

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

        /* Описание карточек */
        body.air-nomad-active .box_items .item .desc,
        body.air-nomad-active .events_box .item .desc,
        body.air-nomad-active .welcome_box .item .desc,
        body.air-nomad-active .research_box .item .desc {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
            border-radius: 8px !important;
            padding: 12px !important;
        }

        /* АКТИВНАЯ вкладка */
        body.air-nomad-active .tab_items .nav a.active,
        body.air-nomad-active .institutes_box .nav a.active {
            background-color: #fde8c8 !important;
            color: #4a3b2a !important;
            font-weight: bold !important;
            border: 1px solid #e67e22 !important;
            border-radius: 6px !important;
        }

        /* Защита от синего цвета при наведении */
        body.air-nomad-active a:not(.kai-btn-block):not(.vk):not(.telegram):not(.rutube):not(.max):hover {
            color: #a04000 !important;
            background-color: transparent !important;
            text-decoration: underline !important;
        }

        /* Кнопки типа "все события", "все новости" */
        body.air-nomad-active .kai-btn-block {
            background-color: #ffac7a !important;
            color: #4a3b2a !important;
            border: 2px solid #e67e22 !important;
            border-radius: 8px !important;
            font-weight: bold !important;
        }
        body.air-nomad-active .kai-btn-block:hover,
        body.air-nomad-active a.vk:hover,
        body.air-nomad-active a.telegram:hover,
        body.air-nomad-active a.rutube:hover,
        body.air-nomad-active a.max:hover {
            background-color: #e67e22 !important;
            color: #ffffff !important;
            border-color: #d35400 !important;
        }

        /* Социальные иконки */
        body.air-nomad-active a.vk,
        body.air-nomad-active a.telegram,
        body.air-nomad-active a.rutube,
        body.air-nomad-active a.max {
            display: inline-block !important;
            min-width: 28px !important;
            min-height: 28px !important;
            background-color: #ffac7a !important;
            border: 1px solid #e67e22 !important;
            border-radius: 6px !important;
            vertical-align: middle !important;
        }

        /* Переключатель языка (Ru) */
        body.air-nomad-active span.current {
            display: inline-block !important;
            background-color: #fff8f0 !important;
            color: #d35400 !important;
            font-weight: bold !important;
            border: 1px solid #e67e22 !important;
            border-radius: 4px !important;
            padding: 2px 8px !important;
            vertical-align: middle !important;
        }

        /* Иконка очков */
        body.air-nomad-active i.kai-icon-glasses {
            color: #d35400 !important;
            display: inline-block !important;
            min-width: 20px !important;
            min-height: 20px !important;
            vertical-align: middle !important;
        }

        /* Сложный селектор */
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
            display: inline-block !important;
            vertical-align: middle !important;
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
            background-color: #e67e22 !important;
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(styleEl);
    console.log('[Lab2] Стили "Воздух" успешно внедрены!');
}

function initAirStylePlugin() {
    console.log('[Lab2] Запуск плагина...');
    
    if (document.getElementById('air-toggle-btn')) {
        return;
    }

    let buttonContainer = document.querySelector('.box_links');
    const button = document.createElement('button');
    button.id = 'air-toggle-btn';
    button.textContent = 'Воздух: Выкл';

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

    button.addEventListener('click', () => {
        const newState = !document.body.classList.contains('air-nomad-active');
        localStorage.setItem('kai_air_theme_active', newState.toString());
        updateThemeState(newState);

        const elements = document.querySelectorAll('.portlet-boundary.portlet-journal-content, .news_box .item');
        console.log(`[Lab2] querySelectorAll (сложный селектор) нашёл элементов: ${elements.length}`);
        
        const firstLink = document.querySelector('a');
        if (firstLink) {
            console.log(`[Lab2] parentElement ссылки:`, firstLink.parentElement.tagName);
            console.log(`[Lab2] Количество children у родителя:`, firstLink.parentElement.children.length);
        }
    });

    if (buttonContainer) {
        buttonContainer.appendChild(button);
        console.log('[Lab2] Кнопка добавлена в .box_links. ParentElement:', button.parentElement.tagName);
    } else {
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