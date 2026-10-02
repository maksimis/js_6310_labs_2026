'use strict';

const STORAGE_KEY = 'kai_winter_enabled';
const BODY_CLASS = 'kai-winter-on';

const COMPLEX_SELECTOR =
  '.news_box.dark-mode-active .news_item, .news_box.dark-mode-active a';

const WINTER_CSS = `
.winter-toggle {
  width: auto;
  min-width: 80px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #90caf9;
  border-radius: 15px;
  background: linear-gradient(135deg, #ffffff, #e3f2fd);
  color: #0d3b66;
  font-size: 13px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  margin: 0 6px 0 0;
  float: left;
  user-select: none;
  box-shadow: 0 2px 10px rgba(144, 202, 249, 0.55);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.winter-toggle:hover {
  transform: scale(1.06);
  box-shadow: 0 4px 16px rgba(144, 202, 249, 0.8);
}
.winter-toggle[data-status="on"] {
  background: linear-gradient(135deg, #b3e5fc, #90caf9);
  border-color: #4fa8e0;
}
.winter-page {
  background:
    radial-gradient(circle at 20% 10%, rgba(179, 229, 252, 0.55) 0%, transparent 55%),
    radial-gradient(circle at 85% 90%, rgba(144, 202, 249, 0.45) 0%, transparent 55%),
    linear-gradient(160deg, #ffffff 0%, #e8f4fd 45%, #d4ecfb 100%) !important;
  background-attachment: fixed !important;
  color: #0d3b66 !important;
  font-size: 18px !important;
  min-height: 100vh;
}
.winter-slider {
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%) !important;
  border-bottom: 2px solid #b3e5fc !important;
  box-shadow: 0 2px 12px rgba(144, 202, 249, 0.45) !important;
}
.winter-news {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid #b3e5fc !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 18px rgba(144, 202, 249, 0.45) !important;
  color: #0d3b66 !important;
  padding: 12px !important;
}
.winter-link {
  color: #1e5a99 !important;
  text-decoration: none;
}
.winter-link:hover {
  color: #4fa8e0 !important;
  text-shadow: 0 0 6px #b3e5fc;
}
.news_box.dark-mode-active .news_item,
.news_box.dark-mode-active a {
  background: rgba(227, 242, 253, 0.6) !important;
  border-left: 3px solid #90caf9 !important;
  padding-left: 8px !important;
  border-radius: 6px;
}
.winter-news-item {
  color: #0d3b66 !important;
}
.winter-parent {
  background: rgba(255, 255, 255, 0.6) !important;
  border-radius: 14px;
}
#kai-snow-canvas {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  pointer-events: none !important;
  z-index: 2147483646 !important;
}
`;

const SNOW_COUNT = 80;
let snowAnimationId = null;
let snowCanvas = null;
let snowCtx = null;
let snowflakes = [];

function injectWinterStyles() {
  if (document.getElementById('kai-winter-styles')) return;
  const style = document.createElement('style');
  style.id = 'kai-winter-styles';
  style.textContent = WINTER_CSS;
  document.head.appendChild(style);
}

