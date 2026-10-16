'use strict'

function addFireMode() {

    function toggleFireMode(button) {
        const pageWrapper = document.getElementById('page_wrapper');
        const mainSlider = document.querySelector('.main_slider_holder');
        const newsBox = document.querySelector('.news_box');

        const newsParent = newsBox ? newsBox.parentElement : null;
        const newsChildren = newsBox ? newsBox.children : [];
        const newsItems = document.querySelectorAll('.news_box a');

        const navbar = document.querySelector('.menu-list');
        const navLinks = document.querySelectorAll(
            '.menu-list .lfr-nav-item > a'
        );

        const weekParity = document.querySelector('.week_parity');
        const loginButton = document.querySelector('.login_links a');

        const rssButtons = document.querySelectorAll(
            '.bar_btns .kai-btn-block'
        );

        const breadcrumbsNav = document.querySelector('#breadcrumbs');

        const breadcrumbPortlet = document.querySelector(
            '#breadcrumbs .portlet-boundary'
        );

        const breadcrumbContent = document.querySelector(
            '#breadcrumbs .portlet-content'
        );

        const breadcrumbBody = document.querySelector(
            '#breadcrumbs .portlet-body'
        );

        const breadcrumb = document.querySelector(
            '#breadcrumbs .breadcrumb.breadcrumb-horizontal'
        );

        const breadcrumbItems = document.querySelectorAll(
            '#breadcrumbs .breadcrumb.breadcrumb-horizontal > li'
        );

        const breadcrumbLinks = document.querySelectorAll(
            '#breadcrumbs .breadcrumb.breadcrumb-horizontal li a'
        );

        const categories = document.querySelector(
            '.items_categories.single'
        );

        const categoryLinks = document.querySelectorAll(
            '.items_categories.single > a'
        );

        const activeCategory = document.querySelector(
            '.items_categories.single > a.active'
        );

        const allNewsButton = document.querySelector(
            '.kai-btn-block[href="/news"]'
        );

        if (!pageWrapper) {
            console.log('Элемент page_wrapper не найден');
            return;
        }

        const currentBg = getComputedStyle(pageWrapper).backgroundColor;

        if (
            currentBg === 'rgb(142, 19, 19)' ||
            currentBg === 'rgb(92, 11, 11)'
        ) {
            // Основной фон
            pageWrapper.style.backgroundColor = '';
            pageWrapper.style.color = '';
            pageWrapper.style.fontSize = '';

            if (mainSlider) {
                mainSlider.style.background = '';
            }

            // Новости
            if (newsBox) {
                newsBox.style.background = '';
                newsBox.style.border = '';
                newsBox.style.borderRadius = '';
            }

            newsItems.forEach(item => {
                item.style.color = '';
                item.style.fontWeight = '';
            });

            if (newsParent) {
                newsParent.style.borderLeft = '';
            }

            for (let i = 0; i < newsChildren.length; i++) {
                newsChildren[i].style.padding = '';
            }

            // Навигация
            if (navbar) {
                navbar.style.backgroundColor = '';
                navbar.style.borderTop = '';
                navbar.style.borderBottom = '';
            }

            navLinks.forEach(link => {
                link.style.color = '';
                link.style.fontWeight = '';
                link.style.backgroundColor = '';
            });

            // Четная неделя
            if (weekParity) {
                weekParity.style.backgroundColor = '';
                weekParity.style.color = '';
                weekParity.style.border = '';
            }

            // Вход
            if (loginButton) {
                loginButton.style.color = '';
                loginButton.style.fontWeight = '';
            }

            // RSS
            rssButtons.forEach(rssButton => {
                rssButton.style.removeProperty('background-color');
                rssButton.style.removeProperty('color');
                rssButton.style.removeProperty('border');
            });

            // Breadcrumbs
            if (breadcrumbsNav) {
                breadcrumbsNav.style.removeProperty('background-color');
            }

            if (breadcrumbPortlet) {
                breadcrumbPortlet.style.removeProperty('background-color');
            }

            if (breadcrumbContent) {
                breadcrumbContent.style.removeProperty('background-color');
            }

            if (breadcrumbBody) {
                breadcrumbBody.style.removeProperty('background-color');
            }

            if (breadcrumb) {
                breadcrumb.style.removeProperty('background-color');
                breadcrumb.style.removeProperty('border-left');
                breadcrumb.style.removeProperty('padding');
            }

            breadcrumbItems.forEach(item => {
                item.style.removeProperty('background-color');
            });

            breadcrumbLinks.forEach(link => {
                link.style.removeProperty('color');
                link.style.removeProperty('font-weight');
            });

            // Меню страницы
            if (categories) {
                categories.style.removeProperty('background-color');
                categories.style.removeProperty('border');
                categories.style.removeProperty('padding');
            }

            categoryLinks.forEach(link => {
                link.style.removeProperty('background-color');
                link.style.removeProperty('color');
                link.style.removeProperty('border-left');
                link.style.removeProperty('font-weight');
                link.style.removeProperty('padding');
            });

            // Все новости
            if (allNewsButton) {
                allNewsButton.style.removeProperty('background-color');
                allNewsButton.style.removeProperty('color');
                allNewsButton.style.removeProperty('border');
            }

            button.textContent = '🔥 ВЫКЛ';
            button.style.backgroundColor = '#5c0b0b';
            button.style.color = '#ff5e00';

            localStorage.setItem('firemod', 'off');

            return;
        }

        // Основной фон
        pageWrapper.style.backgroundColor = '#8e1313';
        pageWrapper.style.color = '#ff5e00';
        pageWrapper.style.fontSize = '20px';

        if (mainSlider) {
            mainSlider.style.background = '#8e1313';
        }

        // Новости
        if (newsBox) {
            newsBox.style.background = '#ff5e00';
            newsBox.style.border = '3px solid #ff5e00';
            newsBox.style.borderRadius = '0';
        }

        newsItems.forEach(item => {
            item.style.color = '#ff5e00';
            item.style.fontWeight = 'bold';
        });

        if (newsParent) {
            newsParent.style.borderLeft = '6px solid #8e1313';
        }

        for (let i = 0; i < newsChildren.length; i++) {
            newsChildren[i].style.padding = '5px';
        }

        // Навигация
        if (navbar) {
            navbar.style.backgroundColor = '#5c0b0b';
            navbar.style.borderTop = '3px solid #ff5e00';
            navbar.style.borderBottom = '3px solid #ff5e00';
        }

        navLinks.forEach(link => {
            link.style.color = '#ff8a3d';
            link.style.fontWeight = 'bold';
        });

        // Четная неделя
        if (weekParity) {
            weekParity.style.backgroundColor = '#5c0b0b';
            weekParity.style.color = '#ff8a3d';
            weekParity.style.border = '2px solid #ff5e00';
        }

        // Вход
        if (loginButton) {
            loginButton.style.color = '#ff8a3d';
            loginButton.style.fontWeight = 'bold';
        }

        // RSS
        rssButtons.forEach(rssButton => {
            rssButton.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );

            rssButton.style.setProperty(
                'color',
                '#ff5e00',
                'important'
            );

            rssButton.style.setProperty(
                'border',
                '2px solid #ff5e00',
                'important'
            );
        });

        // Breadcrumbs
        if (breadcrumbsNav) {
            breadcrumbsNav.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );
        }

        if (breadcrumbPortlet) {
            breadcrumbPortlet.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );
        }

        if (breadcrumbContent) {
            breadcrumbContent.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );
        }

        if (breadcrumbBody) {
            breadcrumbBody.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );
        }

        if (breadcrumb) {
            breadcrumb.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );

            breadcrumb.style.setProperty(
                'border-left',
                '5px solid #ff5e00',
                'important'
            );

            breadcrumb.style.setProperty(
                'padding',
                '10px 15px',
                'important'
            );
        }

        breadcrumbItems.forEach(item => {
            item.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );
        });

        breadcrumbLinks.forEach(link => {
            link.style.setProperty(
                'color',
                '#ff8a3d',
                'important'
            );

            link.style.setProperty(
                'font-weight',
                'bold',
                'important'
            );
        });

        // Меню страницы
        if (categories) {
            categories.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );

            categories.style.setProperty(
                'border',
                '2px solid #8e1313',
                'important'
            );

            categories.style.setProperty(
                'padding',
                '5px',
                'important'
            );
        }

        categoryLinks.forEach(link => {
            link.style.setProperty(
                'background-color',
                'transparent',
                'important'
            );

            link.style.setProperty(
                'color',
                '#ff8a3d',
                'important'
            );

            link.style.setProperty(
                'border-left',
                '4px solid transparent',
                'important'
            );

            link.style.setProperty(
                'font-weight',
                'bold',
                'important'
            );

            link.style.setProperty(
                'padding',
                '8px 12px',
                'important'
            );
        });

        if (activeCategory) {
            activeCategory.style.setProperty(
                'background-color',
                '#ff5e00',
                'important'
            );

            activeCategory.style.setProperty(
                'color',
                '#5c0b0b',
                'important'
            );

            activeCategory.style.setProperty(
                'border-left',
                '4px solid #8e1313',
                'important'
            );
        }

        // Все новости
        if (allNewsButton) {
            allNewsButton.style.setProperty(
                'background-color',
                '#5c0b0b',
                'important'
            );

            allNewsButton.style.setProperty(
                'color',
                '#ff5e00',
                'important'
            );

            allNewsButton.style.setProperty(
                'border',
                '2px solid #ff5e00',
                'important'
            );
        }

        button.textContent = '🔥 ВКЛ';
        button.style.backgroundColor = '#5c0b0b';
        button.style.color = '#ff5e00';

        localStorage.setItem('firemod', 'on');
    }

    function createToggleButton() {
        if (document.getElementById('fire-mode-toggle-btn')) {
            console.log('Кнопка уже существует');
            return;
        }

        const buttonContainer = document.querySelector('.box_links');

        if (!buttonContainer) {
            console.log('Контейнер .box_links не найден');
            return;
        }

        const button = document.createElement('div');

        button.id = 'fire-mode-toggle-btn';
        button.textContent = '🔥 ВЫКЛ';
        button.title = 'Переключить огненный режим';

        Object.assign(button.style, {
            width: '80px',
            height: '30px',
            backgroundColor: '#5c0b0b',
            color: '#ff5e00',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: '0 0 0 6px',
            textAlign: 'center',
            lineHeight: 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            float: 'left',
            border: '2px solid #ff5e00',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap'
        });

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#ff5e00';
            button.style.color = '#5c0b0b';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#5c0b0b';
            button.style.color = '#ff5e00';
        });

        buttonContainer.appendChild(button);

        const navLinks = document.querySelectorAll(
            '.menu-list .lfr-nav-item > a'
        );

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (localStorage.getItem('firemod') === 'on') {
                    link.style.setProperty(
                        'background-color',
                        '#ff5e00',
                        'important'
                    );

                    link.style.setProperty(
                        'color',
                        '#5c0b0b',
                        'important'
                    );
                }
            });

            link.addEventListener('mouseleave', () => {
                if (localStorage.getItem('firemod') === 'on') {
                    link.style.setProperty(
                        'background-color',
                        'transparent',
                        'important'
                    );

                    link.style.setProperty(
                        'color',
                        '#ff8a3d',
                        'important'
                    );
                }
            });
        });

        const categoryLinks = document.querySelectorAll(
            '.items_categories.single > a'
        );

        categoryLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (localStorage.getItem('firemod') === 'on') {
                    link.style.setProperty(
                        'background-color',
                        '#8e1313',
                        'important'
                    );

                    link.style.setProperty(
                        'color',
                        '#ff5e00',
                        'important'
                    );

                    link.style.setProperty(
                        'border-left',
                        '4px solid #ff5e00',
                        'important'
                    );
                }
            });

            link.addEventListener('mouseleave', () => {
                if (localStorage.getItem('firemod') !== 'on') {
                    return;
                }

                if (link.classList.contains('active')) {
                    link.style.setProperty(
                        'background-color',
                        '#ff5e00',
                        'important'
                    );

                    link.style.setProperty(
                        'color',
                        '#5c0b0b',
                        'important'
                    );

                    link.style.setProperty(
                        'border-left',
                        '4px solid #8e1313',
                        'important'
                    );
                } else {
                    link.style.setProperty(
                        'background-color',
                        'transparent',
                        'important'
                    );

                    link.style.setProperty(
                        'color',
                        '#ff8a3d',
                        'important'
                    );

                    link.style.setProperty(
                        'border-left',
                        '4px solid transparent',
                        'important'
                    );
                }
            });
        });

        const allNewsButton = document.querySelector(
            '.kai-btn-block[href="/news"]'
        );

        if (allNewsButton) {
            allNewsButton.addEventListener('mouseenter', () => {
                if (localStorage.getItem('firemod') === 'on') {
                    allNewsButton.style.setProperty(
                        'background-color',
                        '#ff5e00',
                        'important'
                    );

                    allNewsButton.style.setProperty(
                        'color',
                        '#5c0b0b',
                        'important'
                    );
                }
            });

            allNewsButton.addEventListener('mouseleave', () => {
                if (localStorage.getItem('firemod') === 'on') {
                    allNewsButton.style.setProperty(
                        'background-color',
                        '#5c0b0b',
                        'important'
                    );

                    allNewsButton.style.setProperty(
                        'color',
                        '#ff5e00',
                        'important'
                    );
                }
            });
        }

        button.addEventListener('click', () => {
            toggleFireMode(button);
        });

        const savedMode = localStorage.getItem('firemod');

        if (savedMode === 'on') {
            toggleFireMode(button);
        }

        console.log('Огненный режим готов');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
}

addFireMode();