'use strict'

function addBoJackStyle() {

    const styleKey = 'bojack-style-enabled';

    function toggleBoJackStyle() {

        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');

        if (pageWrapper) {

            const currentStatus = localStorage.getItem(styleKey);

            if (currentStatus === 'true') {

                pageWrapper.classList.remove('bojack-mode');

                localStorage.setItem(styleKey, 'false');

                console.log('Стиль BoJack выключен');

            } else {

                pageWrapper.classList.add('bojack-mode');

                localStorage.setItem(styleKey, 'true');

                console.log('Стиль BoJack включен');
            }

            updateButton();

        } else {
            console.log('Элемент с id="page_wrapper" не найден');
        }
    }


    function createStyles() {

        if (document.getElementById('bojack-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'bojack-style';

        style.textContent = `

            #page_wrapper.bojack-mode {
                background:
                    linear-gradient(
                        180deg,
                        #ff665f,
                        #ff9068,
                        #f5a35c,
                        #d45b8d,
                        #554080
                    ) !important;

                color: #fff1e8 !important;
                min-height: 100vh;
            }

            #page_wrapper.bojack-mode .main_slider_holder {
                background:
                    linear-gradient(
                        135deg,
                        #ff7060,
                        #d94f88,
                        #55408e
                    ) !important;

                color: white !important;
                border: 2px solid #ffad80 !important;
                border-radius: 10px;
                box-shadow: 0 8px 25px rgba(60, 25, 80, 0.5);
                padding: 10px;
            }

            #page_wrapper.bojack-mode .news_box {
                background:
                    linear-gradient(
                        135deg,
                        #ff875f,
                        #c94c86,
                        #4d4087
                    ) !important;

                color: white !important;
                border: 2px solid #ffbe82 !important;
                border-radius: 10px;
                padding: 12px;
                box-shadow: 0 8px 25px rgba(60, 25, 80, 0.45);
            }

            #page_wrapper.bojack-mode a {
                color: #8eeaff !important;
            }

            #page_wrapper.bojack-mode a:hover {
                color: white !important;
                text-shadow:
                    0 0 5px #72e7ff,
                    0 0 12px #72e7ff;
            }

            #page_wrapper.bojack-mode h1,
            #page_wrapper.bojack-mode h2,
            #page_wrapper.bojack-mode h3 {
                color: #fff3e8 !important;
                text-shadow: 0 2px 5px #54204d;
            }

            #page_wrapper.bojack-mode input,
            #page_wrapper.bojack-mode select,
            #page_wrapper.bojack-mode textarea {
                background-color: #31235b !important;
                color: white !important;
                border: 1px solid #ff8f9d !important;
                border-radius: 5px;
                padding: 6px;
            }

            #page_wrapper.bojack-mode button {
                background: linear-gradient(
                    135deg,
                    #ff704f,
                    #d94f9c
                ) !important;

                color: white !important;
                border: 1px solid #ffad91 !important;
                border-radius: 5px;
            }

            /* Сложный селектор */
            #page_wrapper.bojack-mode .box_links > .box_link {
                border-radius: 5px;
            }

            #page_wrapper.bojack-mode .box_links {
                background: rgba(68, 39, 91, 0.55) !important;
                border-radius: 8px;
                padding: 4px;
            }

            #page_wrapper.bojack-mode ::selection {
                background: #ff4f91 !important;
                color: white !important;
            }

            #bojack-style-toggle-btn {
                min-width: 110px;
                height: 30px;
                margin: 0 0 0 6px;
                border: none;
                border-radius: 5px;
                background: #4285f4;
                color: white;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                text-align: center;
                float: left;
                line-height: 30px;
                transition: 0.2s;
            }

            #bojack-style-toggle-btn:hover {
                transform: scale(1.05);
                box-shadow:
                    0 0 10px rgba(255, 112, 79, 0.8);
            }

        `;

        document.head.appendChild(style);
    }


    function updateButton() {

        const button = document.getElementById('bojack-style-toggle-btn');

        if (!button) {
            return;
        }

        if (localStorage.getItem(styleKey) === 'true') {
            button.textContent = '🌙 BoJack: ВКЛ';
            button.title = 'Выключить стиль';
        } else {
            button.textContent = '🌅 BoJack: ВЫКЛ';
            button.title = 'Включить стиль';
        }
    }


    function createToggleButton() {

        if (document.getElementById('bojack-style-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        const buttonContainer = document.querySelector('.box_links');

        if (!buttonContainer) {
            console.log('Не найден контейнер для кнопок');
            return;
        }

        console.log(
            'Количество элементов в контейнере:',
            buttonContainer.children.length
        );

        const button = document.createElement('div');

        button.id = 'bojack-style-toggle-btn';
        button.textContent = '🌅 BoJack: ВЫКЛ';
        button.title = 'Включить стиль';

        buttonContainer.appendChild(button);

        console.log(
            'Родитель кнопки:',
            button.parentElement.className
        );

        button.addEventListener('click', toggleBoJackStyle);

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        updateButton();

        console.log('Кнопка BoJack добавлена');
    }


    function checkPageElements() {

        const links = document.querySelectorAll('#page_wrapper .box_links > .box_link');

        console.log(
            'Количество ссылок на странице:',
            links.length
        );

        const headings = document.querySelectorAll(
            '#page_wrapper h1, #page_wrapper h2, #page_wrapper h3'
        );

        headings.forEach((heading) => {
            heading.dataset.checked = 'true';
        });
    }

    function loadSavedStyle() {

        const pageWrapper = document.getElementById('page_wrapper');

        if (!pageWrapper) {
            console.log('Элемент page_wrapper не найден');
            return;
        }

        if (localStorage.getItem(styleKey) === 'true') {
            pageWrapper.classList.add('bojack-mode');
        }

        updateButton();
    }


    function init() {

        createStyles();
        createToggleButton();
        loadSavedStyle();
        checkPageElements();

        console.log('BoJack Style запущен');
    }


    if (document.readyState === 'loading') {

        console.log('Кнопка будет добавлена после загрузки');

        document.addEventListener('DOMContentLoaded', init);

    } else {

        console.log('Кнопка добавляется');

        init();
    }
}

addBoJackStyle();