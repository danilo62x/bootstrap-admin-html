/* ===== Menu structure ===== */
(function (global) {
  global.MENU_SECTIONS = [
    {
      title: 'Menu',
      items: [
        { label: 'Dashboard', icon: 'dashboard', href: 'dashboard.html' },
        { label: 'Analytics', icon: 'chart', href: 'charts.html' },
      ],
    },
    {
      title: 'Dados',
      items: [
        { label: 'Formulários', icon: 'forms', href: 'forms.html' },
        { label: 'Tabelas', icon: 'tables', href: 'tables.html' },
      ],
    },
    {
      title: 'Aplicações',
      items: [
        { label: 'Caixa de entrada', icon: 'mail', href: 'inbox.html', badge: '3' },
        { label: 'Arquivos', icon: 'package', href: 'file-manager.html' },
        { label: 'Galeria', icon: 'grid', href: 'gallery.html' },
        {
          label: 'Financeiro',
          icon: 'dollar',
          children: [
            { label: 'Faturas', icon: 'dollar', href: 'invoice.html' },
            { label: 'Cobrança', icon: 'tag', href: 'billing.html' },
          ],
        },
        { label: 'Documentação', icon: 'help', href: 'documentation.html' },
      ],
    },
    {
      title: 'UI',
      items: [
        {
          label: 'Componentes',
          icon: 'grid',
          children: [
            { label: 'Componentes UI', icon: 'grid', href: 'components.html' },
            { label: 'Componentes avançados', icon: 'zap', href: 'ui-advanced.html' },
            { label: 'Tipografia', icon: 'type', href: 'typography.html' },
          ],
        },
        { label: 'Integrações & Libs', icon: 'package', href: 'integrations.html', badge: 'novo' },
        { label: 'Planos & Preços', icon: 'tag', href: 'pricing.html' },
      ],
    },
    {
      title: 'Páginas',
      items: [
        {
          label: 'Utilitárias',
          icon: 'info',
          children: [
            { label: 'Em breve', icon: 'rocket', href: 'coming-soon.html' },
            { label: 'Manutenção', icon: 'settings', href: 'maintenance.html' },
            { label: 'Erro 404', icon: 'x', href: 'not-found.html' },
          ],
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        { label: 'Perfil', icon: 'user', href: 'profile.html' },
        { label: 'Configurações', icon: 'settings', href: 'settings.html' },
      ],
    },
  ];
})(window);
