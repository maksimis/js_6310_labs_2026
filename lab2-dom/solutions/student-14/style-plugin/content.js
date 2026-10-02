'use strict'

function addSummerMode() {
    // Функция для переключения летнего режима
    function toggleSummerMode() {
        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (!pageWrapper) {
            console.log('Элемент с id="page_wrapper" не найден');
            return;
        }

        const currentBg = pageWrapper.style.backgroundColor;
        const isSummer =
            currentBg === 'rgb(255, 249, 196)' ||
            currentBg === '#fff9c4';

        if (isSummer) {
            // Возвращаем оригинальные стили
            pageWrapper.style.backgroundColor = '';
            pageWrapper.style.color = '';
            pageWrapper.style.fontSize = '';

            if (mainSlider) {
                mainSlider.style.background = '#eee';
            }
            if (newsBox) {
                newsBox.style.background = '#eee';
            }
            headings.forEach((heading) => {
                heading.style.color = '';
            });
        } else {
            // Устанавливаем летний режим
            pageWrapper.style.backgroundColor = '#fff9c4';
            pageWrapper.style.color = '#5d4037';
            pageWrapper.style.fontSize = '20px';

            if (mainSlider) {
                mainSlider.style.background = '#fff9c4';
            }
            if (newsBox) {
                newsBox.style.background = '#fff9c4';
            }
            headings.forEach((heading) => {
                heading.style.color = '#ff6d00';
            });
        }
    }

    // Создаем и добавляем кнопку в DOM
    function createToggleButton() {
        // Проверяем, не создана ли уже кнопка
        if (document.getElementById('summer-mode-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        const buttonContainer = document.querySelector('.box_links');
        if (!buttonContainer) {
            console.log('Не найден контейнер для кнопок');
            return;
        }

        const button = document.createElement('div');
        button.id = 'summer-mode-toggle-btn';
        button.textContent = '☀️';
        button.title = 'Переключить летний режим';

        // Стили для кнопки
        Object.assign(button.style, {
            width: '30px',
            height: '30px',
            border: 'none',
            backgroundColor: '#ff6d00',
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
        button.addEventListener('click', toggleSummerMode);

        // Добавляем кнопку на страницу
        buttonContainer.appendChild(button);

        console.log('Кнопка переключения летнего режима добавлена');
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

addSummerMode();