'use strict'

function addDarkMode() {
    // Включаем ужасный режим
    function applyUglyMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');
        
        if (pageWrapper) {
            pageWrapper.style.backgroundColor = 'lime';
            pageWrapper.style.color = 'red';
            pageWrapper.style.textTransform = 'uppercase';
            pageWrapper.style.fontFamily = 'Comic Sans MS';
            pageWrapper.style.fontSize = '30px';
            pageWrapper.style.padding = '73px 5px 42px 19px';
        }
        if (mainSlider) {
            mainSlider.style.background = 'magenta';
        }
        if (newsBox) {
            newsBox.style.background = 'yellow';
            newsBox.style.border = '5px dashed black';
            newsBox.style.marginLeft = '37px';
        }

        // ===== querySelectorAll =====
        const navLinks = document.querySelectorAll('.box_links a');
        navLinks.forEach((link) => {
            link.style.color = 'cyan';
            link.style.backgroundColor = 'darkblue';
            link.style.textTransform = 'uppercase';
            link.style.fontFamily = 'Impact';
        });

        // ===== parentElement =====
        if (navLinks.length > 0) {
            const parent = navLinks[0].parentElement;
            if (parent) {
                parent.style.backgroundColor = 'purple';
            }
        }

        // ===== children =====
        if (newsBox && newsBox.children.length > 0) {
            const newsChildren = newsBox.children;
            for (let i = 0; i < newsChildren.length; i++) {
                newsChildren[i].style.color = 'orange';
                newsChildren[i].style.textDecoration = 'underline wavy red';
            }
        }

        // ===== Сложный селектор (тег + класс) =====
        const headerEl = document.querySelector('header .box_links');
        if (headerEl) {
            headerEl.style.borderBottom = '7px dotted orange';
        }
    }

    // Выключаем ужасный режим — сбрасываем стили
    function removeUglyMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');
        
        if (pageWrapper) pageWrapper.style.cssText = '';
        if (mainSlider) mainSlider.style.cssText = '';
        if (newsBox) newsBox.style.cssText = '';
        
        const navLinks = document.querySelectorAll('.box_links a');
        navLinks.forEach((link) => {
            link.style.cssText = '';
        });

        if (navLinks.length > 0 && navLinks[0].parentElement) {
            navLinks[0].parentElement.style.cssText = '';
        }

        if (newsBox && newsBox.children.length > 0) {
            for (let i = 0; i < newsBox.children.length; i++) {
                newsBox.children[i].style.cssText = '';
            }
        }

        const headerEl = document.querySelector('header .box_links');
        if (headerEl) headerEl.style.cssText = '';
    }

    // Переключаем режим + сохраняем в localStorage
    function toggleUglyMode() {
        const isEnabled = localStorage.getItem('uglyMode') === 'true';
        
        if (isEnabled) {
            removeUglyMode();
            localStorage.setItem('uglyMode', 'false');
            updateButtonStatus(false);
        } else {
            applyUglyMode();
            localStorage.setItem('uglyMode', 'true');
            updateButtonStatus(true);
        }
    }

    // Обновляем текст кнопки — показывает статус
    function updateButtonStatus(isEnabled) {
        const button = document.getElementById('dark-mode-toggle-btn');
        if (button) {
            button.textContent = isEnabled ? '💩' : '🌙';
            button.title = isEnabled ? 'Ужасный режим ВКЛЮЧЁН' : 'Ужасный режим ВЫКЛЮЧЕН';
        }
    }

    // Создаём кнопку
    function createToggleButton() {
        if (document.getElementById('dark-mode-toggle-btn')) {
            return;
        }

        const buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) {
            console.log('Не найден контейнер для кнопок');
            return;
        }

        const button = document.createElement('div');
        button.id = 'dark-mode-toggle-btn';
        button.textContent = '🌙';
        button.title = 'Переключить режим';
        
        Object.assign(button.style, {
            width: '30px',
            height: '30px',
            border: 'none',
            backgroundColor: '#4285f4',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            margin: '0 0 0 6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center',
            float: 'left'
        });
        
        button.addEventListener('click', toggleUglyMode);
        
        buttonContainer.appendChild(button);

        if (localStorage.getItem('uglyMode') === 'true') {
            applyUglyMode();
            updateButtonStatus(true);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addDarkMode();