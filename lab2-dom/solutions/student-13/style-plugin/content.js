'use strict';

function addMatrixMode() {
    if (document.getElementById('kai-matrix-toggle')) {
        return;
    }

    // Добавляем CSS прямо из content.js.
    const style = document.createElement('style');
    style.textContent = `
/* Переключатель доступен в обоих режимах и на внутренних страницах. */
html body #kai-matrix-toggle {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 2147483647;
    box-sizing: border-box;
    max-width: calc(100vw - 32px);
    padding: 12px 16px;
    border: 1px solid #00ff00;
    border-radius: 0;
    background: #000;
    color: #00ff00;
    font: 700 14px/1.5 Consolas, 'Courier New', monospace;
    letter-spacing: 0.04em;
    cursor: pointer;
    box-shadow: 0 0 14px #00ff0040;
}

html body #kai-matrix-toggle:hover {
    background: #003300;
}

html body #kai-matrix-toggle:focus-visible {
    outline: 3px solid #00ff00;
    outline-offset: 4px;
}

/* Снятие класса возвращает исходное оформление. */
html.kai-matrix,
html.kai-matrix body {
    background: #000 !important;
    color: #00ff00 !important;
    color-scheme: dark;
    font-family: Consolas, 'Courier New', monospace !important;
}

html.kai-matrix body :is(div, section, article, header, footer, nav, main, aside,
    ul, ol, li, p, span, table, thead, tbody, tr, th, td, h1, h2, h3, h4, h5, h6) {
    color: #00ff00 !important;
}

html.kai-matrix body :is(.page_wrapper, header, footer, .infos, .page_holder,
    .menu, .menu .sub, .menu-list, .child-menu, .portlet-content,
    .news_box, .events_box, .main_slider_holder, .breadcrumb,
    .nav-menu .layouts li, .news_box .item, .events_box .item,
    .news_box .item .desc, .events_box .item .desc,
    .institutes_box, .institutes_box .inst-slide, .tab_items, .tab_items a,
    table, thead, tbody, tr) {
    background-color: #000 !important;
}

html.kai-matrix body :is(.breadcrumb, .nav-menu .layouts li) {
    border-color: #005500 !important;
    border-radius: 0 !important;
    background-image: none !important;
}

html.kai-matrix body :is(p, span, a, li, h1, h2, h3, h4, h5, h6,
    td, th, label, input, textarea, select, button, .slogan, .note):not([class*='icon']) {
    font-family: Consolas, 'Courier New', monospace !important;
}

/* Убираем фоновые текстуры, сохраняя картинки и слайды. */
html.kai-matrix body :is(.page_wrapper, header, footer, .infos, .page_holder,
    .menu, .menu .sub, .child-menu, .portlet-content, .news_box, .events_box) {
    background-image: none !important;
}

html.kai-matrix body a,
html.kai-matrix body a :is(span, p) {
    color: #00ff00 !important;
}

html.kai-matrix body a:hover,
html.kai-matrix body a:focus-visible {
    color: #baffba !important;
    text-decoration: underline !important;
    text-underline-offset: 4px;
}

html.kai-matrix body .tab_items .nav a.active {
    background-color: #003300 !important;
    border-bottom: 2px solid #00ff00;
}

html.kai-matrix body :is(h1, h2, h3, h4, h5, h6) {
    color: #00ff00 !important;
    letter-spacing: 0.08em !important;
    text-shadow: 0 0 8px #00ff0060 !important;
    border-bottom: 1px solid #008000 !important;
    padding-bottom: 10px !important;
}

html.kai-matrix body .kai-matrix-nav {
    border-top: 1px solid #008000 !important;
    border-bottom: 1px solid #008000 !important;
}

html.kai-matrix body .kai-matrix-menu-item > a {
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

html.kai-matrix body .kai-matrix-panel {
    border: 1px solid #005500 !important;
    border-radius: 0 !important;
    padding: 12px !important;
    box-shadow: inset 0 0 18px #00ff000d !important;
}

/* Карточки «Открой КНИТУ-КАИ»: тёмные подписи и ровный ряд. */
html.kai-matrix body .welcome_box .list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin: 0;
    text-align: left;
}

html.kai-matrix body .welcome_box .list > .item {
    flex: 1 1 260px;
    width: auto;
    min-width: 0;
    padding: 0;
}

html.kai-matrix body .welcome_box .item .desc {
    background: #001000 !important;
    border: 1px solid #005500;
}

html.kai-matrix body .welcome_box .item:hover,
html.kai-matrix body .welcome_box .item:focus-visible {
    border-color: #008000 !important;
}

html.kai-matrix body :is(.kai-btn, .kai-btn-block, input[type='submit'],
    button:not(#kai-matrix-toggle)) {
    background-color: #001a00 !important;
    background-image: none !important;
    color: #00ff00 !important;
    border: 1px solid #008000 !important;
    border-radius: 0 !important;
}

html.kai-matrix body :is(input:not([type='checkbox']):not([type='radio']),
    textarea, select) {
    background-color: #001000 !important;
    color: #00ff00 !important;
    border: 1px solid #008000 !important;
    border-radius: 0 !important;
    caret-color: #00ff00 !important;
}

html.kai-matrix body :is(th, td) {
    background-color: #000 !important;
    border-color: #008000 !important;
    padding: 8px !important;
}

html.kai-matrix body th {
    background-color: #003300 !important;
}

/* У формы контактов есть собственный светлый inline-фон. */
html.kai-matrix body .portlet-boundary[class*='phonebook'] .portlet-body > div,
html.kai-matrix body .custom-select .select-selected,
html.kai-matrix body .custom-select .select-items,
html.kai-matrix body .custom-select .select-items div {
    background: #001000 !important;
    border-color: #008000 !important;
}

html.kai-matrix body .custom-select .select-selected::after {
    border-color: #00ff00 transparent transparent transparent;
}

html.kai-matrix body .custom-select .select-arrow-active::after {
    border-color: transparent transparent #00ff00 transparent;
}

html.kai-matrix body img {
    filter: grayscale(1) sepia(1) hue-rotate(70deg) !important;
}

html.kai-matrix body ::selection {
    background: #00ff00;
    color: #000;
}
`;
    document.head.appendChild(style);

    // Находим меню сложным селектором и оформляем его пункты.
    const menu = document.querySelector('.menu .menu-list');
    if (menu) {
        menu.parentElement.classList.add('kai-matrix-nav');
        for (const item of menu.children) {
            item.classList.add('kai-matrix-menu-item');
        }
    }

    const panels = document.querySelectorAll('.portlet .portlet-content');
    for (const panel of panels) {
        panel.classList.add('kai-matrix-panel');
    }

    const button = document.createElement('button');
    button.id = 'kai-matrix-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Переключить тему Terminal / Matrix');
    document.body.appendChild(button);

    let enabled = false;
    try {
        enabled = localStorage.getItem('kai-matrix-enabled') === 'true';
    } catch {
        console.warn('KAI Matrix: сохранённый режим недоступен.');
    }

    // Один класс включает или выключает все стили темы.
    function updateTheme() {
        document.documentElement.classList.toggle('kai-matrix', enabled);
        button.textContent = enabled ? '> MATRIX: ВКЛЮЧЕНО' : '> MATRIX: ВЫКЛЮЧЕНО';
        button.setAttribute('aria-pressed', String(enabled));
    }

    updateTheme();
    button.addEventListener('click', () => {
        enabled = !enabled;
        updateTheme();
        try {
            localStorage.setItem('kai-matrix-enabled', String(enabled));
        } catch {
            console.warn('KAI Matrix: не удалось сохранить режим.');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addMatrixMode, { once: true });
} else {
    addMatrixMode();
}
