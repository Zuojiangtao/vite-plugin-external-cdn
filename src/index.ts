// https://github.com/eight04/rollup-plugin-external-globals
import type { PluginOption } from 'vite';
import { Plugin, UserConfig } from 'vite';
import externalGlobals from 'rollup-plugin-external-globals';
import pkg from 'package.json';

const modules: Module[] = [
  {
    name: 'vue',
    var: 'Vue',
    version: '3.3.4',
    path: 'dist/vue.global.prod.js',
  },
  {
    name: 'vue-router',
    var: 'VueRouter',
    version: '4.2.0',
    path: 'dist/vue-router.global.min.js',
  },
  {
    name: 'axios',
    var: 'axios',
    version: '1.4.0',
    path: 'dist/axios.min.js',
  },
  {
    name: '@vueuse/core',
    var: 'VueUse',
    version: '10.2.0',
    path: 'index.iife.min.js',
  },
  {
    name: 'pinia',
    var: 'Pinia',
    version: '2.0.36',
    path: 'dist/pinia.iife.min.js',
  },
  {
    name: '@ant-design/icons-vue',
    var: '@ant-design/icons-vue',
    version: '6.1.0',
    path: '+esm',
  },
];

const cdnUrl: object[] = [
  {
    name: '',
    url: '//cdn.jsdelivr.net',
  },
  {
    name: 'unpkg',
    url: '//unpkg.com',
  },
  {
    name: 'cloudflare',
    url: '//cdnjs.cloudflare.com',
  },
];

/**
 * get deps version from package.json
 * */
function getDepsVersion(name: string): string {
  if (name && pkg.dependencies) {
    return pkg.dependencies[name];
  }
  return '';
}

/**
 * generate complete module url
 * */
function generateModule(modules): string[] {

}

export function configPluginAssetsCDN(options: Options): PluginOption | PluginOption[] {
  let isBuild = false;

  const externalMap: {
    [name: string]: string;
  } = {};

  const externals = generateModule(options);

  externals.forEach(v => {
    externalMap[v.name] = v.var;
  });

  const externalLibs = Object.keys(externalMap);

  const plugin: Plugin[] = [
    {
      ...externalGlobals(externalMap),
      enforce: 'post',
      apply: 'build',
    },
    {
      name: 'vite-plugin-assets-cdn',
      config(_, { command }) {
        const userConfig: UserConfig = {
          build: {
            rollupOptions: {},
          },
        };

        if (command === 'build') {
          isBuild = true

          userConfig!.build!.rollupOptions = {
            external: [...externalLibs],
          }
        } else {
          isBuild = false
        }

        return userConfig
      },
    },
    // @ts-ignore
    transformIndexHtml(html) {
      const cssCode = externals
        .map(v => v.cssList.map(css => `<link href="${css}" rel="stylesheet">`).join('\n'))
        .filter(v => v)
        .join('\n');

      const jsCode = !isBuild
        ? ''
        : externals
          .map(p => p.pathList.map(url => `<script src="${url}"></script>`).join('\n'))
          .join('\n');

      return html.replace(
        /<\/title>/i,
        `</title>${cssCode}\n${jsCode}`
      )
    },
  ]

  return plugin;
}
