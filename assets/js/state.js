/* ===== Global UI state — backed by localStorage ===== */
(function (global) {
  const STORAGE_KEY = 'ui-state';

  const DEFAULTS = {
    darkMode: false,
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    sidebarWidth: 290,
    fontSize: 'base',
    customTheme: {},
    cookiesAccepted: false,
    showCookieBanner: false,
  };

  let state = { ...DEFAULTS };
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = { ...DEFAULTS, ...JSON.parse(raw), sidebarMobileOpen: false, showCookieBanner: false };
    } catch {}
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode: state.darkMode,
          sidebarCollapsed: state.sidebarCollapsed,
          sidebarWidth: state.sidebarWidth,
          fontSize: state.fontSize,
          customTheme: state.customTheme,
          cookiesAccepted: state.cookiesAccepted,
        })
      );
    } catch {}
  }

  function set(patch) {
    state = { ...state, ...patch };
    persist();
    listeners.forEach((cb) => cb(state));
  }

  function get() {
    return state;
  }

  function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }

  function applyTheme() {
    const root = document.documentElement;
    if (state.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    // Bootstrap 5.3 components follow data-bs-theme
    root.setAttribute('data-bs-theme', state.darkMode ? 'dark' : 'light');
    Object.entries(state.customTheme || {}).forEach(([k, v]) => root.style.setProperty(k, v));
    applyFontSize();
  }

  function applyFontSize() {
    const sizes = { sm: '13px', base: '14px', lg: '15px', xl: '16px' };
    document.documentElement.style.fontSize = sizes[state.fontSize] || '14px';
  }

  function setThemeVar(key, val) {
    state.customTheme = { ...state.customTheme, [key]: val };
    document.documentElement.style.setProperty(key, val);
    persist();
    listeners.forEach((cb) => cb(state));
  }

  function resetThemeVars() {
    Object.keys(state.customTheme || {}).forEach((k) => document.documentElement.style.removeProperty(k));
    set({ customTheme: {} });
  }

  const THEME_DEFAULTS = {
    '--color-brand-500': '#465fff',
    '--color-brand-600': '#3641f5',
    '--color-success-500': '#12b76a',
    '--color-warning-500': '#f79009',
    '--color-error-500': '#f04438',
    '--color-blue-light-500': '#0ba5ec',
    '--tx-sidebar-bg': '#ffffff',
    '--tx-sidebar-text': '#475467',
    '--tx-sidebar-active-bg': '#ecf3ff',
    '--tx-body-bg': '#f9fafb',
    '--tx-card-bg': '#ffffff',
    '--tx-header-bg': '#ffffff',
    '--tx-border': '#e4e7ec',
    '--tx-text': '#344054',
    '--tx-text-heading': '#101828',
    '--tx-text-muted': '#667085',
  };

  function getThemeVar(key) {
    return (state.customTheme && state.customTheme[key]) || THEME_DEFAULTS[key] || '#000000';
  }

  function notify(message, type = 'info', duration = 4000) {
    if (global.UIToast) global.UIToast.push(message, type, duration);
  }

  load();
  applyTheme();

  global.UIState = {
    get,
    set,
    subscribe,
    applyTheme,
    setThemeVar,
    resetThemeVars,
    getThemeVar,
    applyFontSize,
    notify,
    THEME_DEFAULTS,
  };
})(window);
