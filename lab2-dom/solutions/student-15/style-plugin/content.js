'use strict';

const STORAGE_KEY = 'futurama-neon-enabled';

// ===== Внедрение CSS =====
function injectStyles() {
    if (document.getElementById('futurama-styles')) return;

    const style = document.createElement('style');
    style.id = 'futurama-styles';
    style.textContent = `

        /* ============================================================
           ПАЛИТРА ФУТУРАМЫ:
           - фон:        #0d1117 (космос)
           - поверхность:#1b2733 (металл серо-голубой)
           - панели:     #243447
           - границы:    #3a4a5c (сталь)
           - акцент:     #ff6a00 (неоновый оранжевый)
           - текст:      #e6edf3 (холодный белый)
           ============================================================ */

        /* ===== 1. БАЗА ===== */
        html.futurama-mode,
        body.futurama-mode {
            background:
                radial-gradient(ellipse at top, #1b2733 0%, #0d1117 60%, #05080b 100%) !important;
            background-attachment: fixed !important;
            color: #e6edf3 !important;
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif !important;
        }
        body.futurama-mode p,
        body.futurama-mode span,
        body.futurama-mode li,
        body.futurama-mode td {
            color: #e6edf3 !important;
        }
        body.futurama-mode a {
            color: #ff6a00 !important;
        }
        body.futurama-mode a:hover { color: #ffa040 !important; }

        /* Лёгкий металлический блик по верхнему краю */
        body.futurama-mode::before {
            content: '' !important;
            position: fixed !important;
            top: 0; left: 0;
            width: 100%; height: 2px;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(255,106,0,0.8) 50%,
                transparent 100%) !important;
            box-shadow: 0 0 20px rgba(255,106,0,0.6) !important;
            pointer-events: none !important;
            z-index: 999998 !important;
        }

        /* ===== 2. УБИРАЕМ БЕЛЫЕ ФОНЫ ===== */
        body.futurama-mode #page_wrapper,
        body.futurama-mode #wrapper,
        body.futurama-mode #container,
        body.futurama-mode .page,
        body.futurama-mode .page-wrapper,
        body.futurama-mode .page_holder,
        body.futurama-mode .content,
        body.futurama-mode .content-wrapper,
        body.futurama-mode .main-content,
        body.futurama-mode .page-content,
        body.futurama-mode main,
        body.futurama-mode section,
        body.futurama-mode article,
        body.futurama-mode aside,
        body.futurama-mode [class*="layout"],
        body.futurama-mode [class*="region"],
        body.futurama-mode [class*="area"],
        body.futurama-mode [class*="section"],
        body.futurama-mode [class*="lfr-"],
        body.futurama-mode [class*="portlet-"],
        body.futurama-mode [class*="aui-"],
        body.futurama-mode [class*="column"],
        body.futurama-mode [class*="grid"],
        body.futurama-mode [class*="col-"],
        body.futurama-mode [id^="p_p_id_"],
        body.futurama-mode [id^="column-"] {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
        }

        body.futurama-mode [style*="background: white"],
        body.futurama-mode [style*="background-color: white"],
        body.futurama-mode [style*="background:#fff"],
        body.futurama-mode [style*="background: #fff"],
        body.futurama-mode [style*="background-color:#fff"],
        body.futurama-mode [style*="background-color: #fff"],
        body.futurama-mode [style*="background-color:#ffffff"],
        body.futurama-mode [style*="background-color: #ffffff"],
        body.futurama-mode [style*="background:#ffffff"],
        body.futurama-mode [style*="background: #ffffff"],
        body.futurama-mode [style*="rgb(255, 255, 255)"],
        body.futurama-mode [style*="rgba(255, 255, 255"],
        body.futurama-mode [style*="background: #f"],
        body.futurama-mode [style*="background-color: #f"] {
            background: #0d1117 !important;
            background-color: #0d1117 !important;
            background-image: none !important;
        }

        /* Скрываем служебные заголовки портлетов */
        body.futurama-mode .portlet-title,
        body.futurama-mode .portlet-topper,
        body.futurama-mode .portlet-header,
        body.futurama-mode [class*="portlet-title"],
        body.futurama-mode [class*="portlet-topper"],
        body.futurama-mode [class*="portlet-header"],
        body.futurama-mode .portlet-content-editable {
            display: none !important;
        }

        body.futurama-mode .portlet-boundary,
        body.futurama-mode .portlet,
        body.futurama-mode .portlet-content,
        body.futurama-mode .portlet-body {
            padding-top: 0 !important;
            margin-top: 0 !important;
            background: transparent !important;
        }

        /* ===== 3. ЗАГОЛОВКИ ===== */
        body.futurama-mode h1,
        body.futurama-mode h2,
        body.futurama-mode h3,
        body.futurama-mode h4,
        body.futurama-mode h1[style],
        body.futurama-mode h1[id] {
            color: #ff6a00 !important;
            font-family: 'Segoe UI', 'Roboto', sans-serif !important;
            font-size: 30px !important;
            font-weight: 800 !important;
            letter-spacing: 3px !important;
            text-transform: uppercase !important;
            text-align: center !important;
            text-shadow: 0 0 10px rgba(255,106,0,0.7), 0 2px 0 #3a4a5c !important;
            border: none !important;
            padding: 15px 0 !important;
            margin: 30px auto !important;
            background: transparent !important;
            line-height: 1.3 !important;
        }

        body.futurama-mode .section-wide h1,
        body.futurama-mode .section h1 {
            margin: 0 auto 20px !important;
            padding: 10px 0 !important;
        }

        /* ===== 4. ШАПКА ===== */
        body.futurama-mode .header h1,
        body.futurama-mode .header h2,
        body.futurama-mode .header h3,
        body.futurama-mode .header p,
        body.futurama-mode .header span:not([class*="icon"]):not([class*="social"]),
        body.futurama-mode .header a,
        body.futurama-mode .header [class*="title"],
        body.futurama-mode .header [class*="name"]:not([class*="user"]),
        body.futurama-mode .header [style*="color"] {
            color: #ff6a00 !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.7), 0 0 12px rgba(255,106,0,0.4) !important;
            font-family: 'Segoe UI', 'Roboto', sans-serif !important;
            letter-spacing: 1px !important;
            font-size: inherit !important;
            text-align: left !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            line-height: inherit !important;
        }

        body.futurama-mode .top-header a,
        body.futurama-mode .header a {
            color: inherit !important;
            font-family: inherit !important;
        }

        /* ===== 5. КАРТОЧКИ НОВОСТЕЙ — «летящие» панели ===== */
        body.futurama-mode .news_box,
        body.futurama-mode .news_box_holder,
        body.futurama-mode .news-item,
        body.futurama-mode .news_item,
        body.futurama-mode .news-card,
        body.futurama-mode .news_list,
        body.futurama-mode .teaser,
        body.futurama-mode .event-item,
        body.futurama-mode .event_item,
        body.futurama-mode [class*="news"],
        body.futurama-mode [class*="event"],
        body.futurama-mode [class*="asset"],
        body.futurama-mode [class*="journal"] {
            background: linear-gradient(145deg, #243447 0%, #1b2733 100%) !important;
            background-color: #1b2733 !important;
            background-image: linear-gradient(145deg, #243447 0%, #1b2733 100%) !important;
            border: 1px solid #3a4a5c !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5),
                        inset 0 1px 0 rgba(255,255,255,0.05),
                        0 0 0 1px rgba(255,106,0,0.15) !important;
            transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        }

        body.futurama-mode .news_box:hover,
        body.futurama-mode .news_item:hover,
        body.futurama-mode [class*="news"]:hover,
        body.futurama-mode [class*="event"]:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 14px 30px rgba(0,0,0,0.6),
                        0 0 25px rgba(255,106,0,0.35),
                        inset 0 1px 0 rgba(255,255,255,0.08) !important;
        }

        body.futurama-mode .news_box *,
        body.futurama-mode .news_item *,
        body.futurama-mode [class*="news"] *,
        body.futurama-mode [class*="event"] *,
        body.futurama-mode [class*="asset"] *,
        body.futurama-mode [class*="journal"] * {
            color: #e6edf3 !important;
            background-color: transparent !important;
            text-shadow: none !important;
        }

        body.futurama-mode .news_box h1,
        body.futurama-mode .news_box h2,
        body.futurama-mode .news_box h3,
        body.futurama-mode .news_item h3,
        body.futurama-mode [class*="news"] h3 {
            color: #ff6a00 !important;
            text-shadow: 0 0 8px rgba(255,106,0,0.5) !important;
        }

        /* ===== 6. ПРОЕКТЫ ===== */
        body.futurama-mode [class*="strateg"],
        body.futurama-mode [class*="project"] {
            background: #0d1117 !important;
            color: #e6edf3 !important;
        }
        body.futurama-mode [class*="strateg"] *,
        body.futurama-mode [class*="project"] * {
            color: #e6edf3 !important;
            background-color: transparent !important;
        }

        /* ===== 7. СЛАЙДЕРЫ ===== */
        body.futurama-mode #main_slider,
        body.futurama-mode .slider_box,
        body.futurama-mode .slick-list,
        body.futurama-mode .slick-track,
        body.futurama-mode .slick-slide,
        body.futurama-mode .slick-slide .pic,
        body.futurama-mode .slick-slide .desc,
        body.futurama-mode .slick-slide .text_holder {
            background: transparent !important;
            background-image: none !important;
        }
        body.futurama-mode .slick-slide p { color: #e6edf3 !important; }

        body.futurama-mode .slick-prev,
        body.futurama-mode .slick-next {
            background: transparent !important;
            background-image: none !important;
            border: none !important;
            box-shadow: none !important;
            color: transparent !important;
            font-size: 0 !important;
            text-indent: -9999px !important;
            overflow: hidden !important;
            width: 44px !important;
            height: 44px !important;
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 100 !important;
            cursor: pointer !important;
        }
        body.futurama-mode .slick-prev { left: 10px !important; }
        body.futurama-mode .slick-next { right: 10px !important; }
        body.futurama-mode .slick-prev *,
        body.futurama-mode .slick-next *,
        body.futurama-mode .slick-prev::after,
        body.futurama-mode .slick-next::after,
        body.futurama-mode .slick-prev span,
        body.futurama-mode .slick-next span,
        body.futurama-mode .slick-slider .slick-arrow svg,
        body.futurama-mode .slick-slider .slick-arrow i,
        body.futurama-mode .slick-slider .slick-arrow img { display: none !important; }
        body.futurama-mode .slick-prev::before,
        body.futurama-mode .slick-next::before {
            content: '' !important;
            display: block !important;
            width: 44px !important;
            height: 44px !important;
            font-size: 36px !important;
            line-height: 44px !important;
            text-align: center !important;
            color: #ff6a00 !important;
            text-shadow: 0 0 12px rgba(255,106,0,0.9) !important;
            text-indent: 0 !important;
            font-family: Arial, sans-serif !important;
            background: rgba(27,39,51,0.7) !important;
            border-radius: 50% !important;
            border: 1px solid rgba(255,106,0,0.5) !important;
            position: static !important;
        }
        body.futurama-mode .slick-prev::before { content: '‹' !important; }
        body.futurama-mode .slick-next::before { content: '›' !important; }
        body.futurama-mode .slick-prev:hover::before,
        body.futurama-mode .slick-next:hover::before {
            color: #0d1117 !important;
            background: #ff6a00 !important;
            box-shadow: 0 0 20px rgba(255,106,0,0.9) !important;
        }

        body.futurama-mode .slick-dots li button {
            background: rgba(255,106,0,0.3) !important;
            border: 1px solid #ff6a00 !important;
            border-radius: 50% !important;
        }
        body.futurama-mode .slick-dots li.slick-active button {
            background: #ff6a00 !important;
            box-shadow: 0 0 10px #ff6a00 !important;
        }

        body.futurama-mode .kai-btn,
        body.futurama-mode .slick-slide a {
            color: #ff6a00 !important;
            background: rgba(13,17,23,0.85) !important;
            border: 1px solid #ff6a00 !important;
            border-radius: 6px !important;
            padding: 8px 20px !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.6) !important;
        }
        body.futurama-mode .kai-btn:hover,
        body.futurama-mode .slick-slide a:hover {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            text-shadow: none !important;
            box-shadow: 0 0 20px rgba(255,106,0,0.8) !important;
        }

        /* ===== 7.1 СТРЕЛКИ «УЧЕБНЫХ ПОДРАЗДЕЛЕНИЙ» ===== */
        body.futurama-mode .institutes_slider_box,
        body.futurama-mode .institutes_box {
            position: relative !important;
            overflow: visible !important;
        }
        body.futurama-mode .inst-slide,
        body.futurama-mode .inst-slide.prev,
        body.futurama-mode .inst-slide.next {
            position: absolute !important;
            top: 50% !important;
            bottom: auto !important;
            transform: translateY(-50%) !important;
            width: 50px !important;
            height: 50px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: rgba(27,39,51,0.7) !important;
            border: 1px solid rgba(255,106,0,0.5) !important;
            border-radius: 50% !important;
            box-shadow: 0 0 12px rgba(255,106,0,0.4) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            z-index: 100 !important;
        }
        body.futurama-mode .inst-slide.prev { left: 10px !important; right: auto !important; }
        body.futurama-mode .inst-slide.next { right: 10px !important; left: auto !important; }
        body.futurama-mode .inst-slide *,
        body.futurama-mode .inst-slide span,
        body.futurama-mode .inst-slide svg,
        body.futurama-mode .inst-slide i,
        body.futurama-mode .inst-slide img,
        body.futurama-mode .inst-slide::after {
            display: none !important;
            visibility: hidden !important;
        }
        body.futurama-mode .inst-slide::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: Arial, sans-serif !important;
            font-size: 40px !important;
            font-weight: bold !important;
            line-height: 1 !important;
            color: #ff6a00 !important;
            text-shadow: 0 0 12px rgba(255,106,0,0.9) !important;
            background: transparent !important;
            pointer-events: none !important;
        }
        body.futurama-mode .inst-slide.prev::before { content: '‹' !important; }
        body.futurama-mode .inst-slide.next::before { content: '›' !important; }
        body.futurama-mode .inst-slide:hover {
            background: #ff6a00 !important;
            box-shadow: 0 0 25px rgba(255,106,0,0.9) !important;
        }
        body.futurama-mode .inst-slide:hover::before {
            color: #0d1117 !important;
            text-shadow: none !important;
        }
        body.futurama-mode #inst-prev-btn,
        body.futurama-mode #inst-next-btn,
        body.futurama-mode [id*="inst-prev"],
        body.futurama-mode [id*="inst-next"] {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        /* ===== 8. МОДАЛКА ВХОДА ===== */
        body.futurama-mode .popup_box,
        body.futurama-mode .login_popup,
        body.futurama-mode #login_popup,
        body.futurama-mode .modal-content,
        body.futurama-mode .popup-content,
        body.futurama-mode .dialog,
        body.futurama-mode .modal,
        body.futurama-mode .popup,
        body.futurama-mode [class*="login-form"],
        body.futurama-mode [class*="sign-in"],
        body.futurama-mode [class*="cabinet"],
        body.futurama-mode [class*="modal-body"] {
            background: linear-gradient(145deg, #243447 0%, #1b2733 100%) !important;
            color: #e6edf3 !important;
            border: 1px solid #ff6a00 !important;
            border-radius: 10px !important;
            box-shadow: 0 0 30px rgba(255,106,0,0.5),
                        0 15px 50px rgba(0,0,0,0.8),
                        inset 0 1px 0 rgba(255,255,255,0.08) !important;
        }
        body.futurama-mode #login_popup *,
        body.futurama-mode .login_popup *,
        body.futurama-mode .popup_box *,
        body.futurama-mode .modal-content *,
        body.futurama-mode .popup-content *,
        body.futurama-mode [class*="login-form"] *,
        body.futurama-mode [class*="sign-in"] *,
        body.futurama-mode [class*="cabinet"] *,
        body.futurama-mode [class*="modal-body"] * {
            background: transparent !important;
            color: #e6edf3 !important;
        }
        body.futurama-mode #login_popup .title,
        body.futurama-mode .login_popup .title,
        body.futurama-mode .modal-content h1,
        body.futurama-mode .modal-content h2,
        body.futurama-mode .modal-content .title,
        body.futurama-mode .modal-content .header,
        body.futurama-mode [class*="login-form"] h1,
        body.futurama-mode [class*="login-form"] h2,
        body.futurama-mode [class*="cabinet"] h1,
        body.futurama-mode [class*="cabinet"] h2 {
            color: #ff6a00 !important;
            text-shadow: 0 0 12px rgba(255,106,0,0.8) !important;
            text-transform: uppercase !important;
            letter-spacing: 3px !important;
            border-bottom: 1px solid rgba(255,106,0,0.4) !important;
            padding-bottom: 10px !important;
            font-weight: bold !important;
        }
        body.futurama-mode #login_popup .control-label,
        body.futurama-mode .modal-content label,
        body.futurama-mode .popup-content label,
        body.futurama-mode [class*="login-form"] label,
        body.futurama-mode [class*="cabinet"] label {
            color: #ffa040 !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.6) !important;
            background: transparent !important;
            font-weight: bold !important;
            letter-spacing: 1px !important;
        }
        body.futurama-mode #login_popup .field,
        body.futurama-mode #login_popup input,
        body.futurama-mode .modal-content input,
        body.futurama-mode .popup-content input,
        body.futurama-mode .dialog input,
        body.futurama-mode [class*="login-form"] input,
        body.futurama-mode [class*="cabinet"] input,
        body.futurama-mode [class*="modal-body"] input {
            background: #0d1117 !important;
            color: #e6edf3 !important;
            border: 1px solid #3a4a5c !important;
            border-radius: 6px !important;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.6) !important;
            padding: 10px 12px !important;
        }
        body.futurama-mode #login_popup input:focus,
        body.futurama-mode .modal-content input:focus,
        body.futurama-mode [class*="login-form"] input:focus {
            outline: none !important;
            border-color: #ff6a00 !important;
            box-shadow: inset 0 0 15px rgba(0,0,0,0.6), 0 0 15px rgba(255,106,0,0.7) !important;
        }
        body.futurama-mode #login_popup button,
        body.futurama-mode #login_popup .submit_btn,
        body.futurama-mode #login_popup .btn,
        body.futurama-mode .login_popup button,
        body.futurama-mode .modal-content button,
        body.futurama-mode .popup-content button,
        body.futurama-mode .dialog button,
        body.futurama-mode [class*="login-form"] button,
        body.futurama-mode [class*="cabinet"] button {
            background: linear-gradient(145deg, #243447, #1b2733) !important;
            color: #ff6a00 !important;
            border: 2px solid #ff6a00 !important;
            border-radius: 6px !important;
            text-transform: uppercase !important;
            letter-spacing: 3px !important;
            font-weight: bold !important;
            text-shadow: 0 0 8px rgba(255,106,0,0.8) !important;
            box-shadow: 0 0 15px rgba(255,106,0,0.5), inset 0 0 15px rgba(255,106,0,0.1) !important;
            padding: 12px 30px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        body.futurama-mode #login_popup button:hover,
        body.futurama-mode .modal-content button:hover,
        body.futurama-mode [class*="login-form"] button:hover {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            text-shadow: none !important;
            box-shadow: 0 0 25px #ff6a00, 0 0 50px rgba(255,106,0,0.6) !important;
            transform: translateY(-2px) !important;
        }
        body.futurama-mode #login_popup .close,
        body.futurama-mode .login_popup .close,
        body.futurama-mode .modal-content [class*="close"],
        body.futurama-mode .popup-content [class*="close"],
        body.futurama-mode [class*="login-form"] [class*="close"] {
            background: rgba(36,52,71,0.9) !important;
            color: #ff6a00 !important;
            border: 2px solid #ff6a00 !important;
            border-radius: 50% !important;
            width: 32px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 18px !important;
            font-weight: bold !important;
            box-shadow: 0 0 15px rgba(255,106,0,0.7) !important;
            text-decoration: none !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        body.futurama-mode #login_popup .close:hover,
        body.futurama-mode .modal-content [class*="close"]:hover {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            transform: scale(1.15) rotate(90deg) !important;
        }
        body.futurama-mode [class*="overlay"]:not([class*="login-form"]):not([class*="cabinet"]),
        body.futurama-mode [class*="backdrop"],
        body.futurama-mode .modal-backdrop {
            background: rgba(5,8,11,0.7) !important;
        }

        /* ============================================================
           9. ВЕРХНЕЕ МЕНЮ
           ============================================================ */
        body.futurama-mode ul.menu-list,
        body.futurama-mode .menu-list,
        body.futurama-mode [role="menubar"],
        body.futurama-mode ul[role="menubar"],
        body.futurama-mode .lfr-nav,
        body.futurama-mode [class*="lfr-nav"],
        body.futurama-mode nav.navbar,
        body.futurama-mode .navbar,
        body.futurama-mode .navigation-menu,
        body.futurama-mode .navigation-menu-top,
        body.futurama-mode header ul.nav,
        body.futurama-mode .navbar-inner {
            background: linear-gradient(180deg, #243447 0%, #1b2733 100%) !important;
            background-color: #1b2733 !important;
            border: none !important;
            border-bottom: 2px solid #ff6a00 !important;
            box-shadow: 0 2px 20px rgba(255,106,0,0.25) !important;
            padding: 0 !important;
            margin: 0 !important;
            list-style: none !important;
            height: auto !important;
            min-height: 0 !important;
            line-height: 1 !important;
        }

        body.futurama-mode li.lfr-nav-item,
        body.futurama-mode .lfr-nav-item {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            position: relative !important;
            min-height: 0 !important;
            height: auto !important;
            line-height: 1 !important;
        }
        body.futurama-mode li.lfr-nav-item + li.lfr-nav-item,
        body.futurama-mode li.lfr-nav-item[style] {
            border: none !important;
            border-left: none !important;
            border-right: none !important;
        }
        body.futurama-mode li.lfr-nav-item:first-child[style] {
            border-left: none !important;
        }

        body.futurama-mode li.lfr-nav-item > a,
        body.futurama-mode .lfr-nav-item > a {
            color: #e6edf3 !important;
            background: transparent !important;
            text-shadow: 0 0 4px rgba(230,237,243,0.3) !important;
            padding: 8px 18px !important;
            display: block !important;
            text-transform: uppercase !important;
            font-family: 'Segoe UI', 'Roboto', sans-serif !important;
            font-size: 12px !important;
            letter-spacing: 1.5px !important;
            font-weight: 700 !important;
            line-height: 1.2 !important;
            min-height: 0 !important;
            height: auto !important;
            text-align: center !important;
            transition: all 0.25s ease !important;
            text-decoration: none !important;
            box-sizing: border-box !important;
        }

        body.futurama-mode li.lfr-nav-item > a:hover,
        body.futurama-mode .lfr-nav-item > a:hover {
            color: #ff6a00 !important;
            background: rgba(255,106,0,0.1) !important;
            text-shadow: 0 0 10px rgba(255,106,0,0.9) !important;
            box-shadow: inset 0 -3px 0 #ff6a00 !important;
        }

        body.futurama-mode li.lfr-nav-item > a span {
            color: inherit !important;
            background: transparent !important;
            text-align: center !important;
            display: inline-block !important;
        }

        body.futurama-mode nav.navbar::before,
        body.futurama-mode nav.navbar::after,
        body.futurama-mode .navbar::before,
        body.futurama-mode .navbar::after,
        body.futurama-mode ul.lfr-nav::before,
        body.futurama-mode ul.lfr-nav::after,
        body.futurama-mode ul.menu-list::before,
        body.futurama-mode ul.menu-list::after,
        body.futurama-mode [role="menubar"]::before,
        body.futurama-mode [role="menubar"]::after,
        body.futurama-mode [class*="lfr-nav"]::before,
        body.futurama-mode [class*="lfr-nav"]::after,
        body.futurama-mode li.lfr-nav-item::before,
        body.futurama-mode li.lfr-nav-item::after,
        body.futurama-mode .lfr-nav-item::before,
        body.futurama-mode .lfr-nav-item::after,
        body.futurama-mode li.lfr-nav-item > a::before,
        body.futurama-mode li.lfr-nav-item > a::after,
        body.futurama-mode li.lfr-nav-item > a > span::before,
        body.futurama-mode li.lfr-nav-item > a > span::after,
        body.futurama-mode li.lfr-nav-item + li.lfr-nav-item::before {
            display: none !important;
            content: none !important;
        }

        body.futurama-mode .nav-wrapper,
        body.futurama-mode .navigation-wrapper,
        body.futurama-mode .menu-wrapper,
        body.futurama-mode [class*="nav-wrap"],
        body.futurama-mode [class*="navigation-wrap"] {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* ============================================================
           9.1 ФИКС: УБИРАЕМ СЕРУЮ ПОЛОСКУ ПОД ВЕРХНИМ МЕНЮ
           ============================================================ */
        body.futurama-mode #menu,
        body.futurama-mode .menu,
        body.futurama-mode #menu > .section,
        body.futurama-mode .menu > .section,
        body.futurama-mode .menu .section,
        body.futurama-mode ul.menu-list {
            border: none !important;
            border-bottom: none !important;
            border-top: none !important;
            box-shadow: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
            background-color: transparent !important;
        }

        body.futurama-mode #menu::before,
        body.futurama-mode #menu::after,
        body.futurama-mode .menu::before,
        body.futurama-mode .menu::after,
        body.futurama-mode #menu > .section::before,
        body.futurama-mode #menu > .section::after,
        body.futurama-mode .menu .section::before,
        body.futurama-mode .menu .section::after,
        body.futurama-mode ul.menu-list::before,
        body.futurama-mode ul.menu-list::after,
        body.futurama-mode ul.menu-list > li::before,
        body.futurama-mode ul.menu-list > li::after {
            display: none !important;
            content: none !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            height: 0 !important;
            width: 0 !important;
        }

        body.futurama-mode .lfr-nav,
        body.futurama-mode [class*="lfr-nav"],
        body.futurama-mode nav.navbar,
        body.futurama-mode .navbar {
            border-bottom: none !important;
            border-top: none !important;
            box-shadow: none !important;
        }

        body.futurama-mode .nav-wrapper,
        body.futurama-mode .navigation-wrapper,
        body.futurama-mode .menu-wrapper,
        body.futurama-mode [class*="nav-wrap"],
        body.futurama-mode [class*="navigation-wrap"] {
            border-bottom: none !important;
            box-shadow: none !important;
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
        }

        /* ===== 10. ВЫПАДАЮЩЕЕ МЕНЮ ===== */
        body.futurama-mode li.lfr-nav-item { position: relative !important; }
        body.futurama-mode .sub,
        body.futurama-mode .lfr-nav-item .sub,
        body.futurama-mode .lfr-nav-item > .sub,
        body.futurama-mode .submenu,
        body.futurama-mode .sub-menu,
        body.futurama-mode .dropdown-menu,
        body.futurama-mode .layouts,
        body.futurama-mode ul.layouts,
        body.futurama-mode nav ul ul {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
            border-top: none !important;
            inset: auto auto auto 0 !important;
            background: linear-gradient(180deg, #243447 0%, #1b2733 100%) !important;
            background-color: #1b2733 !important;
            color: #e6edf3 !important;
            border: 1px solid #ff6a00 !important;
            border-radius: 0 0 8px 8px !important;
            box-shadow: 0 0 25px rgba(255,106,0,0.4),
                        0 10px 40px rgba(0,0,0,0.8) !important;
            z-index: 200 !important;
            max-width: calc(100vw - 40px) !important;
            box-sizing: border-box !important;
        }
        body.futurama-mode .sub .page_holder,
        body.futurama-mode .sub > * {
            background: transparent !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
        }
        body.futurama-mode .child-menu,
        body.futurama-mode ul.child-menu {
            background: transparent !important;
            list-style: none !important;
            padding: 10px 0 !important;
            margin: 0 !important;
        }
        body.futurama-mode .child-menu li,
        body.futurama-mode ul.child-menu li.lfr-nav-item,
        body.futurama-mode .layouts li,
        body.futurama-mode ul.layouts li {
            background: transparent !important;
            border: none !important;
            border-left: none !important;
            padding: 0 !important;
            margin: 0 !important;
            list-style: none !important;
        }
        body.futurama-mode .child-menu li[style],
        body.futurama-mode ul.child-menu li[style] {
            border-left: none !important;
        }
        body.futurama-mode .layouts > li + li,
        body.futurama-mode .child-menu li + li,
        body.futurama-mode .main_menu ul ul > li + li,
        body.futurama-mode nav ul ul li + li {
            border-top: 1px solid rgba(255,106,0,0.2) !important;
        }
        body.futurama-mode .child-menu a,
        body.futurama-mode ul.child-menu a,
        body.futurama-mode .submenu a,
        body.futurama-mode .sub-menu a,
        body.futurama-mode .dropdown-menu a,
        body.futurama-mode .layouts a,
        body.futurama-mode ul.layouts a,
        body.futurama-mode nav ul ul a,
        body.futurama-mode .main_menu ul ul a {
            color: #e6edf3 !important;
            background: transparent !important;
            text-shadow: 0 0 4px rgba(230,237,243,0.3) !important;
            padding: 10px 25px !important;
            display: block !important;
            transition: all 0.25s ease !important;
            border-left: 3px solid transparent !important;
            font-family: 'Segoe UI', 'Roboto', sans-serif !important;
            font-size: 14px !important;
            text-decoration: none !important;
            text-transform: none !important;
            letter-spacing: 0.5px !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            max-width: 300px !important;
            text-align: left !important;
        }
        body.futurama-mode .child-menu a:hover,
        body.futurama-mode ul.child-menu a:hover,
        body.futurama-mode .submenu a:hover,
        body.futurama-mode .sub-menu a:hover,
        body.futurama-mode .layouts a:hover,
        body.futurama-mode nav ul ul a:hover,
        body.futurama-mode .main_menu ul ul a:hover {
            background: linear-gradient(90deg, rgba(255,106,0,0.2), transparent) !important;
            color: #ff6a00 !important;
            text-shadow: 0 0 12px rgba(255,106,0,0.9) !important;
            border-left-color: #ff6a00 !important;
            padding-left: 35px !important;
        }
        body.futurama-mode .layouts li.selected > a,
        body.futurama-mode .layouts a.selected,
        body.futurama-mode .layouts li.open > a,
        body.futurama-mode .layouts a.open,
        body.futurama-mode .main_menu ul ul li.active > a {
            background: linear-gradient(90deg, rgba(255,106,0,0.2), transparent) !important;
            color: #ff6a00 !important;
            text-shadow: 0 0 10px rgba(255,106,0,0.9) !important;
            border-left-color: #ff6a00 !important;
            font-weight: bold !important;
        }
        body.futurama-mode .layouts img,
        body.futurama-mode .child-menu img,
        body.futurama-mode .submenu img {
            filter: none !important;
            opacity: 0.9 !important;
            max-width: 20px !important;
            max-height: 20px !important;
            vertical-align: middle !important;
            margin-right: 8px !important;
        }

        /* ===== 11. БОКОВОЕ МЕНЮ ===== */
        body.futurama-mode .side-menu,
        body.futurama-mode .side_menu,
        body.futurama-mode .sidebar,
        body.futurama-mode .left-menu,
        body.futurama-mode .left_menu,
        body.futurama-mode .left-sidebar,
        body.futurama-mode .aside,
        body.futurama-mode .page-sidebar,
        body.futurama-mode [class*="sidebar"],
        body.futurama-mode [class*="side-menu"],
        body.futurama-mode [class*="side_menu"],
        body.futurama-mode [class*="left-menu"],
        body.futurama-mode [class*="left_menu"] {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            transform: none !important;
            z-index: 1 !important;
            width: auto !important;
            max-width: 100% !important;
            float: none !important;
        }
        body.futurama-mode [id^="column-"],
        body.futurama-mode [class*="portlet-column"],
        body.futurama-mode [class*="portlet-column-content"] {
            position: relative !important;
            left: auto !important;
            right: auto !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            transform: none !important;
            z-index: 1 !important;
        }

        body.futurama-mode .portlet-boundary_73_,
        body.futurama-mode #p_p_id_73_,
        body.futurama-mode .portlet-breadcrumb,
        body.futurama-mode .portlet-boundary.portlet-breadcrumb,
        body.futurama-mode #portlet_73,
        body.futurama-mode section.portlet.kai-article,
        body.futurama-mode .portlet-breadcrumb .portlet-topper,
        body.futurama-mode .portlet-breadcrumb .portlet-content,
        body.futurama-mode .portlet-breadcrumb .portlet-content-container,
        body.futurama-mode .portlet-breadcrumb .portlet-body,
        body.futurama-mode ul.breadcrumb,
        body.futurama-mode .breadcrumb.breadcrumb-horizontal {
            position: static !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            z-index: auto !important;
            transform: none !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            height: auto !important;
            max-height: none !important;
        }
        body.futurama-mode .portlet-breadcrumb .portlet-title,
        body.futurama-mode .portlet-breadcrumb .portlet-title-text,
        body.futurama-mode .portlet-breadcrumb .portlet-topper-toolbar,
        body.futurama-mode .portlet-breadcrumb .portlet-topper > h1,
        body.futurama-mode .portlet-breadcrumb header.portlet-topper {
            display: none !important;
            height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
        }

        body.futurama-mode .breadcrumb,
        body.futurama-mode .breadcrumb-horizontal,
        body.futurama-mode ul.breadcrumb,
        body.futurama-mode [aria-label="Навигационная полоска"],
        body.futurama-mode .portlet-breadcrumb,
        body.futurama-mode .breadcrumb-container,
        body.futurama-mode .breadcrumbs-container,
        body.futurama-mode .breadcrumbs-wrapper {
            background: linear-gradient(180deg, #243447 0%, #1b2733 100%) !important;
            color: #e6edf3 !important;
            padding: 12px 20px !important;
            margin: 0 !important;
            border: none !important;
            border-bottom: 1px solid rgba(255,106,0,0.4) !important;
            border-top: 1px solid rgba(255,106,0,0.2) !important;
            box-shadow: inset 0 0 20px rgba(255,106,0,0.05) !important;
            list-style: none !important;
        }
        body.futurama-mode .breadcrumb li {
            background: transparent !important;
            color: #e6edf3 !important;
            padding: 0 8px !important;
            border-left: none !important;
        }
        body.futurama-mode .breadcrumb a {
            color: #ff6a00 !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.7) !important;
            text-decoration: none !important;
        }
        body.futurama-mode .breadcrumb a:hover {
            color: #ffa040 !important;
            text-shadow: 0 0 10px rgba(255,160,64,0.9) !important;
        }
        body.futurama-mode .breadcrumb .divider {
            color: #ff6a00 !important;
            text-shadow: 0 0 8px rgba(255,106,0,0.8) !important;
            margin: 0 8px !important;
            font-weight: bold !important;
        }

        body.futurama-mode .accordion-toggle,
        body.futurama-mode [class*="accordion-toggle"],
        body.futurama-mode [class*="accordion_toggle"] {
            background: linear-gradient(145deg, #243447 0%, #1b2733 100%) !important;
            color: #ff6a00 !important;
            border: 1px solid rgba(255,106,0,0.4) !important;
            border-radius: 6px !important;
            padding: 12px 20px !important;
            margin: 4px 0 !important;
            cursor: pointer !important;
            box-shadow: inset 0 0 20px rgba(255,106,0,0.05) !important;
            transition: all 0.3s ease !important;
        }
        body.futurama-mode .accordion-toggle:hover {
            background: linear-gradient(145deg, #2a3f55 0%, #243447 100%) !important;
            border-color: #ff6a00 !important;
            box-shadow: 0 0 15px rgba(255,106,0,0.5) !important;
        }
        body.futurama-mode .accordion-toggle.open,
        body.futurama-mode .accordion-toggle.active,
        body.futurama-mode .accordion-toggle[aria-expanded="true"] {
            background: linear-gradient(145deg, #2a3f55 0%, #243447 100%) !important;
            color: #ffa040 !important;
            border-color: #ff6a00 !important;
            box-shadow: 0 0 20px rgba(255,106,0,0.6) !important;
        }
        body.futurama-mode .accordion-toggle .title-text,
        body.futurama-mode .accordion-toggle span {
            color: #ff6a00 !important;
            background: transparent !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.7) !important;
            font-weight: bold !important;
            letter-spacing: 1px !important;
        }
        body.futurama-mode .accordion-toggle.open .title-text {
            color: #ffa040 !important;
            text-shadow: 0 0 10px #ff6a00 !important;
        }
        body.futurama-mode .accordion,
        body.futurama-mode [class*="accordion"]:not(.accordion-toggle) {
            background: transparent !important;
            border: none !important;
        }
        body.futurama-mode .accordion-content,
        body.futurama-mode .accordion-body {
            background: linear-gradient(145deg, #1b2733 0%, #0d1117 100%) !important;
            color: #e6edf3 !important;
            border: 1px solid rgba(255,106,0,0.3) !important;
            border-top: none !important;
            border-radius: 0 0 6px 6px !important;
            padding: 15px 20px !important;
        }
        body.futurama-mode .accordion-content a,
        body.futurama-mode .accordion-body a {
            color: #ff6a00 !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.6) !important;
            padding: 8px 15px !important;
            display: block !important;
            transition: all 0.2s ease !important;
            border-left: 2px solid transparent !important;
        }
        body.futurama-mode .accordion-content a:hover,
        body.futurama-mode .accordion-body a:hover {
            background: rgba(255,106,0,0.15) !important;
            color: #ffa040 !important;
            text-shadow: 0 0 10px #ff6a00 !important;
            border-left-color: #ff6a00 !important;
            padding-left: 20px !important;
        }
        body.futurama-mode [class*="accordion"] *,
        body.futurama-mode [class*="accordion-toggle"] * {
            background-color: transparent !important;
        }

        /* ===== 15. ПОДВАЛ ===== */
        body.futurama-mode footer,
        body.futurama-mode .footer,
        body.futurama-mode .bottom,
        body.futurama-mode .footer-wrapper,
        body.futurama-mode .footer_wrapper,
        body.futurama-mode .bottom-footer,
        body.futurama-mode .footer-bottom,
        body.futurama-mode #footer,
        body.futurama-mode [class*="footer"]:not(a):not(img) {
            background: linear-gradient(180deg, #1b2733 0%, #0d1117 100%) !important;
            color: #e6edf3 !important;
            border-top: 2px solid #ff6a00 !important;
            box-shadow: inset 0 0 40px rgba(255,106,0,0.05) !important;
        }
        body.futurama-mode footer *,
        body.futurama-mode .footer *,
        body.futurama-mode .bottom *,
        body.futurama-mode .footer-wrapper *,
        body.futurama-mode .footer_wrapper *,
        body.futurama-mode #footer *,
        body.futurama-mode [class*="footer"] *,
        body.futurama-mode [class*="footer"] [class*="block"],
        body.futurama-mode [class*="footer"] [class*="section"],
        body.futurama-mode [class*="footer"] [class*="column"] {
            background: transparent !important;
            background-image: none !important;
        }
        body.futurama-mode footer p,
        body.futurama-mode footer span,
        body.futurama-mode footer div,
        body.futurama-mode .footer p,
        body.futurama-mode .footer span,
        body.futurama-mode .footer div,
        body.futurama-mode .bottom p,
        body.futurama-mode .bottom span {
            color: #e6edf3 !important;
            text-shadow: 0 0 3px rgba(230,237,243,0.3) !important;
        }
        body.futurama-mode footer a,
        body.futurama-mode .footer a,
        body.futurama-mode .bottom a,
        body.futurama-mode .footer-wrapper a,
        body.futurama-mode footer li a,
        body.futurama-mode .footer li a {
            color: #ff6a00 !important;
            text-shadow: 0 0 6px rgba(255,106,0,0.7) !important;
            transition: all 0.2s ease !important;
        }
        body.futurama-mode footer a:hover,
        body.futurama-mode .footer a:hover,
        body.futurama-mode .bottom a:hover,
        body.futurama-mode footer li a:hover,
        body.futurama-mode .footer li a:hover {
            color: #ffa040 !important;
            text-shadow: 0 0 10px #ff6a00 !important;
        }
        body.futurama-mode footer img,
        body.futurama-mode .footer img,
        body.futurama-mode .bottom img {
            filter: none !important;
            opacity: 0.95 !important;
            background: transparent !important;
        }
        body.futurama-mode footer [class*="logo"],
        body.futurama-mode .footer [class*="logo"],
        body.futurama-mode footer [class*="logo"] img {
            filter: none !important;
            opacity: 1 !important;
        }
        body.futurama-mode footer input,
        body.futurama-mode .footer input,
        body.futurama-mode .bottom input,
        body.futurama-mode footer .search-input,
        body.futurama-mode [class*="search"] input {
            background: #0d1117 !important;
            color: #e6edf3 !important;
            border: 1px solid rgba(255,106,0,0.5) !important;
            border-radius: 6px !important;
            box-shadow: inset 0 0 8px rgba(0,0,0,0.6) !important;
        }
        body.futurama-mode footer button,
        body.futurama-mode .footer button,
        body.futurama-mode footer [class*="search-btn"],
        body.futurama-mode footer [class*="search_btn"] {
            background: #243447 !important;
            color: #ff6a00 !important;
            border: 1px solid #ff6a00 !important;
            border-radius: 6px !important;
            box-shadow: 0 0 8px rgba(255,106,0,0.4) !important;
        }
        body.futurama-mode footer [class*="address"],
        body.futurama-mode footer [class*="contact"],
        body.futurama-mode footer [class*="info"] {
            color: #e6edf3 !important;
        }
        body.futurama-mode footer ul,
        body.futurama-mode footer li,
        body.futurama-mode .footer ul,
        body.futurama-mode .footer li {
            background: transparent !important;
            list-style: none !important;
            color: #ff6a00 !important;
        }
        body.futurama-mode footer li a,
        body.futurama-mode .footer li a {
            padding: 4px 0 !important;
            display: block !important;
        }
        body.futurama-mode footer li a:hover,
        body.futurama-mode .footer li a:hover {
            padding-left: 5px !important;
        }

        /* ===== 16. КНОПКА «СОХРАНИТЬ» ===== */
        body.futurama-mode button[type="submit"],
        body.futurama-mode input[type="submit"],
        body.futurama-mode .btn-save,
        body.futurama-mode .btn_save,
        body.futurama-mode [class*="btn-save"],
        body.futurama-mode [class*="save-btn"],
        body.futurama-mode button[value*="Save"],
        body.futurama-mode button[value*="Сохранить"] {
            background: linear-gradient(145deg, #243447, #1b2733) !important;
            color: #ff6a00 !important;
            border: 2px solid #ff6a00 !important;
            border-radius: 6px !important;
            text-transform: uppercase !important;
            letter-spacing: 3px !important;
            font-weight: bold !important;
            text-shadow: 0 0 8px rgba(255,106,0,0.8) !important;
            box-shadow: 0 0 15px rgba(255,106,0,0.5), inset 0 0 15px rgba(255,106,0,0.1) !important;
            padding: 12px 30px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        body.futurama-mode button[type="submit"]:hover,
        body.futurama-mode input[type="submit"]:hover,
        body.futurama-mode .btn-save:hover,
        body.futurama-mode [class*="btn-save"]:hover {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            text-shadow: none !important;
            box-shadow: 0 0 25px #ff6a00, 0 0 50px rgba(255,106,0,0.6) !important;
            transform: translateY(-2px) !important;
        }

        /* ===== 17. КНОПКА ПЕРЕКЛЮЧЕНИЯ ПЛАГИНА ===== */
        #futurama-toggle-btn {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            width: 50px !important;
            height: 50px !important;
            min-width: 50px !important;
            min-height: 50px !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(145deg, #243447, #1b2733) !important;
            color: #ff6a00 !important;
            font-size: 24px !important;
            line-height: 1 !important;
            border: 2px solid #ff6a00 !important;
            border-radius: 50% !important;
            box-shadow: 0 0 12px #ff6a00, 0 0 25px rgba(255,106,0,0.6) !important;
            cursor: pointer !important;
            text-shadow: 0 0 6px #ff6a00 !important;
            transition: transform 0.2s ease, box-shadow 0.25s ease !important;
        }
        #futurama-toggle-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 0 20px #ff6a00, 0 0 40px rgba(255,106,0,0.8) !important;
        }
        #futurama-toggle-btn.active {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            text-shadow: none !important;
            box-shadow: 0 0 25px #ff6a00, 0 0 50px rgba(255,106,0,0.8) !important;
        }

        /* ===== 18. КНОПКА «НАВЕРХ» ===== */
        body.futurama-mode [class*="scroll-top"],
        body.futurama-mode [class*="scroll_up"],
        body.futurama-mode [class*="to-top"],
        body.futurama-mode [class*="totop"],
        body.futurama-mode .scroll-up {
            background: #243447 !important;
            color: #ff6a00 !important;
            border: 2px solid #ff6a00 !important;
            border-radius: 50% !important;
            box-shadow: 0 0 15px rgba(255,106,0,0.6) !important;
        }
        body.futurama-mode [class*="scroll-top"]:hover {
            background: #ff6a00 !important;
            color: #0d1117 !important;
            box-shadow: 0 0 25px #ff6a00, 0 0 50px rgba(255,106,0,0.6) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== Применение/снятие стиля =====
function applyFuturamaStyles(enabled) {
    const body = document.body;
    const html = document.documentElement;
    if (!body) return;

    if (enabled) {
        html.classList.add('futurama-mode');
        body.classList.add('futurama-mode');
    } else {
        html.classList.remove('futurama-mode');
        body.classList.remove('futurama-mode');
    }

    // ===== getElementById =====
    const pageWrapper = document.getElementById('page_wrapper');
    if (pageWrapper) {
        pageWrapper.style.backgroundColor = enabled ? '#0d1117' : '';
        pageWrapper.style.color = enabled ? '#e6edf3' : '';
    }

    // ===== querySelector =====
    const newsBox = document.querySelector('.news_box');
    if (newsBox) {
        newsBox.style.background = enabled ? '#1b2733' : '';
    }

    // ===== querySelectorAll — ссылки =====
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.style.color = enabled ? '#ff6a00' : '';
    });

    // ===== querySelectorAll — заголовки =====
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(h => {
        h.style.color = enabled ? '#ff6a00' : '';
    });

    // ===== parentElement =====
    const menuLinks = document.querySelectorAll('nav a, .menu a');
    menuLinks.forEach(link => {
        if (link.parentElement) {
            link.parentElement.style.borderLeft = '';
        }
    });

    // ===== children =====
    if (pageWrapper) {
        const children = pageWrapper.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.transition = enabled ? 'all 0.3s ease' : '';
        }
    }

    // ===== Сложный селектор (2 класса) =====
    const specialBlocks = document.querySelectorAll('.news_box.active, .card.highlight');
    specialBlocks.forEach(block => {
        block.style.boxShadow = enabled
            ? '0 0 25px rgba(255, 106, 0, 0.7)'
            : '';
    });

    updateButtonState(enabled);
    localStorage.setItem(STORAGE_KEY, enabled);
}

// ===== Кнопка =====
function updateButtonState(enabled) {
    const btn = document.getElementById('futurama-toggle-btn');
    if (!btn) return;
    btn.textContent = enabled ? '🚀' : '🛸';
    btn.title = enabled ? 'Выключить Футурама-режим' : 'Включить Футурама-режим';
    btn.classList.toggle('active', enabled);
}

function toggleFuturama() {
    const isEnabled = document.body.classList.contains('futurama-mode');
    applyFuturamaStyles(!isEnabled);
}

function createToggleButton() {
    if (document.getElementById('futurama-toggle-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'futurama-toggle-btn';
    btn.type = 'button';
    btn.textContent = '🛸';
    btn.title = 'Включить Футурама-режим';
    btn.addEventListener('click', toggleFuturama);

    document.body.appendChild(btn);
}

// ===== Загрузка сохранённого состояния =====
function loadSavedState() {
    const enabled = localStorage.getItem(STORAGE_KEY) === 'true';
    if (enabled) {
        applyFuturamaStyles(true);
    } else {
        updateButtonState(false);
    }
}

// ===== Инициализация =====
function init() {
    injectStyles();
    createToggleButton();
    loadSavedState();
    console.log('Futurama New New York mode initialized');
}

// ===== Запуск =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}