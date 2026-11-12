'use strict'

function initSlytherinTheme() {
    const bgDark = '#1a472a';
    const bgAccent = '#2a623d';
    const silver = '#aaa';

    function injectStyles() {
        if (document.getElementById('slytherin-styles')) return;

        const style = document.createElement('style');
        style.id = 'slytherin-styles';
        style.textContent = `
            body.slytherin-theme, body.slytherin-theme #page_wrapper {
                background-color: ${bgDark} !important;
                color: ${silver} !important;
            }
            body.slytherin-theme .main_slider_holder, body.slytherin-theme .news_box {
                background-color: ${bgAccent} !important;
                border: 2px solid ${silver} !important;
                border-radius: 8px !important;
                padding: 15px !important;
                margin-bottom: 20px !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.6) !important;
            }
            body.slytherin-theme a {
                color: ${silver} !important;
                text-decoration: none !important;
            }
            body.slytherin-theme a:hover {
                color: #fff !important;
                text-shadow: 0 0 5px ${bgAccent} !important;
            }
        `;
        document.head.appendChild(style);
    }

    function applyTheme(enable) {
        if (enable) {
            document.body.classList.add('slytherin-theme');
            
            const pageWrapper = document.getElementById('page_wrapper');
            if (pageWrapper && pageWrapper.parentElement) {
                pageWrapper.parentElement.style.backgroundColor = bgDark;
            }

            const menuItems = document.querySelectorAll('.menu_holder > ul > li');
            menuItems.forEach(item => {
                item.style.borderColor = silver;
                if (item.children.length > 0) {
                    item.children[0].style.fontWeight = 'bold';
                }
            });
        } else {
            document.body.classList.remove('slytherin-theme');
            
            const pageWrapper = document.getElementById('page_wrapper');
            if (pageWrapper && pageWrapper.parentElement) {
                pageWrapper.parentElement.style.backgroundColor = '';
            }

            const menuItems = document.querySelectorAll('.menu_holder > ul > li');
            menuItems.forEach(item => {
                item.style.borderColor = '';
                if (item.children.length > 0) {
                    item.children[0].style.fontWeight = '';
                }
            });
        }
    }

    function updateButtonStatus(isEnabled) {
        const btn = document.getElementById('slytherin-toggle-btn');
        if (btn) {
            btn.textContent = isEnabled ? 'Слизерин: ВКЛ' : 'Слизерин: ВЫКЛ';
            btn.style.backgroundColor = isEnabled ? bgAccent : silver;
            btn.style.color = isEnabled ? silver : bgDark;
        }
    }

    function toggleTheme() {
        const isEnabled = localStorage.getItem('slytherinEnabled') === 'true';
        const newState = !isEnabled;
        
        localStorage.setItem('slytherinEnabled', newState);
        applyTheme(newState);
        updateButtonStatus(newState);
    }

    function createToggleButton() {
        if (document.getElementById('slytherin-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        let container = document.querySelector('.header .box_links') || document.querySelector('.box_links');
        
        if (!container) {
            console.log('Не найден контейнер для кнопок');
            container = document.body;
        }

        const button = document.createElement('button');
        button.id = 'slytherin-toggle-btn';
        button.title = 'Переключить режим';
        
        Object.assign(button.style, {
            border: `2px solid ${bgDark}`,
            borderRadius: '5px',
            padding: '8px 12px',
            cursor: 'pointer',
            margin: '5px',
            fontWeight: 'bold',
            fontSize: '14px',
            zIndex: '9999'
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', toggleTheme);
        
        container.appendChild(button);
        console.log('Кнопка переключения темного режима добавлена');

        injectStyles();
        const isEnabled = localStorage.getItem('slytherinEnabled') === 'true';
        applyTheme(isEnabled);
        updateButtonStatus(isEnabled);
    }

    if (document.readyState === 'loading') {
        console.log('Кнопка будет добавлена после загрузки');
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        console.log('Кнопка добавляется');
        createToggleButton();
    }
}

initSlytherinTheme();