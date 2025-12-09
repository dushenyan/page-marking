import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'
import { description, version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '页面标记遮罩',
        namespace: 'page-marking',
        description,
        version,
        author: 'dushenyan88@gmail.com',
        icon: 'https://vitejs.dev/logo.svg',
        match: ['*://*/*'],
        grant: ['GM_addStyle', 'GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
})
