'use strict'

function addRavenclawStyle() {
// Функция для переключения фона
    function toggleRavenclawStyle() {
        //const container = document.querySelector('.cf.user_links');
        document.body.classList.toggle('ravenclaw-on');
        const ravenclaw = document.getElementById('ravenclaw-style-toggle-btn');
    
        if (document.body.classList.contains('ravenclaw-on')){
            ravenclaw.textContent = 'ON';
            localStorage.setItem('ravenclaw-style', 'ON');
        } else {
            ravenclaw.textContent = 'OFF';
            localStorage.setItem('ravenclaw-style', 'OFF');
        }

    }

    function createToggleButton() {
        // Проверяем, не создана ли уже кнопка
        if (document.getElementById('ravenclaw-style-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        const buttonContainer = document.querySelector('.cf.user_links');
        if (!buttonContainer) {
            console.log('Не найден контейнер для кнопок');
            return;
        }

        const button = document.createElement('div');
        button.classList.add('ravenclaw-btn');
        button.id = 'ravenclaw-style-toggle-btn';
        button.textContent = 'OFF';
        button.title = 'Переключить режим';

        // Обработчик клика
        button.addEventListener('click', toggleRavenclawStyle);

        //Чтение состояния темы вкл/выкл для отображения текста на странице
        const saved = localStorage.getItem('ravenclaw-style');
        if (saved === "ON") {
            document.body.classList.add('ravenclaw-on');
            button.textContent = 'ON';
        }

        // Добавляем кнопку на страницу
        buttonContainer.appendChild(button);
        console.log('Кнопка переключения на стиль Когтевран добавлена');

        const week = document.getElementById('weekParity');
        if (week) {
            week.parentElement.classList.add('ravenclaw-week');
        }

        const menu_list = document.querySelectorAll('.menu-list > li');

        menu_list.forEach((item) => {
            item.classList.add('ravenclaw-menu-item');
        });

        const menu_first = document.querySelector('.menu-list');
        if (menu_first) {
            menu_first.children[0].classList.add('ravenclaw-first');
        }
    
  
    }
    
        // Запускаем создание кнопки
    if (document.readyState === 'loading') {
        console.log('Кнопка будет добавлена после загрузки');
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        console.log('Кнопка добавляется');
        createToggleButton();
    }
};

addRavenclawStyle();