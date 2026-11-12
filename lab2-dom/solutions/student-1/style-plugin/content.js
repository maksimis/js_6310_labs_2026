'use strict';

(() => {
    const STYLE_ID = 'simpsons-kai-extension-styles';
    const BUTTON_ID = 'simpsons-kai-toggle';
    const STORAGE_KEY = 'simpsonsKaiStyleEnabled';

    const css = `
        html.simpsons-kai-style, html.simpsons-kai-style body {
            background: #87ceeb !important;
            color: #241b2f !important;
            font-family: "Comic Sans MS", "Trebuchet MS", Arial, sans-serif !important;
        }
        .simpsons-kai-style #page_wrapper,
        .simpsons-kai-style .page_wrapper,
        .simpsons-kai-style main {
            background: linear-gradient(#87ceeb 0 160px, #f7df64 160px) !important;
            color: #241b2f !important;
        }
        .simpsons-kai-style header,
        .simpsons-kai-style .header,
        .simpsons-kai-style .main_slider_holder,
        .simpsons-kai-style .news_box,
        .simpsons-kai-style .content,
        .simpsons-kai-style article,
        .simpsons-kai-style section {
            background-color: #ffd90f !important;
            border: 3px solid #ffffff !important;
            border-radius: 16px !important;
            box-shadow: 5px 5px 0 #241b2f !important;
        }
        .simpsons-kai-style h1,
        .simpsons-kai-style h2,
        .simpsons-kai-style h3,
        .simpsons-kai-style .title,
        .simpsons-kai-style .news_title {
            color: #7d2a7d !important;
            font-weight: 900 !important;
            letter-spacing: .04em !important;
            text-shadow: 2px 2px 0 #ffffff !important;
        }
        .simpsons-kai-style a,
        .simpsons-kai-style .menu a,
        .simpsons-kai-style .nav a {
            color: #7d2a7d !important;
            font-weight: 800 !important;
            text-decoration: underline wavy #d18ec4 !important;
        }
        .simpsons-kai-style a:hover,
        .simpsons-kai-style .menu a:hover {
            background: #d18ec4 !important;
            color: #ffffff !important;
            border-radius: 8px !important;
        }
        .simpsons-kai-style img {
            border: 4px solid #ffffff !important;
            border-radius: 14px !important;
            filter: saturate(1.25) contrast(1.06) !important;
        }
        .simpsons-kai-style button,
        .simpsons-kai-style input[type="submit"],
        .simpsons-kai-style .btn {
            background: #d18ec4 !important;
            color: #ffffff !important;
            border: 3px solid #241b2f !important;
            border-radius: 999px !important;
            font-weight: 900 !important;
        }
        #${BUTTON_ID} {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 2147483647;
            max-width: 230px;
            padding: 12px 16px;
            background: #ffd90f;
            color: #241b2f;
            border: 3px solid #ffffff;
            border-radius: 999px;
            box-shadow: 4px 4px 0 #241b2f;
            font: 800 14px/1.2 "Comic Sans MS", "Trebuchet MS", Arial, sans-serif;
            cursor: pointer;
        }
        #${BUTTON_ID}:hover { transform: translate(-2px, -2px); }
        #${BUTTON_ID}:focus-visible { outline: 4px solid #d18ec4; outline-offset: 3px; }
    `;

    function installStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function setEnabled(enabled) {
        document.documentElement.classList.toggle('simpsons-kai-style', enabled);
        localStorage.setItem(STORAGE_KEY, String(enabled));
        updateButton(enabled);
    }

    function updateButton(enabled) {
        const button = document.getElementById(BUTTON_ID);
        if (!button) return;
        button.textContent = enabled ? '🍩 Симпсоны: включено' : '🍩 Симпсоны: выключено';
        button.setAttribute('aria-pressed', String(enabled));
        button.title = enabled ? 'Вернуть обычный стиль сайта' : 'Включить стиль Симпсонов';
    }

    function createToggleButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.type = 'button';
        button.addEventListener('click', () => {
            setEnabled(!document.documentElement.classList.contains('simpsons-kai-style'));
        });

        const navigation = document.querySelector('header .menu, .header .menu, nav.menu');
        const navigationLinks = document.querySelectorAll('header .menu a, .header .menu a, nav.menu a');
        const buttonHost = navigation?.parentElement || document.body;
        const firstNavigationItem = navigation?.children[0];
        if (firstNavigationItem) firstNavigationItem.setAttribute('data-simpsons-navigation', 'true');
        buttonHost.appendChild(button);
        updateButton(document.documentElement.classList.contains('simpsons-kai-style'));

        // Обращение к коллекции нужно, чтобы навигация оставалась корректной на разных страницах сайта.
        navigationLinks.forEach((link) => link.setAttribute('data-simpsons-link', 'true'));
    }

    function initialize() {
        installStyles();
        setEnabled(localStorage.getItem(STORAGE_KEY) === 'true');
        createToggleButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
