'use strict'

function addEarthMode() {
    const STORAGE_KEY = 'kai-earth-mode';

    // Функция для переключения режима «Земля»
    function toggleEarthMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (!pageWrapper) {
            console.log('Элемент с id="page_wrapper" не найден');
            return;
        }

        const currentState = localStorage.getItem(STORAGE_KEY) === 'true';
        const newState = !currentState;

        localStorage.setItem(STORAGE_KEY, String(newState));
        applyEarthMode(newState);
        updateButtonStatus(newState);
    }

    // Применяем/убираем стили «Земля»
    function applyEarthMode(isEnabled) {
        const pageWrapper = document.getElementById('page_wrapper');

        if (!pageWrapper) {
            return;
        }

        if (isEnabled) {
            pageWrapper.classList.add('kai-earth-mode');
        } else {
            pageWrapper.classList.remove('kai-earth-mode');
        }

        const mainSlider = document.querySelector('.main_slider_holder');
        if (mainSlider) {
            mainSlider.classList.toggle('kai-earth-slider', isEnabled);
        }

        const newsBox = document.querySelector('.news_box');
        if (newsBox) {
            newsBox.classList.toggle('kai-earth-news', isEnabled);
        }

        const links = document.querySelectorAll('.news_box a[href]');
        links.forEach((link) => {
            link.classList.toggle('kai-earth-link', isEnabled);
        });

        const headings = document.querySelectorAll(
            '#page_wrapper h1, #page_wrapper h2, #page_wrapper h3'
        );

        headings.forEach((heading) => {
            heading.classList.toggle('kai-earth-heading', isEnabled);
        });

        const images = document.querySelectorAll(
            '#page_wrapper img:not(#earth-mode-toggle-btn img)'
        );

        images.forEach((image) => {
            image.classList.toggle('kai-earth-image', isEnabled);
        });

        const menuItems = document.querySelectorAll(
            '.box_links > div:not(#earth-mode-toggle-btn)'
        );

        menuItems.forEach((item) => {
            item.classList.toggle('kai-earth-menu-item', isEnabled);
        });
    }

    // Обновляем текст кнопки
    function updateButtonStatus(isEnabled) {
        const button = document.getElementById('earth-mode-toggle-btn');
        if (button) {
            button.textContent = isEnabled ? '🌿 Земля: ВКЛ' : '🌱 Земля: ВЫКЛ';
            button.title = isEnabled
                ? 'Выключить стиль «Земля»'
                : 'Включить стиль «Земля»';

            if (isEnabled) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    // Создаём стили
    function createStyles() {
        if (document.getElementById('kai-earth-styles')) {
            console.log('Стили уже добавлены');
            return;
        }

        const style = document.createElement('style');
        style.id = 'kai-earth-styles';

        style.textContent = `
            #page_wrapper.kai-earth-mode {
                background-color: #8d6e63 !important;
                color: #4e342e !important;
                font-size: 18px !important;
            }

            #page_wrapper.kai-earth-mode a {
                color: #4e342e !important;
            }

            #page_wrapper .kai-earth-slider {
                background-color: #689f38 !important;
                border: 3px solid #4e342e !important;
                border-radius: 8px !important;
            }

            #page_wrapper .kai-earth-news {
                background-color: #f1ead7 !important;
                border: 3px solid #689f38 !important;
                border-radius: 8px !important;
                padding: 12px !important;
            }

            #page_wrapper .kai-earth-link {
                color: #689f38 !important;
                font-weight: bold !important;
            }

            #page_wrapper .kai-earth-heading {
                color: #4e342e !important;
                text-shadow: 1px 1px 1px #f1ead7 !important;
            }

            #page_wrapper .kai-earth-image {
                border: 4px solid #689f38 !important;
                border-radius: 8px !important;
            }

            #page_wrapper .kai-earth-menu-item {
                background-color: #f1ead7 !important;
                border-radius: 6px !important;
                margin: 3px !important;
            }

            /* Слово «приоритет» в рамке */
            #page_wrapper.kai-earth-mode .priority {
                border: 2px solid #4e342e !important;
                border-radius: 6px !important;
                padding: 2px !important;
                background-color: #f1ead7 !important;
            }

            /* Кнопка «Земля» */
            #earth-mode-toggle-btn {
                min-width: 140px;
                padding: 8px 14px;
                border: 2px solid #4e342e;
                border-radius: 20px;
                background: linear-gradient(135deg, #689f38 0%, #8d6e63 100%);
                color: #ffffff;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                margin-left: 8px;
                text-align: center;
                box-shadow: 0 3px 8px rgba(78, 52, 46, 0.4);
                transition: all 0.3s ease;
                user-select: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                line-height: 1;
                vertical-align: middle;
            }

            #earth-mode-toggle-btn:hover {
                background: linear-gradient(135deg, #8d6e63 0%, #689f38 100%);
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 5px 12px rgba(78, 52, 46, 0.6);
            }

            #earth-mode-toggle-btn:active {
                transform: translateY(0) scale(0.98);
                box-shadow: 0 2px 5px rgba(78, 52, 46, 0.4);
            }

            #earth-mode-toggle-btn.active {
                background: linear-gradient(135deg, #4e342e 0%, #689f38 100%);
                border-color: #689f38;
                box-shadow: 0 0 12px rgba(104, 159, 56, 0.7);
            }
        `;

        document.head.appendChild(style);
        console.log('Стили «Земля» добавлены');
    }

    // Создаём и добавляем кнопку в DOM
    function createToggleButton() {
        if (document.getElementById('earth-mode-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        const buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) {
            console.log('Не найден контейнер для кнопок');
            return;
        }

        const button = document.createElement('div');
        button.id = 'earth-mode-toggle-btn';

        const savedState = localStorage.getItem(STORAGE_KEY) === 'true';
        button.textContent = savedState ? '🌿 Земля: ВКЛ' : '🌱 Земля: ВЫКЛ';
        button.title = savedState
            ? 'Выключить стиль «Земля»'
            : 'Включить стиль «Земля»';

        if (savedState) {
            button.classList.add('active');
        }

        button.addEventListener('click', toggleEarthMode);

        buttonContainer.appendChild(button);

        console.log('Кнопка переключения режима «Земля» добавлена');

        applyEarthMode(savedState);
    }

    // Запускаем создание
    createStyles();

    if (document.readyState === 'loading') {
        console.log('Кнопка будет добавлена после загрузки');
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        console.log('Кнопка добавляется');
        createToggleButton();
    }
}

addEarthMode();