import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

// Auto-discover all .html files in the project root
const root = process.cwd()
const htmlFiles = readdirSync(root).filter((f) => f.endsWith('.html'))
const input = Object.fromEntries(
  htmlFiles.map((f) => [f.replace(/\.html$/, ''), resolve(root, f)])
)

// Styling is compiled separately via `npm run build` (sass → assets/css/app.css);
// Vite only serves/bundles the static HTML pages.
export default defineConfig({
  server: {
    port: 5180,
    open: '/login.html',
  },
  build: {
    rollupOptions: { input },
    outDir: 'dist',
  },
})
