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
        if (document.getElementById('bojack-style-link')) {
            return;
        }

        const link = document.createElement('link');
        link.id = 'bojack-style-link';
        link.rel = 'stylesheet';
        link.type = 'text/css';

        try {
            link.href = chrome.runtime.getURL('style.css');
        } catch (e) {
            try {
                link.href = browser.runtime.getURL('style.css');
            } catch (err) {
                link.href = 'style.css';
            }
        }

        document.head.appendChild(link);
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
