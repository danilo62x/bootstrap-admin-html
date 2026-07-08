# Bootstrap Admin / HTML

[Leia em português](./README.pt-BR.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

Static admin template built with plain HTML5, vanilla JavaScript and Bootstrap 5.3. There is no JavaScript framework and no runtime build step: the 25 pages at the project root link a stylesheet compiled from SCSS (`assets/css/app.css`, committed to the repo) and a few small scripts that inject the layout, keep UI state in localStorage and translate the interface. Bootstrap's JS bundle comes from the jsDelivr CDN. Each page is a self-contained `.html` file, so the markup can be dropped into any backend (PHP, Rails, Django, .NET, Node).

Live preview: https://template.dev.br/preview/bootstrap-admin-html/

## Pages included

All 25 pages live at the project root.

Public pages:

- `index.html`: marketing landing page with hero, feature, pricing, FAQ and contact sections
- `login.html`: sign-in form backed by the mock auth in `assets/js/auth.js`
- `register.html`: account creation form
- `forgot-password.html`: password reset request
- `reset-password.html`: form to set a new password
- `maintenance.html`: maintenance notice page
- `coming-soon.html`: pre-launch page
- `not-found.html`: 404 error page

Admin pages (the layout script redirects to the login when there is no session):

- `dashboard.html`: KPI cards, revenue overview and recent activity
- `charts.html`: analytics with inline SVG charts, including monthly revenue and a conversion funnel
- `tables.html`: data tables with filtering and row selection
- `forms.html`: inputs, selects, file upload, sliders and validation states
- `components.html`: buttons, badges, modals, dropdowns and progress indicators
- `ui-advanced.html`: breadcrumbs, tabs, accordions, tooltips, steps, rating, tag input, avatars and skeletons
- `typography.html`: type scale, weights, colors and alignment
- `integrations.html`: ApexCharts, Quill 2 and flatpickr examples loaded from the jsDelivr CDN
- `pricing.html`: plans with a monthly/annual toggle and a comparison table
- `inbox.html`: mail layout with folder list, message list and reading pane
- `file-manager.html`: folder tree and file listing
- `gallery.html`: image gallery grid
- `invoice.html`: printable invoice
- `billing.html`: current plan, payment method and billing history
- `documentation.html`: template documentation with an anchored table of contents
- `profile.html`: user profile page
- `settings.html`: theme palettes, color picker, sidebar width and font size controls

## Tech stack

- HTML5 and vanilla JavaScript, no framework at runtime
- Bootstrap 5.3.3: SCSS compiled with Dart Sass, JS bundle via CDN
- Vite 6.0 as an optional dev server
- ApexCharts, Quill 2 and flatpickr via CDN, used only on `integrations.html`
- Outfit font from Google Fonts
- Service worker and web manifest (installable PWA)

Dev dependencies in `package.json`: `bootstrap` ^5.3.3, `sass` ^1.80.0, `vite` ^6.0.7.

## Requirements

A modern browser is enough to use the pages. Node.js 18 or newer is only needed for the optional tooling (dev server and SCSS rebuild).

## How to run

Serve the folder with any static HTTP server:

```bash
npx serve .
# or: python -m http.server
```

Opening the `.html` files straight from disk mostly works, but the language switcher loads its JSON dictionaries with `fetch()` and the service worker requires HTTP, so a local server is the reliable option.

For development with hot reload:

```bash
npm install
npm run dev   # http://localhost:5180/login.html
```

Demo credentials (mock, client-side only):

```
admin@template.com / admin123
user@template.com  / user123
```

## CSS build

The compiled stylesheet is committed, so this step is only needed after changing the SCSS:

```bash
npm run build   # sass assets/scss/app.scss -> assets/css/app.css (compressed)
npm run watch   # same, rebuilding on save
```

The build resolves `@import "bootstrap/scss/bootstrap"` from `node_modules` through `--load-path`, so run `npm install` first.

## Project structure

```
.
├── *.html                      25 pages
├── assets/
│   ├── css/app.css             compiled stylesheet (committed)
│   ├── scss/app.scss           Sass entry: Bootstrap overrides + design tokens
│   ├── scss/_tw-compat.scss    utility compatibility layer
│   ├── i18n/                   pt-BR.json, en.json, es.json
│   └── js/
│       ├── state.js            global UI state persisted in localStorage
│       ├── auth.js             mock authentication
│       ├── menu.js             sidebar menu definition
│       ├── layout.js           injects sidebar, header and footer
│       ├── icons.js            inline SVG icon set
│       ├── i18n.js             translates [data-i18n] elements
│       └── pwa.js              service worker registration
├── manifest.webmanifest, sw.js, favicon.svg, pwa-192.png, pwa-512.png
├── vite.config.js              Vite dev server (port 5180) + multi-page build
└── package.json
```

## Theming and customization

`assets/scss/app.scss` overrides Bootstrap variables before the import (`$primary: #465fff`, semantic colors, the Outfit font stack, border radii, `$enable-shadows: false`), imports `bootstrap/scss/bootstrap` and then declares the design tokens as CSS custom properties on `:root` (`--color-brand-*` scales and the `--tx-*` layout tokens shared with the Tailwind family). `_tw-compat.scss` adds a small utility layer for layout, spacing and typography, including `dark:` behavior.

Runtime theming happens on `settings.html`, with no rebuild:

- 6 predefined palettes (Indigo, Emerald, Violet, Tangerine, Rose, Cyan)
- color pickers that write the CSS custom properties directly on `<html>`
- dark mode, toggled through the `.dark` class
- sidebar width, draggable from 200 to 360 pixels (default 290)
- 4 base font sizes, from 13 to 16 pixels

Everything is persisted by `assets/js/state.js` in localStorage under the `ui-state` key.

## Internationalization

The interface text ships in Portuguese and can switch to English or Spanish. `assets/js/i18n.js` loads a dictionary from `assets/i18n/` and translates every element that has a `data-i18n` attribute. The chosen language persists in localStorage and the switcher sits in the header.

## Related templates

This is the static HTML edition of the Bootstrap Admin family. The same 25 screens exist for React 19, Vue 3, Angular 19 and Laravel 11, sharing one design system. The full catalog, free and paid, is at https://template.dev.br.

## Support this project

This template is free under the MIT license. If it saves you time, you can support development with a donation of any amount at https://template.dev.br/doar?template=bootstrap-admin-html.

## License

MIT, see [LICENSE](./LICENSE). Copyright (c) 2026 Danilo Quinelato.
