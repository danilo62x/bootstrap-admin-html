/* ===== Layout — injects sidebar + header + footer + delegated event handling ===== */
(function (global) {
  if (typeof Auth !== 'undefined') Auth.requireAuth();

  const currentPage = (location.pathname.split('/').pop() || 'dashboard.html').toLowerCase();
  const openGroups = new Set();

  // ---------- i18n + PWA bootstrap (loaded once for every admin page) ----------
  const LANGS = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];
  function currentLang() {
    if (global.I18n) return global.I18n.getLang();
    try {
      return localStorage.getItem('lang') || 'pt-BR';
    } catch (_) {
      return 'pt-BR';
    }
  }
  (function loadScriptsOnce() {
    ['assets/js/i18n.js', 'assets/js/pwa.js'].forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const sc = document.createElement('script');
        sc.src = src;
        document.head.appendChild(sc);
      }
    });
  })();

  // ---------- helpers ----------
  function isActive(href) {
    return href && href.toLowerCase() === currentPage;
  }

  function isGroupActive(item) {
    return !!item.children && item.children.some((c) => isActive(c.href));
  }

  function navLinkClass(active, child) {
    const collapsed = UIState.get().sidebarCollapsed;
    let cls = 'group d-flex align-items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
    if (collapsed && !child) cls += ' justify-center';
    if (child) cls += ' py-1.5';
    cls += active ? ' is-sidebar-active' : ' is-sidebar-inactive';
    return cls;
  }

  // ---------- renderers ----------
  function renderSidebar() {
    const s = UIState.get();
    const sections = global.MENU_SECTIONS || [];

    sections.forEach((sec) =>
      sec.items.forEach((item) => {
        if (item.children && isGroupActive(item)) openGroups.add(item.label);
      })
    );

    let html = '';

    html += `<div class="d-flex align-items-center pt-7 pb-6 ${s.sidebarCollapsed ? 'justify-center' : 'justify-between'}">
      <a href="dashboard.html" class="d-flex align-items-center gap-2.5">
        <span class="d-flex h-9 w-9 align-items-center justify-content-center rounded-lg bg-brand-500 text-white shadow-theme-sm"><span class="font-bold">A</span></span>
        ${!s.sidebarCollapsed ? `<span data-brand-text class="text-lg font-semibold">Admin</span>` : ''}
      </a>
      ${!s.sidebarCollapsed ? `<button type="button" class="is-sidebar-inactive d-none h-8 w-8 align-items-center justify-content-center rounded-lg border border-themed lg:flex" data-action="toggle-sidebar" title="Recolher menu">${icon('chevron-right', { size: 14, className: 'rotate-180' })}</button>` : ''}
    </div>`;

    if (!s.sidebarCollapsed) {
      html += `<div id="tx-drag-handle" class="absolute right-0 top-0 d-none h-full w-1.5 cursor-ew-resize lg:block group/handle" title="Arraste para redimensionar • Duplo clique para resetar">
        <span class="absolute right-0 top-1/2 h-12 w-1 -translate-y-1/2 rounded-l-full bg-transparent transition-all group-hover/handle:bg-brand-400"></span>
      </div>`;
    }

    html += '<div class="d-flex flex-column gap-4 overflow-y-auto no-scrollbar pb-4">';
    sections.forEach((section) => {
      html += '<nav>';
      if (!s.sidebarCollapsed) {
        html += `<h3 class="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider">${section.title}</h3>`;
      }
      html += '<ul class="d-flex flex-column gap-1">';
      section.items.forEach((item) => {
        html += '<li>';
        if (item.href) {
          html += `<a href="${item.href}" class="${navLinkClass(isActive(item.href), false)}" title="${s.sidebarCollapsed ? item.label : ''}">
            ${icon(item.icon, { size: 20 })}
            ${!s.sidebarCollapsed ? `<span class="flex-fill">${item.label}</span>` : ''}
          </a>`;
        } else if (item.children) {
          const open = openGroups.has(item.label);
          html += `<button type="button" class="${navLinkClass(isGroupActive(item), false)}" data-action="toggle-group" data-group="${item.label}" title="${s.sidebarCollapsed ? item.label : ''}">
            ${icon(item.icon, { size: 20 })}
            ${!s.sidebarCollapsed ? `<span class="flex-fill text-start">${item.label}</span>${icon('chevron-down', { size: 14, className: `transition-transform ${open ? 'rotate-180' : ''}` })}` : ''}
          </button>`;
          if (open && !s.sidebarCollapsed) {
            html += '<ul class="mt-1 ml-3 d-flex flex-column gap-1 border-l border-themed pl-3">';
            item.children.forEach((child) => {
              if (child.href) {
                html += `<li><a href="${child.href}" class="${navLinkClass(isActive(child.href), true)}"><span class="flex-fill">${child.label}</span></a></li>`;
              }
            });
            html += '</ul>';
          }
        }
        html += '</li>';
      });
      html += '</ul></nav>';
    });
    html += '</div>';

    html += `<div class="mt-auto border-t border-themed py-4">
      <button type="button" class="${navLinkClass(false, false)}" data-action="logout" title="${s.sidebarCollapsed ? 'Sair' : ''}">
        ${icon('logout', { size: 20 })}
        ${!s.sidebarCollapsed ? '<span>Sair</span>' : ''}
      </button>
    </div>`;

    return html;
  }

  function renderHeader() {
    const u = Auth.getUser();
    const s = UIState.get();
    const initials = u ? u.name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join('') : '?';

    return `<div class="d-flex flex-grow-1 align-items-center justify-content-between gap-4 px-4 py-3 md:px-6 2xl:px-10">
      <div class="d-flex align-items-center gap-3">
        <button type="button" class="d-flex h-10 w-10 align-items-center justify-content-center rounded-lg border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" data-action="toggle-sidebar-mobile" aria-label="Toggle sidebar">${icon('menu', { size: 20 })}</button>
        <div class="d-none md:block">
          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${icon('search', { size: 18 })}</span>
            <input type="text" placeholder="Buscar ou digitar comando..." class="h-10 w-[260px] rounded-lg border border-themed bg-gray-50 pl-10 pr-12 text-sm text-body placeholder-gray-400 outline-none focus:border-brand-300 dark:bg-gray-900 xl:w-[400px]" />
            <kbd class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-themed bg-white px-1.5 py-0.5 text-xs text-muted dark:bg-gray-900">⌘ K</kbd>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="relative" id="tx-lang-dropdown">
          <button type="button" class="d-flex h-10 w-10 align-items-center justify-content-center rounded-full border border-themed text-base hover:bg-gray-50 dark:hover:bg-gray-800" data-action="toggle-lang" aria-label="Language">${LANGS.find((l) => l.code === currentLang()).flag}</button>
          <div id="tx-lang-menu" class="surface-card absolute right-0 mt-3 w-44 rounded-xl border py-1 shadow-theme-lg d-none">
            ${LANGS.map((l) => `<button type="button" class="d-flex w-100 align-items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${l.code === currentLang() ? 'font-medium text-brand-600' : 'text-body'}" data-action="set-lang" data-lang="${l.code}"><span>${l.flag}</span> ${l.label}${l.code === currentLang() ? icon('check', { size: 14, className: 'ml-auto' }) : ''}</button>`).join('')}
          </div>
        </div>
        <button type="button" class="d-flex h-10 w-10 align-items-center justify-content-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" data-action="toggle-dark" aria-label="Toggle dark mode">${icon(s.darkMode ? 'sun' : 'moon', { size: 18 })}</button>
        <button type="button" class="relative d-flex h-10 w-10 align-items-center justify-content-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="Notifications">
          ${icon('bell', { size: 18 })}
          <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error-500"></span>
        </button>
        <div class="relative" id="tx-user-dropdown">
          <button type="button" class="ml-1 d-flex align-items-center gap-3" data-action="toggle-user">
            <span class="d-none text-right lg:block">
              <span class="block text-sm font-medium text-heading">${u ? u.name : 'Convidado'}</span>
              <span class="block text-xs text-muted">${u ? u.role : '—'}</span>
            </span>
            <span class="d-flex h-10 w-10 align-items-center justify-content-center rounded-full bg-brand-500 font-semibold text-white">${initials}</span>
            ${icon('chevron-down', { size: 16, className: 'text-muted' })}
          </button>
          <div id="tx-user-menu" class="surface-card absolute right-0 mt-3 w-56 rounded-xl border shadow-theme-lg d-none">
            <div class="border-b border-themed px-4 py-3">
              <p class="text-sm font-medium text-heading">${u ? u.name : 'Convidado'}</p>
              <p class="text-xs text-muted">${u ? u.email : ''}</p>
            </div>
            <ul class="py-1">
              <li><a href="profile.html" class="d-flex align-items-center gap-2 px-4 py-2 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800">${icon('user', { size: 16 })} Meu perfil</a></li>
              <li><a href="settings.html" class="d-flex align-items-center gap-2 px-4 py-2 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800">${icon('settings', { size: 16 })} Configurações</a></li>
              <li><button type="button" class="d-flex w-100 align-items-center gap-2 px-4 py-2 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800" data-action="open-cookies">${icon('cookie', { size: 16 })} Preferências de cookies</button></li>
            </ul>
            <div class="border-t border-themed py-1">
              <button type="button" class="d-flex w-100 align-items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10" data-action="logout">${icon('logout', { size: 16 })} Sair</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `<div class="d-flex flex-column align-items-start justify-content-between gap-2 sm:flex-row sm:items-center">
      <p class="text-xs text-muted">© ${year} Bootstrap Admin Template. Construído com HTML5 + Bootstrap 5.3.</p>
      <div class="d-flex align-items-center gap-4 text-xs text-muted">
        <a href="#" class="hover:text-brand-500">Documentação</a>
        <a href="#" class="hover:text-brand-500">Suporte</a>
        <a href="#" class="hover:text-brand-500">Changelog</a>
      </div>
    </div>`;
  }

  function renderCookieBanner() {
    return `<div class="d-flex h-12 w-12 shrink-0 align-items-center justify-content-center rounded-xl bg-warning-50 text-warning-500 dark:bg-warning-500/15">${icon('cookie', { size: 26 })}</div>
    <div class="flex-fill">
      <p class="text-sm font-semibold text-heading">Usamos cookies</p>
      <p class="mt-1 text-xs leading-relaxed text-muted">Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com a nossa <a href="#" class="font-medium text-brand-500 hover:text-brand-600">Política de Privacidade</a>.</p>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button type="button" data-action="cookies-decline" class="inline-flex h-9 align-items-center rounded-lg border border-themed px-3 text-sm font-medium text-body hover:bg-gray-50 dark:hover:bg-gray-800">Recusar</button>
      <button type="button" data-action="cookies-accept" class="inline-flex h-9 align-items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">${icon('check', { size: 14, strokeWidth: 2.5 })} Aceitar</button>
      <button type="button" data-action="cookies-close" class="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Fechar">${icon('x', { size: 18 })}</button>
    </div>`;
  }

  // ---------- DOM updates ----------
  function updateSidebarWidth() {
    const aside = document.getElementById('tx-sidebar');
    if (!aside) return;
    const s = UIState.get();
    aside.style.width = s.sidebarCollapsed ? '90px' : `${s.sidebarWidth}px`;
  }

  function syncMobileOverlay() {
    const aside = document.getElementById('tx-sidebar');
    const backdrop = document.getElementById('tx-backdrop');
    if (!aside || !backdrop) return;
    const open = UIState.get().sidebarMobileOpen;
    aside.classList.toggle('-translate-x-full', !open);
    aside.classList.toggle('translate-x-0', open);
    backdrop.classList.toggle('hidden', !open);
  }

  function renderCookies() {
    const el = document.getElementById('tx-cookie-banner');
    if (!el) return;
    const show = UIState.get().showCookieBanner;
    el.classList.toggle('hidden', !show);
    if (show && !el.innerHTML.trim()) {
      el.innerHTML = renderCookieBanner();
    }
  }

  function renderAll() {
    const sidebar = document.getElementById('tx-sidebar');
    const header = document.getElementById('tx-header');
    const footer = document.getElementById('tx-footer');
    if (sidebar) sidebar.innerHTML = renderSidebar();
    if (header) header.innerHTML = renderHeader();
    if (footer) footer.innerHTML = renderFooter();
    updateSidebarWidth();
  }

  // ---------- EVENT DELEGATION ----------
  // Single document-level click handler. Works regardless of re-renders because
  // we read data-action from the target at click time — no listener bookkeeping.
  function handleDelegatedClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) {
      // Close user dropdown when clicking outside
      const wrap = document.getElementById('tx-user-dropdown');
      const menu = document.getElementById('tx-user-menu');
      if (wrap && menu && !wrap.contains(e.target)) menu.classList.add('hidden');
      const langWrap = document.getElementById('tx-lang-dropdown');
      const langMenu = document.getElementById('tx-lang-menu');
      if (langWrap && langMenu && !langWrap.contains(e.target)) langMenu.classList.add('hidden');
      return;
    }

    const action = target.getAttribute('data-action');

    switch (action) {
      case 'toggle-sidebar':
        UIState.set({ sidebarCollapsed: !UIState.get().sidebarCollapsed });
        renderAll();
        break;

      case 'toggle-sidebar-mobile':
        if (window.innerWidth < 1024) {
          UIState.set({ sidebarMobileOpen: !UIState.get().sidebarMobileOpen });
          syncMobileOverlay();
        } else {
          UIState.set({ sidebarCollapsed: !UIState.get().sidebarCollapsed });
          renderAll();
        }
        break;

      case 'toggle-group': {
        const label = target.getAttribute('data-group');
        if (openGroups.has(label)) openGroups.delete(label);
        else openGroups.add(label);
        const sidebar = document.getElementById('tx-sidebar');
        if (sidebar) sidebar.innerHTML = renderSidebar();
        updateSidebarWidth();
        break;
      }

      case 'toggle-dark': {
        UIState.set({ darkMode: !UIState.get().darkMode });
        UIState.applyTheme();
        const header = document.getElementById('tx-header');
        if (header) header.innerHTML = renderHeader();
        break;
      }

      case 'toggle-user':
        e.stopPropagation();
        document.getElementById('tx-user-menu')?.classList.toggle('hidden');
        break;

      case 'toggle-lang':
        e.stopPropagation();
        document.getElementById('tx-lang-menu')?.classList.toggle('hidden');
        break;

      case 'set-lang': {
        e.stopPropagation();
        const lang = target.getAttribute('data-lang');
        if (global.I18n) global.I18n.setLang(lang);
        const header = document.getElementById('tx-header');
        if (header) header.innerHTML = renderHeader();
        break;
      }

      case 'logout':
        Auth.logout();
        break;

      case 'open-cookies':
        document.getElementById('tx-user-menu')?.classList.add('hidden');
        UIState.set({ showCookieBanner: true });
        renderCookies();
        break;

      case 'cookies-accept':
        UIState.set({ cookiesAccepted: true, showCookieBanner: false });
        renderCookies();
        break;

      case 'cookies-decline':
        UIState.set({ cookiesAccepted: false, showCookieBanner: false });
        renderCookies();
        break;

      case 'cookies-close':
        UIState.set({ showCookieBanner: false });
        renderCookies();
        break;

      case 'close-mobile':
        UIState.set({ sidebarMobileOpen: false });
        syncMobileOverlay();
        break;
    }
  }

  // Drag-resize handlers (delegated via mousedown on document)
  function attachDragHandlers() {
    document.addEventListener('mousedown', (e) => {
      const handle = e.target.closest('#tx-drag-handle');
      if (!handle) return;
      if (UIState.get().sidebarCollapsed) return;
      e.preventDefault();
      handle.classList.add('bg-brand-500/40');
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      let rafId = 0;
      let pendingWidth = 0;
      const onMove = (ev) => {
        pendingWidth = Math.min(360, Math.max(200, ev.clientX));
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          UIState.set({ sidebarWidth: pendingWidth });
          updateSidebarWidth();
          rafId = 0;
        });
      };
      const onUp = () => {
        handle.classList.remove('bg-brand-500/40');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp, { once: true });
    });

    document.addEventListener('dblclick', (e) => {
      if (e.target.closest('#tx-drag-handle')) {
        UIState.set({ sidebarWidth: 290 });
        updateSidebarWidth();
      }
    });
  }

  // ---------- INIT ----------
  function init() {
    const app = document.getElementById('app');
    if (!app) return;

    const innerContent = app.innerHTML;
    const layout = `
      <div class="d-flex h-screen overflow-hidden" style="background-color: var(--tx-body-bg)">
        <aside id="tx-sidebar" class="surface-sidebar fixed left-0 top-0 z-50 d-flex h-screen flex-column overflow-y-hidden border-r px-4 transition-[transform,width] duration-300 lg:static lg:translate-x-0 -translate-x-full"></aside>
        <div id="tx-backdrop" class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden d-none" data-action="close-mobile"></div>
        <div class="relative d-flex flex-fill flex-column overflow-x-hidden overflow-y-auto">
          <header id="tx-header" class="surface-header sticky top-0 z-30 d-flex w-100 border-b"></header>
          <main class="flex-fill">
            <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">${innerContent}</div>
          </main>
          <footer id="tx-footer" class="surface-header border-t px-4 py-4 md:px-6 2xl:px-10"></footer>
        </div>
        <div id="tx-cookie-banner" class="fixed inset-x-4 bottom-4 z-50 mx-auto d-flex max-w-2xl flex-column gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:flex-row sm:items-center sm:gap-4 sm:p-5 d-none"></div>
        <div id="tx-toast-stack" class="pointer-events-none fixed top-4 right-4 z-[100] d-flex flex-column gap-2"></div>
      </div>
    `;
    app.outerHTML = layout;

    renderAll();
    if (!UIState.get().cookiesAccepted) {
      UIState.set({ showCookieBanner: true });
      renderCookies();
    }

    // Attach delegated handlers ONCE — survives every re-render
    document.addEventListener('click', handleDelegatedClick);
    attachDragHandlers();
  }

  // IMPORTANT: init MUST run synchronously here. Page-specific inline scripts
  // come AFTER this script tag in the body — they attach listeners to elements
  // inside #app. If we defer init() to DOMContentLoaded, the inline scripts run
  // first (attaching listeners to elements that we then REPLACE via
  // `app.outerHTML = layout`), breaking the listeners.
  // By the time this <script> executes, #app has already been parsed (we
  // require layout.js to be placed AFTER #app in the body).
  if (document.getElementById('app')) {
    init();
  } else {
    // Fallback: layout.js was placed in <head> or before #app — wait for DOM.
    document.addEventListener('DOMContentLoaded', init);
  }

  global.Layout = { init, renderAll };

  // ---------- GLOBAL TOAST SYSTEM ----------
  // Use this from any page instead of alert(): notify('Salvo!', 'success')
  const TOAST_STYLES = {
    success: { border: 'border-success-200 dark:border-success-500/30', icon: 'check', color: 'text-success-500' },
    error:   { border: 'border-error-200 dark:border-error-500/30',     icon: 'x',     color: 'text-error-500' },
    warning: { border: 'border-warning-200 dark:border-warning-500/30', icon: 'bell',  color: 'text-warning-500' },
    info:    { border: 'border-blue-light-200 dark:border-blue-light-500/30', icon: 'bell', color: 'text-blue-light-500' },
  };

  function notify(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    const s = TOAST_STYLES[type] || TOAST_STYLES.info;
    const stack = document.getElementById('tx-toast-stack');
    if (!stack) {
      // Layout not yet initialized — fall back to console
      console.log('[notify]', message);
      return;
    }
    const el = document.createElement('div');
    el.className = 'pointer-events-auto d-flex w-80 align-items-start gap-3 rounded-lg border bg-white p-4 shadow-theme-md dark:bg-gray-dark ' + s.border;
    el.innerHTML =
      '<span class="' + s.color + '">' + icon(s.icon, { size: 20 }) + '</span>' +
      '<div class="flex-fill"><p class="text-sm font-medium text-heading">' + message + '</p></div>' +
      '<button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">' + icon('x', { size: 16 }) + '</button>';
    el.querySelector('button').addEventListener('click', () => el.remove());
    stack.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  global.notify = notify;
  global.notifySuccess = (m) => notify(m, 'success');
  global.notifyError = (m) => notify(m, 'error');
  global.notifyWarning = (m) => notify(m, 'warning');

  // Make UIState.notify delegate to the same toast system
  if (global.UIState) {
    global.UIState.notify = notify;
    global.UIState.notifySuccess = global.notifySuccess;
    global.UIState.notifyError = global.notifyError;
    global.UIState.notifyWarning = global.notifyWarning;
  }
})(window);
