'use strict'

function addDarkMode() {
// Функция для переключения фона
    function toggleDarkMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');
        if (pageWrapper) {
            const currentBg = pageWrapper.style.backgroundColor;
            
            if (currentBg === 'black' || currentBg === 'rgb(0, 0, 0)') {
                // Возвращаем оригинальные стили
                pageWrapper.style.backgroundColor = '';
                mainSlider.style.background = '#eee';
                newsBox.style.background = '#eee';
                pageWrapper.style.color = '';
                pageWrapper.style.fontSize = '';
            } else {
                // Устанавливаем темный режим
                pageWrapper.style.backgroundColor = 'black';
                pageWrapper.style.color = '#9b41d4';
                pageWrapper.style.fontSize = '20px';
                mainSlider.style.background = '#000';

                newsBox.style.background = '#000';
            }
        } else {
            console.log('Элемент с id="page_wrapper" не найден');
        }
    }
    
    // Создаем и добавляем кнопку в DOM
    function createToggleButton() {
        // Проверяем, не создана ли уже кнопка
        if (document.getElementById('dark-mode-toggle-btn')) {
            console.log('Кнопка уже добавлена');
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
        
        // Стили для кнопки
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
        
        // Эффекты при наведении
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        // Обработчик клика
        button.addEventListener('click', toggleDarkMode);
        
        // Добавляем кнопку на страницу
        buttonContainer.appendChild(button);
        
        console.log('Кнопка переключения темного режима добавлена');
    }
    
    // Запускаем создание кнопки
    if (document.readyState === 'loading') {
        console.log('Кнопка будет добавлена после загрузки');
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        console.log('Кнопка добавляется');
        createToggleButton();
    }
}

addDarkMode();