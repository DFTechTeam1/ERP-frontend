// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    plugins: [
      Vue({
        template: { transformAssetUrls }
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
      Components(),
      Fonts({
        google: {
          families: [{
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          }],
        },
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
    ],
    define: { 
      'process.env': {},
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      // https: {
      //   key: fs.readFileSync(path.resolve(__dirname, './192.168.99.51-key.pem')),
      //   cert: fs.readFileSync(path.resolve(__dirname, './192.168.99.51.pem')),
      // },
      // Make sure the server is accessible over the local network
      // host: '192.168.99.51',
      // port: 5173,
    },
  }
})
