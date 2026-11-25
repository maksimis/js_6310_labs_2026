'use strict';

function addRickMortyTheme() {

    const STORAGE_KEY = 'kai_rm_theme_active';
    let isActive = localStorage.getItem(STORAGE_KEY) === 'true';

    function toggleTheme() {

        // 1) getElementById
        const pageWrapper = document.getElementById('page_wrapper');

        // 2) querySelector
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');

        // 3) querySelectorAll со СЛОЖНЫМ СЕЛЕКТОРОМ
        //    (два класса + тег: .news_box .box_content h3)
        const styledHeadings = document.querySelectorAll(
            '.news_box .box_content h3, .main_slider_holder .slide_item h2'
        );

        // Все ссылки
        const allLinks = document.querySelectorAll('a');

        if (!pageWrapper) {
            console.log('Элемент с id="page_wrapper" не найден');
            return;
        }

        if (isActive) {

            // Стиль 1: Фон — космос со звёздами
            pageWrapper.style.background =
                'radial-gradient(2px 2px at 20px 30px, #97ce4c, transparent),' +
                'radial-gradient(2px 2px at 40px 70px, #ff007f, transparent),' +
                'radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),' +
                'radial-gradient(2px 2px at 130px 80px, #97ce4c, transparent),' +
                'radial-gradient(1px 1px at 160px 30px, #ff007f, transparent),' +
                'radial-gradient(6px 6px at 180px 120px, #9b41d4, transparent),' +
                'linear-gradient(135deg, #0b0c15 0%, #1a0b2e 50%, #0b0c15 100%)';
            pageWrapper.style.backgroundSize =
                '200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 100% 100%';

            // Стиль 2: Цвет шрифта
            pageWrapper.style.color = '#e0e0e0';

            // Стиль 3: Фон слайдера — портал Рика
            if (mainSlider) {
                mainSlider.style.background =
                    'radial-gradient(circle, #97ce4c 0%, #3a5f1d 50%, #0b0c15 100%)';
            }

            // Стиль 4: Граница слайдера
            if (mainSlider) {
                mainSlider.style.border = '3px solid #97ce4c';
            }

            // Стиль 5: Свечение слайдера
            if (mainSlider) {
                mainSlider.style.boxShadow = '0 0 25px #97ce4c';
            }

            // Стиль 6: Скругление слайдера (органическая форма)
            if (mainSlider) {
                mainSlider.style.borderRadius = '30px';
            }

            // Стиль 7: Фон блока новостей
            if (newsBox) {
                newsBox.style.background = 'rgba(26, 11, 46, 0.85)';
            }

            // Стиль 8: Граница блока новостей
            if (newsBox) {
                newsBox.style.border = '2px solid #ff007f';
            }

            // Стиль 9: Отступы блока новостей
            if (newsBox) {
                newsBox.style.padding = '25px';
            }

            // Стиль 10: Скругление блока новостей
            if (newsBox) {
                newsBox.style.borderRadius = '15px';
            }

            // Стиль 11: Заголовки — кислотно-зелёные
            styledHeadings.forEach(function (el) {
                el.style.color = '#97ce4c';
                el.style.textShadow = '0 0 10px #97ce4c, 0 0 20px #ff007f';
            });

            // Стиль 12: Ссылки — розовые
            allLinks.forEach(function (el) {
                el.style.color = '#ff007f';
            });

            // 4) parentElement + 5) children — стилизуем соседей
            const container = document.querySelector('.box_links');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        const child = parent.children[i];
                        child.style.borderColor = '#97ce4c';
                    }
                }
            }

        } else {
            
            pageWrapper.style.background = '';
            pageWrapper.style.backgroundSize = '';
            pageWrapper.style.color = '';

            if (mainSlider) {
                mainSlider.style.background = '';
                mainSlider.style.border = '';
                mainSlider.style.boxShadow = '';
                mainSlider.style.borderRadius = '';
            }
            if (newsBox) {
                newsBox.style.background = '';
                newsBox.style.border = '';
                newsBox.style.padding = '';
                newsBox.style.borderRadius = '';
            }
            styledHeadings.forEach(function (el) {
                el.style.color = '';
                el.style.textShadow = '';
            });
            allLinks.forEach(function (el) {
                el.style.color = '';
            });

            const container = document.querySelector('.box_links');
            if (container) {
                const parent = container.parentElement;
                if (parent) {
                    for (let i = 0; i < parent.children.length; i++) {
                        parent.children[i].style.borderColor = '';
                    }
                }
            }
        }

        // Сохраняем состояние
        localStorage.setItem(STORAGE_KEY, isActive.toString());
        updateButton();
    }

    function updateButton() {
        // getElementById — повторное использование
        const btn = document.getElementById('rm-toggle-btn');
        if (btn) {
            // Меняем иконку в зависимости от статуса
            btn.textContent = isActive ? '🟢' : '🔴';
            btn.title = isActive
                ? 'Мультивселенная: ВКЛ (нажмите для выключения)'
                : 'Мультивселенная: ВЫКЛ (нажмите для включения)';

            // Подсветка активной кнопки — зелёная рамка как у выделенных иконок на сайте
            btn.style.backgroundColor = isActive ? '#97ce4c' : '#ffffff';
            btn.style.borderColor = isActive ? '#97ce4c' : '#cccccc';
        }
    }

    function createToggleButton() {
        // getElementById — проверка, не создана ли уже
        if (document.getElementById('rm-toggle-btn')) {
            console.log('Кнопка уже добавлена');
            return;
        }

        // querySelector — ищем контейнер с иконками-кнопками
        const buttonContainer = document.querySelector('.box_links');

        if (!buttonContainer) {
            console.log('Не найден контейнер .box_links для кнопок');
            return;
        }

        // Создаём кнопку — квадратную, как иконки на сайте
        const button = document.createElement('div');
        button.id = 'rm-toggle-btn';
        button.title = 'Переключить тему Рик и Морти';

        // Стили в стиле кнопок сайта: белый квадрат, без скруглений, в ряд
        Object.assign(button.style, {
            width: '30px',
            height: '30px',
            border: '1px solid #cccccc',
            backgroundColor: '#ffffff',
            color: '#333333',
            fontSize: '16px',
            cursor: 'pointer',
            margin: '0 0 0 6px',
            textAlign: 'center',
            lineHeight: '30px',
            float: 'left',
            boxSizing: 'border-box',
            userSelect: 'none',
            transition: 'transform 0.2s ease, background-color 0.2s ease'
        });

        // Эффекты при наведении — как у кнопок сайта
        button.addEventListener('mouseenter', function () {
            button.style.transform = 'scale(1.1)';
            button.style.backgroundColor = '#f0f0f0';
        });
        button.addEventListener('mouseleave', function () {
            button.style.transform = 'scale(1)';
            button.style.backgroundColor = isActive ? '#97ce4c' : '#ffffff';
        });

        // Обработчик клика
        button.addEventListener('click', function () {
            isActive = !isActive;
            toggleTheme();
        });

        // Добавляем кнопку в контейнер (в ряд с другими иконками)
        buttonContainer.appendChild(button);
        console.log('Кнопка переключения темы Рик и Морти добавлена');

        // Применяем сохранённое состояние
        updateButton();
        if (isActive) {
            toggleTheme();
        }
    }

    if (document.readyState === 'loading') {
        console.log('Кнопка будет добавлена после загрузки');
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        console.log('Кнопка добавляется');
        createToggleButton();
    }
}

addRickMortyTheme();