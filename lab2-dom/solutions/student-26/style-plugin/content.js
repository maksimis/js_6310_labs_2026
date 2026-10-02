'use strict';

function addRainbowMode() {
    function addStyles() {
        if (document.getElementById('styles-26')) {
            return;
        }

        let style = document.createElement('style');
        style.id = 'styles-26';

        style.textContent = `
            .border-26 {
                border: 1px solid !important;
                border-image: linear-gradient(
                    45deg,
                    red,
                    orange,
                    yellow,
                    green,
                    cyan,
                    blue,
                    violet
                ) 1 !important;
            }

            .border-radius-26 {
                border-radius: 15px;
            }

            .font-family-26 {
                font-family: Arial, sans-serif;
            }

            .font-weight-26 {
                font-weight: bold;
            }

            .text-align-26 {
                text-align: center;
            }

            .gap-26 {
                display: flex;
                gap: 20px;
            }

            .margin-top-26 {
                margin-top: 100px;
            }

            .background-26 {
                background-color: #f0f0f0;
            }

            .button-26 {
                width: auto;
                padding: 0 10px;
                height: 30px;
                line-height: 30px;
                border: none;
                background-color: #2d56ab;
                color: white;
                font-size: 14px;
                cursor: pointer;
                margin: 0 0 0 6px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                text-align: center;
                float: left;
                border-radius: 4px;
            }
        `;

        document.head.appendChild(style);
    }

    function toggleRainbowMode() {
        let pageWrapper = document.getElementById('page_wrapper');

        if (!pageWrapper) {
            return;
        }

        let isOn = document.body.classList.toggle('rainbow-on');

        let button = document.getElementById('rainbow-mode-toggle-btn');

        if (button) {
            button.textContent = isOn ? 'ВКЛ' : 'ВЫКЛ';
        }

        localStorage.setItem(
            'rainbowMode',
            isOn ? 'on' : 'off'
        );

        applyStyles(isOn);
    }
    
    function applyStyles(isOn) {        
        let boxLinks = document.querySelector('.box_links');
        if (boxLinks && boxLinks.parentElement) {
            let parent = boxLinks.parentElement;
            let children = parent.children;

            for (let i = 0; i < children.length; i++) {
                children[i].classList.toggle('border-26', isOn);
            }
        }

        let images = document.querySelectorAll('img');
        images.forEach(image => {
            image.classList.toggle('border-26', isOn);
            image.classList.toggle('border-radius-26', isOn);
        });

        let divs = document.querySelectorAll('div');
        divs.forEach(div => {
            div.classList.toggle('border-26',isOn);
            div.classList.toggle('border-radius-26', isOn);
        });

        let pageWrapper = document.getElementById('page_wrapper');
        if (pageWrapper) {
            pageWrapper.classList.toggle('background-26', isOn);
            pageWrapper.classList.toggle('font-family-26', isOn);
            pageWrapper.classList.toggle('font-weight-26', isOn);
        }

        let header = document.querySelector('header');
        if (header) {
            header.classList.toggle('background-26', isOn);
            header.classList.toggle('text-align-26', isOn);
        }

        let slider = document.querySelector('.main_slider_holder.disable-user-actions');
        if (slider) {
            slider.classList.toggle('margin-top-26', isOn);
        }

        document.querySelectorAll('div.news_box').forEach(item => {
            item.classList.toggle('margin-top-26', isOn);
        });

        document.querySelectorAll('div.slick-track').forEach(x => {
            x.classList.toggle('gap-26', isOn);
        })
    }

    function createToggleButton() {
        if (document.getElementById('rainbow-mode-toggle-btn')) {
            return;
        }

        let buttonContainer = document.querySelector('.box_links');

        if (!buttonContainer) {
            return;
        }

        let button = document.createElement('div');

        button.id = 'rainbow-mode-toggle-btn';
        button.textContent = 'ВЫКЛ';
        button.classList.add('button-26');

        button.addEventListener('click', toggleRainbowMode);

        buttonContainer.appendChild(button);

        let saved = localStorage.getItem('rainbowMode');

        if (saved === 'on') {
            button.textContent = 'ВКЛ';
            applyStyles(true);
        }
    }

    function init() {
        addStyles();
        createToggleButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

addRainbowMode();