'use strict';

(function () {
  const STORAGE_KEY = 'avatarThemeEnabled';
  const BODY_CLASS = 'avatar-theme-enabled';
  const BTN_ID = 'avatar-theme-toggle';
  const STYLE_ID = 'avatar-theme-styles';

  // ============ SVG-узоры для колонн ============
  const PATTERN_EARTH = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300' preserveAspectRatio='none'><g fill='none' stroke='%23ffffff' stroke-width='1.8' opacity='0.55' stroke-linejoin='round'><path d='M50 0 L100 30 L50 60 L0 30 Z'/><path d='M50 60 L100 90 L50 120 L0 90 Z'/><path d='M50 120 L100 150 L50 180 L0 150 Z'/><path d='M50 180 L100 210 L50 240 L0 210 Z'/><path d='M50 240 L100 270 L50 300 L0 270 Z'/></g></svg>")`;
  const PATTERN_FIRE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300' preserveAspectRatio='none'><g fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.6' stroke-linecap='round'><path d='M50 300 Q40 260 50 220 Q60 180 50 140 Q40 100 50 60 Q60 100 50 140 Q40 180 50 220 Q60 260 50 300 Z'/><path d='M20 300 Q12 260 20 220 Q28 180 20 140 Q12 100 20 60 Q28 100 20 140 Q12 180 20 220 Q28 260 20 300 Z'/><path d='M80 300 Q72 260 80 220 Q88 180 80 140 Q72 100 80 60 Q88 100 80 140 Q72 180 80 220 Q88 260 80 300 Z'/></g></svg>")`;
  const PATTERN_AIR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300' preserveAspectRatio='none'><g fill='none' stroke='%23ffffff' stroke-width='1.8' opacity='0.7' stroke-linecap='round'><path d='M50 15 Q75 15 75 40 Q75 65 50 65 Q25 65 25 40 Q25 15 50 15'/><path d='M50 90 Q75 90 75 115 Q75 140 50 140 Q25 140 25 115 Q25 90 50 90'/><path d='M50 165 Q75 165 75 190 Q75 215 50 215 Q25 215 25 190 Q25 165 50 165'/><path d='M50 240 Q75 240 75 265 Q75 290 50 290 Q25 290 25 265 Q25 240 50 240'/><path d='M12 55 Q2 80 12 105 Q22 130 12 155'/><path d='M88 55 Q98 80 88 105 Q78 130 88 155'/></g></svg>")`;
  const PATTERN_WATER = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 300' preserveAspectRatio='none'><g fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.65' stroke-linecap='round'><path d='M0 20 Q25 0 50 20 T 100 20'/><path d='M0 60 Q25 40 50 60 T 100 60'/><path d='M0 100 Q25 80 50 100 T 100 100'/><path d='M0 140 Q25 120 50 140 T 100 140'/><path d='M0 180 Q25 160 50 180 T 100 180'/><path d='M0 220 Q25 200 50 220 T 100 220'/><path d='M0 260 Q25 240 50 260 T 100 260'/><path d='M0 300 Q25 280 50 300 T 100 300'/></g></svg>")`;

  const CSS = `
    /* ===== Фон на весь экран ===== */
    html { min-height: 100vh; }
    html:has(body.${BODY_CLASS}) {
      background:
        linear-gradient(135deg, #a5d6a7 0%, #90caf9 33%, #fff59d 66%, #ef9a9a 100%) fixed !important;
      background-size: 100vw 100vh !important;
    }

    body.${BODY_CLASS} {
      background: transparent !important;
      color: #0d47a1 !important;
      font-family: "Segoe UI", "Helvetica Neue", sans-serif !important;
      letter-spacing: 0.2px !important;
      min-height: 100vh;
    }

    /* ===== ДЕКОР: полоска сверху ===== */
    .avatar-stripe { display: none; }
    body.${BODY_CLASS} .avatar-stripe {
      display: block;
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 5px;
      z-index: 2147483645;
      pointer-events: none;
      background: linear-gradient(90deg,
        #43a047 0%,
        #e53935 33%,
        #fdd835 66%,
        #039be5 100%);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
    }

    /* ===== ДЕКОР: 4 иконки по углам ===== */
    .avatar-corners { display: none; }
    body.${BODY_CLASS} .avatar-corners {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 2147483640;
      pointer-events: none;
    }
    body.${BODY_CLASS} .avatar-corners svg {
      position: absolute;
      width: 72px;
      height: 72px;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
      animation: avatar-corner-float 6s ease-in-out infinite;
    }
    body.${BODY_CLASS} .avatar-corners svg:nth-child(1) { top: 24px; left: 24px; }
    body.${BODY_CLASS} .avatar-corners svg:nth-child(2) { top: 24px; right: 24px; animation-delay: 1.5s; }
    body.${BODY_CLASS} .avatar-corners svg:nth-child(3) { bottom: 24px; left: 24px; animation-delay: 3s; }
    body.${BODY_CLASS} .avatar-corners svg:nth-child(4) { bottom: 24px; right: 24px; animation-delay: 4.5s; }
    @keyframes avatar-corner-float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.85; }
      50%      { transform: translateY(-8px) rotate(6deg); opacity: 1; }
    }

    /* ===== МЕНЮ ===== */
    body.${BODY_CLASS} .avatar-menu-bar {
      background: linear-gradient(90deg,
        #43a047 0%,
        #e53935 33%,
        #fdd835 66%,
        #039be5 100%
      ) !important;
      background-image: linear-gradient(90deg,
        #43a047 0%,
        #e53935 33%,
        #fdd835 66%,
        #039be5 100%
      ) !important;
    }
    body.${BODY_CLASS} .avatar-menu-bar a,
    body.${BODY_CLASS} .avatar-menu-bar span,
    body.${BODY_CLASS} .avatar-menu-bar li {
      color: #ffffff !important;
      font-weight: 700 !important;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
    }

    /* ===== Надпись «Чётная неделя» ===== */
    body.${BODY_CLASS} .week_parity,
    body.${BODY_CLASS} .week_parity a,
    body.${BODY_CLASS} .week_parity span,
    body.${BODY_CLASS} [class*="week_parity"],
    body.${BODY_CLASS} [class*="week_parity"] * {
      color: #ffffff !important;
      background: linear-gradient(90deg, rgb(216, 122, 121) 0%, rgb(160, 205, 227) 100%) !important;
      background-image: linear-gradient(90deg, rgb(216, 122, 121) 0%, rgb(160, 205, 227) 100%) !important;
      border-radius: 6px !important;
      padding: 4px 10px !important;
      font-weight: 700 !important;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
    }

    /* ===== Слайдер с узорами ===== */
    body.${BODY_CLASS} .main_slider_holder {
      min-height: 220px !important;
      border-radius: 16px !important;
      border: 3px solid #ffffff !important;
      box-shadow:
        0 10px 32px rgba(0, 0, 0, 0.25),
        0 0 0 2px rgba(255, 255, 255, 0.7) inset !important;
      overflow: hidden !important;
      position: relative !important;
      background-color: #f5f5f5;
      background-image:
        ${PATTERN_EARTH}, ${PATTERN_FIRE}, ${PATTERN_AIR}, ${PATTERN_WATER},
        linear-gradient(180deg, #43a047 0%, #1b5e20 100%),
        linear-gradient(180deg, #d32f2f 0%, #f57c00 55%, #fdd835 100%),
        linear-gradient(180deg, #fdd835 0%, #fff9c4 60%, #fffde7 100%),
        linear-gradient(180deg, #039be5 0%, #4fc3f7 55%, #e1f5fe 100%);
      background-position:
        0% 0%, 33.33% 0%, 66.67% 0%, 100% 0%,
        0% 0%, 33.33% 0%, 66.67% 0%, 100% 0%;
      background-size:
        25% 100%, 25% 100%, 25% 100%, 25% 100%,
        25% 100%, 25% 100%, 25% 100%, 25% 100%;
      background-repeat: no-repeat;
    }

    /* ===== Обёртка ===== */
    body.${BODY_CLASS} #page_wrapper {
      position: relative;
      z-index: 2;
      background: rgba(255, 255, 255, 0.72) !important;
      border-radius: 20px !important;
      padding: 16px !important;
      backdrop-filter: blur(8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18) !important;
      margin: 14px !important;
    }

    /* ===== Новости ===== */
    body.${BODY_CLASS} .news_box {
      background: linear-gradient(160deg,
        rgba(255, 255, 255, 0.96) 0%,
        rgba(232, 245, 233, 0.96) 30%,
        rgba(255, 253, 231, 0.96) 55%,
        rgba(255, 205, 210, 0.96) 80%,
        rgba(227, 242, 253, 0.96) 100%
      ) !important;
      border-left: 8px solid #43a047 !important;
      border-right: 8px solid #039be5 !important;
      border-radius: 14px !important;
      padding: 20px !important;
      box-shadow:
        0 8px 24px rgba(67, 160, 71, 0.35),
        0 0 0 2px rgba(229, 57, 53, 0.2) inset !important;
      color: #1a237e !important;
    }

    /* ===== Ссылки ===== */
    body.${BODY_CLASS} a {
      color: #0277bd !important;
      text-decoration: underline dotted !important;
    }
    body.${BODY_CLASS} a:hover { color: #c62828 !important; }

    /* ===== Кнопка ===== */
    #${BTN_ID} {
      display: inline-block;
      min-width: 150px;
      height: 38px;
      margin: 0 0 0 8px;
      padding: 0 16px;
      border: 2px solid #ffffff;
      border-radius: 19px;
      background: linear-gradient(90deg, #4fc3f7 0%, #26a69a 100%);
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: transform 0.2s ease, filter 0.2s ease;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      vertical-align: middle;
      animation: avatar-wind-pulse 2.4s ease-in-out infinite;
    }
    @keyframes avatar-wind-pulse {
      0%, 100% { box-shadow: 0 4px 14px rgba(79, 195, 247, 0.65), 0 0 0 3px rgba(255, 255, 255, 0.45); }
      50%      { box-shadow: 0 4px 22px rgba(38, 166, 154, 0.95), 0 0 0 4px rgba(178, 223, 219, 0.7); }
    }
    #${BTN_ID}.avatar-btn-fire {
      background: linear-gradient(90deg, #b71c1c 0%, #6d4c41 50%, #fdd835 100%);
      animation: avatar-fire-pulse 1.6s ease-in-out infinite;
    }
    @keyframes avatar-fire-pulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(183, 28, 28, 0.85), 0 0 0 3px rgba(255, 235, 59, 0.5); }
      50%      { box-shadow: 0 6px 26px rgba(255, 152, 0, 1), 0 0 0 4px rgba(255, 87, 34, 0.75); }
    }
    #${BTN_ID}:hover {
      transform: scale(1.06);
      filter: brightness(1.1) saturate(1.15);
    }
    #${BTN_ID}:active { transform: scale(0.96); }
  `;

  // ============ Внедрение стилей ============
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // ============ Декор: полоска + углы ============
  function addDecor() {
    if (!document.getElementById('avatar-stripe')) {
      const stripe = document.createElement('div');
      stripe.id = 'avatar-stripe';
      stripe.className = 'avatar-stripe';
      document.body.appendChild(stripe);
    }

    if (document.getElementById('avatar-corners')) return;
    const corners = document.createElement('div');
    corners.id = 'avatar-corners';
    corners.className = 'avatar-corners';
    corners.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#43a047" stroke-width="6"/>
        <rect x="32" y="32" width="36" height="36" fill="none" stroke="#43a047" stroke-width="6"/>
      </svg>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e53935" stroke-width="6"/>
        <path d="M50 20 C34 44, 34 74, 50 84 C66 74, 66 44, 50 20 Z" fill="none" stroke="#e53935" stroke-width="6" stroke-linejoin="round"/>
        <path d="M50 48 C44 58, 44 72, 50 78 C56 72, 56 58, 50 48 Z" fill="#e53935"/>
      </svg>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#fdd835" stroke-width="6"/>
        <path d="M30 40 Q36.5 32 43 40 Q49.5 48 56 40 Q63 32 70 40" fill="none" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>
        <path d="M30 52 Q36.5 44 43 52 Q49.5 60 56 52 Q63 44 70 52" fill="none" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>
        <path d="M30 64 Q36.5 56 43 64 Q49.5 72 56 64 Q63 56 70 64" fill="none" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>
      </svg>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#039be5" stroke-width="6"/>
        <path d="M50 22 C38 40, 32 52, 32 62 A18 18 0 0 0 68 62 C68 52, 62 40, 50 22 Z"
              fill="none" stroke="#039be5" stroke-width="6" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(corners);
  }

  // ============ Найти меню и повесить класс ============
  function findAndMarkMenu() {
    document.querySelectorAll('.avatar-menu-bar').forEach((el) => {
      el.classList.remove('avatar-menu-bar');
    });

    const candidates = document.querySelectorAll('div, nav, ul, section');
    for (const el of candidates) {
      const t = el.textContent;
      if (!t) continue;
      if (
        t.includes('УНИВЕРСИТЕТ') &&
        t.includes('ОБРАЗОВАНИЕ') &&
        t.includes('НАУКА И ИННОВАЦИИ')
      ) {
        if (
          el.offsetHeight > 20 &&
          el.offsetHeight < 100 &&
          el.offsetWidth > 500
        ) {
          el.classList.add('avatar-menu-bar');
          return true;
        }
      }
    }
    return false;
  }

  // ============ Логика ============
  function isEnabled() {
    return document.body.classList.contains(BODY_CLASS);
  }

  function updateButtonText(btn) {
    if (!btn) return;
    const on = isEnabled();
    btn.textContent = on ? '🔥 Стиль: ВКЛ' : '🌪 Стиль: ВЫКЛ';
    btn.title = on ? 'Отключить тему четырёх стихий' : 'Включить тему четырёх стихий';
    btn.classList.toggle('avatar-btn-fire', on);
  }

  function applyTheme(enabled) {
    document.body.classList.toggle(BODY_CLASS, enabled);

    // getElementById
    const pageWrapper = document.getElementById('page_wrapper');
    if (pageWrapper) pageWrapper.classList.toggle('avatar-themed', enabled);

    // querySelector
    const mainSlider = document.querySelector('.main_slider_holder');
    const newsBox = document.querySelector('.news_box');
    [mainSlider, newsBox].forEach((el) => {
      if (el) el.classList.toggle('avatar-themed', enabled);
    });

    // querySelectorAll + СЛОЖНЫЙ СЕЛЕКТОР
    const activeNavLinks = document.querySelectorAll(
      '.main_menu li.active > a, .main_menu .nav-item.active > a'
    );
    activeNavLinks.forEach((link) => {
      link.classList.toggle('avatar-themed-link', enabled);
      // parentElement
      if (link.parentElement) {
        link.parentElement.classList.toggle('avatar-themed-item', enabled);
      }
    });

    // querySelectorAll по ссылкам
    const navLinks = document.querySelectorAll('.main_menu a, .box_links a');
    navLinks.forEach((link) =>
      link.classList.toggle('avatar-themed-link', enabled)
    );

    // children
    const navContainer = document.querySelector('.box_links');
    if (navContainer) {
      Array.from(navContainer.children).forEach((child) => {
        child.classList.toggle('avatar-themed-child', enabled);
      });
      if (navContainer.parentElement) {
        navContainer.parentElement.classList.toggle(
          'avatar-themed-nav-parent',
          enabled
        );
      }
    }

    if (enabled) {
      findAndMarkMenu();
      setTimeout(findAndMarkMenu, 500);
      setTimeout(findAndMarkMenu, 1500);
    }
  }

  function createToggleButton() {
    if (document.getElementById(BTN_ID)) return;
    const container = document.querySelector('.box_links');
    if (!container) return;

    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';

    btn.addEventListener('click', () => {
      const next = !isEnabled();
      localStorage.setItem(STORAGE_KEY, String(next));
      applyTheme(next);
      updateButtonText(btn);
    });

    container.appendChild(btn);
    updateButtonText(btn);
  }

  // ============ Инициализация ============
  injectStyles();
  addDecor();

  const saved = localStorage.getItem(STORAGE_KEY) === 'true';
  if (saved) applyTheme(true);

  function init() {
    createToggleButton();
    if (saved) updateButtonText(document.getElementById(BTN_ID));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();