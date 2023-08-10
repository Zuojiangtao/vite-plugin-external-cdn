import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import transformExternalCDN, { autoComplete } from 'vite-plugin-external-cdn';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    transformExternalCDN({
      modules: [
        autoComplete('vue'), // vue2 使用 autoComplete('vue2')
        autoComplete('axios'),
        // autoComplete('@vueuse/shared'),
        // autoComplete('@vueuse/core'),
        {
          name: 'vue-router',
          var: 'VueRouter',
          version: '4.2.0',
          path: 'dist/vue-router.global.min.js',
        },
        {
          name: 'vue-demi',
          var: 'VueDemi',
          version: '0.14.5',
          path: 'lib/index.iife.min.js',
        },
        {
          name: 'pinia',
          var: 'Pinia',
          version: '2.0.36',
          path: 'dist/pinia.iife.min.js',
        },
        // {
        //   name: '@ant-design/icons-vue',
        //   var: '@ant-design/icons-vue',
        //   version: '6.1.0',
        //   path: '+esm',
        // },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
