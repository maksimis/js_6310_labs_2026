'use strict';

(function () {
    const storageKey = 'comicThemeEnabled';
    const buttonId = 'comic-toggle-btn';

    function applyTheme(enabled) {
        document.body.classList.toggle('comic-theme-active', enabled);

        const wrapper = document.getElementById('page_wrapper');
        if (wrapper) {
            wrapper.classList.toggle('comic-box', enabled);
        }

        const blocks = document.querySelectorAll('#page_wrapper .news_box, #page_wrapper .box_items');
        blocks.forEach(block => {
            block.classList.toggle('comic-box', enabled);
            if (block.parentElement) {
                block.parentElement.classList.toggle('comic-section', enabled);
            }
        });

        const footer = document.querySelector('footer');
        if (footer) {
            for (const child of footer.children) {
                child.classList.toggle('comic-footer', enabled);
            }
        }

        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = enabled ? 'Вкл' : 'Выкл';
            button.title = enabled ? 'Comic Sans: включён' : 'Comic Sans: выключен';
            button.setAttribute('aria-label', button.title);
            button.setAttribute('aria-pressed', String(enabled));
        }
    }

    function toggleTheme() {
        const enabled = !document.body.classList.contains('comic-theme-active');
        localStorage.setItem(storageKey, String(enabled));
        applyTheme(enabled);
    }

    function init() {
        if (document.getElementById(buttonId)) {
            return;
        }

        const button = document.createElement('button');
        button.id = buttonId;
        button.type = 'button';
        button.addEventListener('click', toggleTheme);

        const links = document.querySelector('.box.cf .box_links');
        const container = links || document.body;
        container.appendChild(button);
        applyTheme(localStorage.getItem(storageKey) === 'true');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
