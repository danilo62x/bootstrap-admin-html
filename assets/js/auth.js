/* ===== Auth (mock) ===== */
(function (global) {
  const STORAGE_KEY = 'auth-user';

  const MOCK_USERS = [
    { id: 1, email: 'admin@template.com', password: 'admin123', name: 'Admin Usuário', role: 'Administrador' },
    { id: 2, email: 'user@template.com', password: 'user123', name: 'Usuário Comum', role: 'Operador' },
  ];

  let user = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) user = JSON.parse(raw);
  } catch {}

  function isAuthenticated() {
    return user !== null;
  }

  function getUser() {
    return user;
  }

  function login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_USERS.find((u) => u.email === email && u.password === password);
        if (!found) return resolve(false);
        user = { id: found.id, name: found.name, email: found.email, role: found.role };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch {}
        resolve(true);
      }, 600);
    });
  }

  function logout() {
    user = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.location.href = 'login.html';
  }

  function requireAuth() {
    if (!isAuthenticated()) {
      const redirect = encodeURIComponent(window.location.pathname.split('/').pop() || 'dashboard.html');
      window.location.href = `login.html?redirect=${redirect}`;
    }
  }

  global.Auth = { isAuthenticated, getUser, login, logout, requireAuth };
})(window);
