'use strict';

function toggleComicTheme() {
    const body = document.body;
    const isEnabled = !body.classList.contains('comic-theme-active');
    
    // 1. Сохраняем состояние (localStorage)
    localStorage.setItem('comicThemeEnabled', isEnabled);
    
    if (isEnabled) {
        body.classList.add('comic-theme-active');
    } else {
        body.classList.remove('comic-theme-active');
    }

    // 2. getElementById
    const pageWrapper = document.getElementById('page_wrapper') || document.getElementById('wrapper');
    if (pageWrapper) {
        pageWrapper.classList.toggle('comic-box', isEnabled);
    }

    // 3. querySelector
    const mainSlider = document.querySelector('.main_slider_holder') || document.querySelector('.header');
    if (mainSlider) {
        mainSlider.classList.toggle('comic-rotate', isEnabled);
    }

    // 4. querySelectorAll (сложный селектор) и parentElement
    const textBlocks = document.querySelectorAll('div.news_box .news-item, .page-content p, .info-block');
    textBlocks.forEach(item => {
        item.classList.toggle('comic-box', isEnabled);
        
        if (item.parentElement) {
            item.parentElement.classList.toggle('comic-box', isEnabled);
        }
    });

    // 5. children
    const footer = document.querySelector('footer') || document.querySelector('.footer');
    if (footer && footer.children) {
        for (let i = 0; i < footer.children.length; i++) {
            footer.children[i].classList.toggle('comic-box', isEnabled);
        }
    }

    // Обновляем текст кнопки
    const btn = document.getElementById('comic-toggle-btn');
    if (btn) {
        btn.textContent = isEnabled ? '🤡 Выключить Comic Sans' : '🖍 Включить Comic Sans';
    }
}

function initPlugin() {
    // Создаем кнопку переключения
    const button = document.createElement('button');
    button.id = 'comic-toggle-btn';
    
    // Восстанавливаем состояние при загрузке
    const isEnabled = localStorage.getItem('comicThemeEnabled') === 'true';
    button.textContent = isEnabled ? '🤡 Выключить Comic Sans' : '🖍 Включить Comic Sans';
    
    button.addEventListener('click', toggleComicTheme);
    document.body.appendChild(button);

    // Применяем сохраненную тему
    if (isEnabled) {
        // Мы уже добавили класс на body выше? Нет, давайте применим всё
        // Временный хак: ставим false в localStorage, чтобы toggleComicTheme переключил в true
        localStorage.setItem('comicThemeEnabled', 'false'); 
        toggleComicTheme();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlugin);
} else {
    initPlugin();
}
