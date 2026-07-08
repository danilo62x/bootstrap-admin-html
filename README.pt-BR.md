# Bootstrap Admin / HTML

[Read in English](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Template de admin estático feito com HTML5 puro, JavaScript vanilla e Bootstrap 5.3. Não há framework JavaScript nem build em runtime: as 25 páginas na raiz do projeto linkam uma folha de estilos compilada a partir de SCSS (`assets/css/app.css`, versionada no repositório) e alguns scripts pequenos que injetam o layout, guardam o estado da UI no localStorage e traduzem a interface. O bundle JS do Bootstrap vem do CDN jsDelivr. Cada página é um arquivo `.html` independente, então o markup pode ser colado em qualquer backend (PHP, Rails, Django, .NET, Node).

Preview ao vivo: https://template.dev.br/preview/bootstrap-admin-html/

## Páginas incluídas

As 25 páginas ficam na raiz do projeto.

Páginas públicas:

- `index.html`: landing page de marketing com seções de hero, recursos, preços, FAQ e contato
- `login.html`: formulário de login apoiado no auth mock de `assets/js/auth.js`
- `register.html`: formulário de criação de conta
- `forgot-password.html`: solicitação de redefinição de senha
- `reset-password.html`: formulário para definir nova senha
- `maintenance.html`: página de aviso de manutenção
- `coming-soon.html`: página de pré-lançamento
- `not-found.html`: página de erro 404

Páginas do admin (o script de layout redireciona para o login quando não há sessão):

- `dashboard.html`: cards de KPI, visão de receita e atividade recente
- `charts.html`: analytics com gráficos SVG inline, incluindo receita mensal e funil de conversão
- `tables.html`: tabelas de dados com filtros e seleção de linhas
- `forms.html`: inputs, selects, upload de arquivo, sliders e estados de validação
- `components.html`: botões, badges, modais, dropdowns e indicadores de progresso
- `ui-advanced.html`: breadcrumbs, abas, acordeões, tooltips, etapas, avaliação, entrada de tags, avatares e skeletons
- `typography.html`: escala tipográfica, pesos, cores e alinhamento
- `integrations.html`: exemplos de ApexCharts, Quill 2 e flatpickr carregados do CDN jsDelivr
- `pricing.html`: planos com alternância mensal/anual e tabela comparativa
- `inbox.html`: layout de e-mail com lista de pastas, lista de mensagens e painel de leitura
- `file-manager.html`: árvore de pastas e listagem de arquivos
- `gallery.html`: grade de galeria de imagens
- `invoice.html`: fatura pronta para impressão
- `billing.html`: plano atual, forma de pagamento e histórico de cobrança
- `documentation.html`: documentação do template com sumário ancorado
- `profile.html`: página de perfil do usuário
- `settings.html`: paletas de tema, color picker, largura do menu e tamanho de fonte

## Stack

- HTML5 e JavaScript vanilla, sem framework em runtime
- Bootstrap 5.3.3: SCSS compilado com Dart Sass, bundle JS via CDN
- Vite 6.0 como dev server opcional
- ApexCharts, Quill 2 e flatpickr via CDN, usados apenas em `integrations.html`
- Fonte Outfit do Google Fonts
- Service worker e web manifest (PWA instalável)

Dependências de desenvolvimento no `package.json`: `bootstrap` ^5.3.3, `sass` ^1.80.0, `vite` ^6.0.7.

## Requisitos

Um navegador moderno basta para usar as páginas. Node.js 18 ou mais recente só é necessário para o ferramental opcional (dev server e recompilação do SCSS).

## Como rodar

Sirva a pasta com qualquer servidor HTTP estático:

```bash
npx serve .
# ou: python -m http.server
```

Abrir os arquivos `.html` direto do disco funciona na maior parte, mas o seletor de idioma carrega os dicionários JSON com `fetch()` e o service worker exige HTTP, então um servidor local é a opção confiável.

Para desenvolvimento com hot reload:

```bash
npm install
npm run dev   # http://localhost:5180/login.html
```

Credenciais demo (mock, apenas no cliente):

```
admin@template.com / admin123
user@template.com  / user123
```

## Build do CSS

A folha de estilos compilada já vem no repositório, então este passo só é necessário depois de alterar o SCSS:

```bash
npm run build   # sass assets/scss/app.scss -> assets/css/app.css (comprimido)
npm run watch   # o mesmo, recompilando ao salvar
```

O build resolve `@import "bootstrap/scss/bootstrap"` a partir de `node_modules` via `--load-path`, então rode `npm install` antes.

## Estrutura do projeto

```
.
├── *.html                      25 páginas
├── assets/
│   ├── css/app.css             CSS compilado (versionado)
│   ├── scss/app.scss           entrada Sass: overrides do Bootstrap + design tokens
│   ├── scss/_tw-compat.scss    camada de utilitários de compatibilidade
│   ├── i18n/                   pt-BR.json, en.json, es.json
│   └── js/
│       ├── state.js            estado global da UI persistido no localStorage
│       ├── auth.js             autenticação mock
│       ├── menu.js             definição do menu lateral
│       ├── layout.js           injeta sidebar, header e footer
│       ├── icons.js            conjunto de ícones SVG inline
│       ├── i18n.js             traduz elementos [data-i18n]
│       └── pwa.js              registro do service worker
├── manifest.webmanifest, sw.js, favicon.svg, pwa-192.png, pwa-512.png
├── vite.config.js              dev server do Vite (porta 5180) + build multipágina
└── package.json
```

## Tema e customização

`assets/scss/app.scss` sobrescreve variáveis do Bootstrap antes do import (`$primary: #465fff`, cores semânticas, a pilha de fontes Outfit, raios de borda, `$enable-shadows: false`), importa `bootstrap/scss/bootstrap` e depois declara os design tokens como CSS custom properties em `:root` (escalas `--color-brand-*` e os tokens de layout `--tx-*` compartilhados com a família Tailwind). `_tw-compat.scss` acrescenta uma camada de utilitários de layout, espaçamento e tipografia, incluindo o comportamento `dark:`.

O tema em runtime é ajustado em `settings.html`, sem rebuild:

- 6 paletas pré-definidas (Indigo, Esmeralda, Violeta, Tangerina, Rosa, Ciano)
- color pickers que escrevem as CSS custom properties direto no `<html>`
- modo escuro, alternado pela classe `.dark`
- largura do menu lateral, arrastável de 200 a 360 pixels (padrão 290)
- 4 tamanhos base de fonte, de 13 a 16 pixels

Tudo é persistido por `assets/js/state.js` no localStorage sob a chave `ui-state`.

## Internacionalização

O texto da interface vem em português e pode alternar para inglês ou espanhol. `assets/js/i18n.js` carrega um dicionário de `assets/i18n/` e traduz todo elemento com atributo `data-i18n`. O idioma escolhido persiste no localStorage e o seletor fica no header.

## Templates relacionados

Esta é a edição HTML estática da família Bootstrap Admin. As mesmas 25 telas existem para React 19, Vue 3, Angular 19 e Laravel 11, com um único design system. O catálogo completo, com templates grátis e pagos, está em https://template.dev.br.

## Apoie o projeto

Este template é gratuito sob a licença MIT. Se ele economizou seu tempo, você pode apoiar o desenvolvimento com uma doação de qualquer valor em https://template.dev.br/doar?template=bootstrap-admin-html.

## Licença

MIT, veja [LICENSE](./LICENSE). Copyright (c) 2026 Danilo Quinelato.