function startSnow() {
  if (document.getElementById('kai-snow-canvas')) return;

  snowCanvas = document.createElement('canvas');
  snowCanvas.id = 'kai-snow-canvas';
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
  document.body.appendChild(snowCanvas);

  snowCtx = snowCanvas.getContext('2d');

  snowflakes = [];
  for (let i = 0; i < SNOW_COUNT; i++) {
    snowflakes.push({
      x: Math.random() * snowCanvas.width,
      y: Math.random() * snowCanvas.height,
      r: Math.random() * 2.5 + 1,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.4,
    });
  }

  function draw() {
    if (!snowCtx || !snowCanvas) return;
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    snowCtx.fillStyle = '#ffffff';
    snowCtx.shadowColor = '#b3e5fc';
    snowCtx.shadowBlur = 6;

    snowflakes.forEach((f) => {
      snowCtx.globalAlpha = f.opacity;
      snowCtx.beginPath();
      snowCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      snowCtx.fill();

      f.y += f.speedY;
      f.x += f.speedX;

      if (f.y > snowCanvas.height + 5) {
        f.y = -5;
        f.x = Math.random() * snowCanvas.width;
      }
      if (f.x > snowCanvas.width + 5) f.x = -5;
      if (f.x < -5) f.x = snowCanvas.width + 5;
    });

    snowCtx.globalAlpha = 1;
    snowAnimationId = requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', resizeSnow);
}

function resizeSnow() {
  if (!snowCanvas) return;
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}

function stopSnow() {
  if (snowAnimationId) {
    cancelAnimationFrame(snowAnimationId);
    snowAnimationId = null;
  }
  window.removeEventListener('resize', resizeSnow);
  if (snowCanvas && snowCanvas.parentNode) {
    snowCanvas.parentNode.removeChild(snowCanvas);
  }
  snowCanvas = null;
  snowCtx = null;
  snowflakes = [];
}

function getPageElements() {
  const pageWrapper = document.getElementById('page_wrapper');
  const mainSlider = document.querySelector('.main_slider_holder');
  const newsBox = document.querySelector('.news_box');
  const allLinks = document.querySelectorAll('#page_wrapper a');
  const buttonContainer = document.querySelector('.box_links');
  const containerChildren = buttonContainer ? buttonContainer.children : [];
  const newsItems = document.querySelectorAll(COMPLEX_SELECTOR);

  return {
    pageWrapper,
    mainSlider,
    newsBox,
    allLinks,
    buttonContainer,
    containerChildren,
    newsItems,
  };
}

function enableWinterTheme() {
  const { pageWrapper, mainSlider, newsBox, allLinks, newsItems } = getPageElements();
  if (!pageWrapper) {
    console.log('[KAI Winter] #page_wrapper не найден');
    return;
  }

  document.documentElement.classList.add(BODY_CLASS);
  pageWrapper.classList.add('winter-page');
  if (mainSlider) mainSlider.classList.add('winter-slider');
  if (newsBox) {
    newsBox.classList.add('winter-news');
    newsBox.classList.add('dark-mode-active');
  }

  allLinks.forEach((link) => link.classList.add('winter-link'));
  newsItems.forEach((item) => item.classList.add('winter-news-item'));

  if (newsBox) {
    const parent = newsBox.parentElement;
    if (parent) parent.classList.add('winter-parent');
  }

  startSnow();
}

function disableWinterTheme() {
  const { pageWrapper, mainSlider, newsBox, allLinks, newsItems } = getPageElements();

  document.documentElement.classList.remove(BODY_CLASS);
  if (pageWrapper) pageWrapper.classList.remove('winter-page');
  if (mainSlider) mainSlider.classList.remove('winter-slider');
  if (newsBox) {
    newsBox.classList.remove('winter-news');
    newsBox.classList.remove('dark-mode-active');
  }

  allLinks.forEach((link) => link.classList.remove('winter-link'));
  newsItems.forEach((item) => item.classList.remove('winter-news-item'));

  if (newsBox && newsBox.parentElement) {
    newsBox.parentElement.classList.remove('winter-parent');
  }

  stopSnow();
}

function toggleWinterTheme() {
  const enabled = !document.documentElement.classList.contains(BODY_CLASS);

  if (enabled) {
    enableWinterTheme();
  } else {
    disableWinterTheme();
  }

  updateButtonState(enabled);

  try {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  } catch (e) {
    console.warn('[KAI Winter] localStorage недоступен:', e);
  }
}

function updateButtonState(enabled) {
  const btn = document.getElementById('winter-mode-toggle-btn');
  if (!btn) return;

  btn.textContent = enabled ? '☀️ Вкл' : '❄️ Выкл';
  btn.title = enabled ? 'Выключить зимнюю тему' : 'Включить зимнюю тему';
  btn.dataset.status = enabled ? 'on' : 'off';
}

function createToggleButton() {
  if (document.getElementById('winter-mode-toggle-btn')) return;

  const { buttonContainer, containerChildren } = getPageElements();
  if (!buttonContainer) {
    console.log('[KAI Winter] .box_links не найден');
    return;
  }

  const button = document.createElement('div');
  button.id = 'winter-mode-toggle-btn';
  button.className = 'winter-toggle';
  button.textContent = '❄️ Выкл';
  button.title = 'Включить зимнюю тему';
  button.dataset.status = 'off';

  button.addEventListener('click', toggleWinterTheme);

  if (containerChildren.length > 0) {
    buttonContainer.insertBefore(button, containerChildren[0]);
  } else {
    buttonContainer.appendChild(button);
  }

  console.log('[KAI Winter] Кнопка добавлена. Потомков в .box_links:', containerChildren.length);
}

function restoreState() {
  let enabled = false;
  try {
    enabled = localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {}

  if (enabled) {
    enableWinterTheme();
  }
  updateButtonState(enabled);
}

function init() {
  injectWinterStyles();
  createToggleButton();
  restoreState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const observer = new MutationObserver(() => {
  if (!document.getElementById('winter-mode-toggle-btn')) {
    createToggleButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });