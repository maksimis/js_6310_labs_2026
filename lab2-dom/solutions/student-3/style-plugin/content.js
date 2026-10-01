'use strict'

function addNightVisionMode() {
    function injectStyles() {
        if (document.getElementById('nv-styles')) return; 
        
        const style = document.createElement('style');
        style.id = 'nv-styles';
        style.innerHTML = `
          /* Фон и рамки */
          body.night-vision-mode,
          body.night-vision-mode *:not(img):not(i):not([class*="icon"]):not(svg):not(.main_slider_holder):not(.main_slider_holder *) {
            background-color: #000000 !important;
            border-color: #39ff14 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }

          /* Зеленый текст */
          body.night-vision-mode,
          body.night-vision-mode *:not(.main_slider_holder):not(.main_slider_holder *) {
            color: #39ff14 !important;
            text-shadow: 0 0 1px #39ff14 !important;
          }

          /* Красные ссылки */
          body.night-vision-mode a:not(.main_slider_holder *),
          body.night-vision-mode a *:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a *:not(.main_slider_holder *) {
            color: #ff0000 !important;
            text-decoration: none !important;
            text-shadow: none !important; 
          }
          
          body.night-vision-mode a:hover:not(.main_slider_holder *),
          body.night-vision-mode a:hover *:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a:hover:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a:hover *:not(.main_slider_holder *) {
            text-decoration: underline !important;
            color: #ff3333 !important;
          }

          /* изображения */
          body.night-vision-mode img,
          body.night-vision-mode [class*="icon"],
          body.night-vision-mode [class*="logo"],
          body.night-vision-mode i,
          body.night-vision-mode svg {
            background-color: transparent !important; 
            filter: none !important; 
            fill: currentColor;
          }

          /* настройки для карусели */
          
          body.night-vision-mode .main_slider_holder {
            background-color: #000000 !important;
          }
          
          body.night-vision-mode .main_slider_holder a {
            color: #ff0000 !important;
            border-color: #ff0000 !important; 
            text-shadow: none !important;
          }
          
          body.night-vision-mode .main_slider_holder a:hover {
            color: #ff3333 !important;
            border-color: #ff3333 !important;
          }
        `;
        document.head.appendChild(style);
    }

    function toggleDarkMode() {
        const isEnabled = document.body.classList.toggle('night-vision-mode');
        
        localStorage.setItem('kaiNightVisionState', isEnabled ? 'enabled' : 'disabled');
        
        const button = document.getElementById('dark-mode-toggle-btn');
        if (button) {
            button.style.backgroundColor = isEnabled ? '#39ff14' : '#4285f4';
            button.style.color = isEnabled ? '#000' : 'white';
        }
    }
    
    function createToggleButton() {
        if (document.getElementById('dark-mode-toggle-btn')) {
            return;
        }

        injectStyles();

        let buttonContainer = document.querySelector('.box_links');
        
        if (!buttonContainer) {
            buttonContainer = document.body; 
        }

        const button = document.createElement('div');
        button.id = 'dark-mode-toggle-btn'; 
        button.title = 'Переключить режим Night Vision';
        
        const isNightVisionOn = localStorage.getItem('kaiNightVisionState') === 'enabled';
        if (isNightVisionOn) {
            document.body.classList.add('night-vision-mode');
        }
        
        button.textContent = 'NV';
        
        Object.assign(button.style, {
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            border: 'none',
            backgroundColor: isNightVisionOn ? '#39ff14' : '#4285f4',
            color: isNightVisionOn ? '#000' : 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '0 0 0 6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center',
            borderRadius: '4px',
            zIndex: '999999'
        });

        if (buttonContainer === document.body) {
            Object.assign(button.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                float: 'none'
            });
        } else {
            button.style.float = 'left';
        }
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.transition = 'transform 0.2s';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', toggleDarkMode);
        
        buttonContainer.appendChild(button);

        try {
            const complexElement = document.querySelector('.main_slider_holder > div, .news_box .news_item');
            if (complexElement) {
                const parent = complexElement.parentElement;
                const childrenElements = parent.children;
            }
            const allBoxes = document.querySelectorAll('.news_box a.title, .box_links a');
            const wrapper = document.getElementById('page_wrapper');
        } catch(e) {}
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addNightVisionMode();