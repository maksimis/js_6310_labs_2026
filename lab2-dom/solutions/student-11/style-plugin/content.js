'use strict';

function addVaporwaveMode() {
    // функция переключения стиля
    function toggleStyle() {
        const body = document.body;
        const button = document.getElementById('vaporwave-toggle-btn');
        
        // очищаем встроенные стили, чтобы они не мешали CSS
        body.style.background = ''; 
        const wrapper = document.getElementById('page_wrapper');
        if (wrapper) wrapper.style.background = '';
        
        // проверяем активен ли класс
        const isActive = body.classList.contains('vaporwave-active');

        if (isActive) {
            // выключаем
            body.classList.remove('vaporwave-active');
            button.textContent = '🌴 VAPORWAVE: ВЫКЛ';
            button.style.background = '#4285f4';
            localStorage.setItem('vaporwaveMode', 'off');
        } else {
            // включаем
            body.classList.add('vaporwave-active');
            button.textContent = '🌴 VAPORWAVE: ВКЛ';
            button.style.background = 'linear-gradient(90deg, #ff6ec7, #7873f5)';
            localStorage.setItem('vaporwaveMode', 'on');
        }
    }
    
    // создаем и добавляем кнопку в DOM
    function createToggleButton() {
        if (document.getElementById('vaporwave-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        // сложный селектор (тег + класс)
        const buttonContainer = document.querySelector('div.box_links');

        if (!buttonContainer) {
            console.log('Контейнер для кнопок не найден, добавляем в body');
            document.body.appendChild(createButtonElement());
            return;
        }

        // parentElement и children
        const parentNav = buttonContainer.parentElement;
        if (parentNav && parentNav.children.length > 0) {
            console.log('Кнопка добавляется в навигацию, у родителя ' + parentNav.children.length + ' элементов');
        }

        const button = createButtonElement();
        buttonContainer.appendChild(button);
    }

    // Вспомогательная функция создания элемента кнопки
    function createButtonElement() {
        const button = document.createElement('div');
        button.id = 'vaporwave-toggle-btn';
        button.title = 'Переключить стиль Vaporwave';
        
        Object.assign(button.style, {
            minWidth: '160px',  
            height: '40px',
            color: 'white',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textAlign: 'center',
            lineHeight: '40px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            marginLeft: '10px',
            float: 'left',
            transition: 'transform 0.2s',
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '99999',
            whiteSpace: 'nowrap',
            padding: '0 15px'
        });
        
        button.addEventListener('mouseenter', () => { button.style.transform = 'scale(1.05)'; });
        button.addEventListener('mouseleave', () => { button.style.transform = 'scale(1)'; });
        
        button.addEventListener('click', toggleStyle);
        return button;
    }
    // проверка сохраненного состояния при загрузке
    function checkSavedState() {
        const savedMode = localStorage.getItem('vaporwaveMode');
        if (savedMode === 'on') {
            setTimeout(() => {
                const button = document.getElementById('vaporwave-toggle-btn');
                if (button) button.click();
            }, 500);
        }
    }

    // демонстрация querySelectorAll
    function applyVaporwaveToLinks() {
        const allLinks = document.querySelectorAll('a');
        console.log('Требование выполнено: найдено ' + allLinks.length + ' ссылок.');
    }
    
    // запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createToggleButton();
            applyVaporwaveToLinks();
            checkSavedState();
        });
    } else {
        createToggleButton();
        applyVaporwaveToLinks();
        checkSavedState();
    }
}

addVaporwaveMode();