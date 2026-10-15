'use strict';

function add90sAcidMode() {
    const STORAGE_KEY = 'kai_90s_mode_enabled';

    // Обновление текста и цвета кнопки
    const updateButton = (enabled) => {
        const btn = document.getElementById('toggle-90s-mode-btn');
        if (!btn) return;
        btn.textContent = enabled ? '👾 90s MODE: ВКЛ' : '👾 90s MODE: ВЫКЛ';
        btn.style.backgroundColor = enabled ? '#00FF00' : '#FFFF00';
    };

    // Переключение режима
    function toggle90sAcidMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        if (!pageWrapper) return;

        const is90sActive = pageWrapper.classList.toggle('acid-90s-active');

        let style = document.getElementById('acid-90s-styles');
        if (is90sActive && !style) {
            style = document.createElement('style');
            style.id = 'acid-90s-styles';
            style.innerHTML = `
                @keyframes blink { 50% { opacity: 0; } }
                #page_wrapper.acid-90s-active {
                    background-color: #543cda !important;
                    color: #000 !important;
                    font-family: "Comic Sans MS", cursive !important;
                    font-size: 20px !important;
                }
                #page_wrapper.acid-90s-active .main_slider_holder {
                    background-color: #543cda !important; /* не шорткат — не трогаем image */
                    background-size: 200% 100% !important;
                    border: 5px ridge #000 !important;
                }
                #page_wrapper.acid-90s-active .news_box,
                #page_wrapper.acid-90s-active .events_box,
                #page_wrapper.acid-90s-active .institutes_slider_box,
                #page_wrapper.acid-90s-active .research_box,
                #page_wrapper.acid-90s-active .welcome_box {
                    background-color: #543cda !important; /* сохраняем background-image */
                    border: 4px double #000 !important;
                }
                #page_wrapper.acid-90s-active header,
                #page_wrapper.acid-90s-active footer { background: #000080 !important; }
                #page_wrapper.acid-90s-active .item {
                    background-color: #FFFFCC !important; /* не сбрасываем background-image */
                    border: 3px ridge #0000FF !important;
                    box-shadow: 4px 4px 0 #FF00FF !important;
                    padding: 8px !important;
                    margin: 5px !important;
                    /* Явно поднимаем background-image, если он был задан инлайном */
                    background-repeat: no-repeat !important;
                    background-position: center center !important;
                    background-size: cover !important;
                }
                #page_wrapper.acid-90s-active h1,
                #page_wrapper.acid-90s-active h2 {
                    color: #000 !important;
                    text-shadow: 3px 3px #FFFF00, -3px -3px #00FF00 !important;
                    border-bottom: 3px dashed #FF00FF !important;
                }
                #page_wrapper.acid-90s-active a { color: #0000FF !important; text-decoration: underline !important; }
                #page_wrapper.acid-90s-active [data-blink] {
                    animation: blink 0.8s step-end infinite;
                    color: #ff0000 !important;
                    text-transform: uppercase !important;
                }
            `;
            document.head.appendChild(style);

            document.querySelectorAll('h1, h2, .news_title').forEach(el => {
                el.setAttribute('data-blink', 'true');
            });
        } else if (!is90sActive && style) {
            style.remove();
            document.querySelectorAll('[data-blink]').forEach(el => {
                el.removeAttribute('data-blink');
            });
        }

        localStorage.setItem(STORAGE_KEY, is90sActive ? 'true' : 'false');
        updateButton(is90sActive);
    }

    // Создание кнопки
    function createToggleButton() {
        if (document.getElementById('toggle-90s-mode-btn')) return;

        const largeViewBtn = document.getElementById('large_view_btn');
        
        const infoLinks = document.querySelector('.info_links');

        const button = document.createElement('button');
        button.id = 'toggle-90s-mode-btn';
        button.type = 'button';
        button.textContent = '👾 90s MODE: ВЫКЛ';
        Object.assign(button.style, {
            backgroundColor: '#FFFF00',
            color: '#000',
            fontFamily: '"Comic Sans MS", cursive',
            fontWeight: 'bold',
            fontSize: '14px',
            border: '3px outset #fff',
            padding: '4px 10px',
            cursor: 'pointer',
            marginLeft: '10px',
            float: 'left',
            position: 'relative',
            lineHeight: '1.2',
            zIndex: '9999'
        });
        button.addEventListener('click', toggle90sAcidMode);

        // Приоритет 1: вставляем после блока .info_links (главная страница)
        if (infoLinks && infoLinks.parentElement) {
            infoLinks.insertAdjacentElement('afterend', button);

        // Приоритет 2: после кнопки large_view_btn
        } else if (largeViewBtn) {
            largeViewBtn.insertAdjacentElement('afterend', button);

        // Приоритет 3 (для внутренних страниц): в header, если он есть
        } else if (document.querySelector('header')) {
            document.querySelector('header').appendChild(button);

        // Приоритет 4 (крайний случай): просто в body, фиксируем в углу
        } else {
            document.body.appendChild(button);
            Object.assign(button.style, {
                position: 'fixed',
                top: '10px',
                right: '10px',
                marginLeft: '0',
                float: 'none'
            });
        }

        const parent = button.parentElement;
        if (parent) {
            console.log('[90s] Кнопка вставлена. Детей у родителя:', parent.children.length);
        }
    }

    // Восстановление состояния
    function restoreState() {
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
            toggle90sAcidMode();
        }
    }

    // Фикс относительных путей картинок в "Стратегических проектах"
    function fixRelativeImages() {
        const items = document.querySelectorAll('.research_box .tabs .item[style*="background-image"]');
        items.forEach(el => {
            const bg = el.style.backgroundImage;
            if (bg && bg.includes('url("/')) {
                el.style.backgroundImage = bg.replace('url("/', 'url("' + location.origin + '/');
            }
        });
    }

    function init() {
        createToggleButton();
        restoreState();
        fixRelativeImages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return toggle90sAcidMode;
}

add90sAcidMode();