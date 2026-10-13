'use strict'

function addNightVisionMode() {
    function injectStyles() {
        if (document.getElementById('nv-styles')) return; 
        
        const style = document.createElement('style');
        style.id = 'nv-styles';
        style.innerHTML = `
          body.night-vision-mode,
          body.night-vision-mode *:not(img):not(i):not([class*="icon"]):not(svg):not(.main_slider_holder):not(.main_slider_holder *) {
            background-color: #000000 !important;
            border-color: #39ff14 !important;
          }

          body.night-vision-mode,
          body.night-vision-mode *:not(.main_slider_holder):not(.main_slider_holder *) {
            color: #39ff14 !important;
          }

          body.night-vision-mode a:not(.main_slider_holder *),
          body.night-vision-mode a *:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a *:not(.main_slider_holder *) {
            color: #ff0000 !important;
            text-decoration: none !important;
          }
          
          body.night-vision-mode a:hover:not(.main_slider_holder *),
          body.night-vision-mode #page_wrapper a:hover:not(.main_slider_holder *) {
            text-decoration: underline !important;
            color: #ff3333 !important;
          }

          body.night-vision-mode img,
          body.night-vision-mode [class*="icon"],
          body.night-vision-mode [class*="logo"],
          body.night-vision-mode i,
          body.night-vision-mode svg {
            background-color: transparent !important; 
          }

          body.night-vision-mode .main_slider_holder {
            background-color: #000000 !important;
          }
          body.night-vision-mode .main_slider_holder a { color: #ff0000 !important; }
        `;
        document.head.appendChild(style);
    }

    function applyDOMModifications(isEnabled) {
        const wrapper = document.getElementById('page_wrapper');
        if (wrapper) {
            wrapper.style.border = isEnabled ? '1px solid #39ff14' : '';
            wrapper.style.padding = isEnabled ? '15px' : '';
            wrapper.style.boxShadow = isEnabled ? '0 0 15px rgba(57,255,20,0.2)' : '';
            wrapper.style.borderRadius = isEnabled ? '8px' : '';
            wrapper.style.fontFamily = isEnabled ? 'monospace' : '';
            wrapper.style.letterSpacing = isEnabled ? '0.5px' : '';
            wrapper.style.lineHeight = isEnabled ? '1.6' : '';
            wrapper.style.opacity = isEnabled ? '0.98' : ''; // 8-й стиль
        }

        // 2. querySelector со сложным селектором
        const complexElement = document.querySelector('.main_slider_holder > div, .news_box .news_item');
        if (complexElement) {
            // 3. parentElement - применяем стиль
            const parent = complexElement.parentElement;
            parent.style.outline = isEnabled ? '2px dashed #39ff14' : '';

            // 4. children - применяем стили ко всем детям
            const childrenElements = parent.children;
            for (let i = 0; i < childrenElements.length; i++) {
                childrenElements[i].style.filter = isEnabled ? 'contrast(1.2)' : '';
            }
        }

        // 5. querySelectorAll - применяем стили (делаем текст ссылок заглавным)
        const allBoxes = document.querySelectorAll('.news_box a.title, .box_links a');
        allBoxes.forEach(box => {
            box.style.textTransform = isEnabled ? 'uppercase' : '';
        });
    }

    function toggleDarkMode() {
        const isEnabled = document.body.classList.toggle('night-vision-mode');
        localStorage.setItem('kaiNightVisionState', isEnabled ? 'enabled' : 'disabled');
        
        const button = document.getElementById('dark-mode-toggle-btn');
        if (button) {
            button.style.backgroundColor = isEnabled ? '#39ff14' : '#4285f4';
            button.style.color = isEnabled ? '#000' : 'white';
        }

        // Применяем инлайн-стили
        applyDOMModifications(isEnabled);
    }
    
    function createToggleButton() {
        if (document.getElementById('dark-mode-toggle-btn')) return;

        injectStyles();

        let buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) buttonContainer = document.body; 

        const button = document.createElement('div');
        button.id = 'dark-mode-toggle-btn'; 
        button.title = 'Переключить режим Night Vision';
        
        const isNightVisionOn = localStorage.getItem('kaiNightVisionState') === 'enabled';
        if (isNightVisionOn) {
            document.body.classList.add('night-vision-mode');
            applyDOMModifications(true); // Применяем стили при перезагрузке
        }
        
        button.textContent = 'NV';
        
        Object.assign(button.style, {
            width: '30px', height: '30px', lineHeight: '30px', border: 'none',
            backgroundColor: isNightVisionOn ? '#39ff14' : '#4285f4',
            color: isNightVisionOn ? '#000' : 'white',
            fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
            margin: '0 0 0 6px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'center', borderRadius: '4px', zIndex: '999999'
        });

        if (buttonContainer === document.body) {
            Object.assign(button.style, {
                position: 'fixed', bottom: '20px', right: '20px', float: 'none'
            });
        } else {
            button.style.float = 'left';
        }
        
        button.addEventListener('mouseenter', () => button.style.transform = 'scale(1.1)');
        button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
        button.addEventListener('click', toggleDarkMode);
        
        buttonContainer.appendChild(button);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addNightVisionMode();