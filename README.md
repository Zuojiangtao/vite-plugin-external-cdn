<div align="center">
  <a href="https://vitejs.dev/">
    <img width="200" height="200" hspace="10" src="https://vitejs.dev/logo.svg" alt="vite logo" />
  </a>
  <h1>Vite External CDN</h1>
  <p>
    A <a href="https://vitejs.dev/">Vite</a> plugin to convert dependencies to cdn at build time usingPlugin for <a href="https://github.com/eight04/rollup-plugin-external-globals">rollup-plugin-external-globals</a>.
  </p>
  <img src="https://img.shields.io/node/v/vite-plugin-external-cdn" alt="node-current" />
  <img src="https://img.shields.io/npm/dependency-version/vite-plugin-external-cdn/peer/vite" alt="npm peer dependency version" />
  <img src="https://img.shields.io/github/v/release/fatehak/vite-plugin-external-cdn" alt="GitHub release" />  
  <img src="https://img.shields.io/npm/l/vite-plugin-external-cdn" alt="licence" />
</div>

## Installation

Install the plugin with npm:

```
npm install vite-plugin-external-cdn --save-dev
```

or yarn

```
yarn add vite-plugin-external-cdn -D
```

## Basic Usage

Add it to vite.config.js

```js
// vite.config.js
import reactRefresh from '@vitejs/plugin-react-refresh'
import transformExternalCDN from 'vite-plugin-external-cdn'

export default {
    plugins: [
      transformExternalCDN({
            modules: [
                {
                    name: 'react',
                    var: 'React',
                    path: `umd/react.production.min.js`,
                },
                {
                    name: 'react-dom',
                    var: 'ReactDOM',
                    path: `umd/react-dom.production.min.js`,
                },
            ],
        }),
    ],
}
```

### Use autoComplete

```js
// vite.config.js
import reactRefresh from '@vitejs/plugin-react-refresh'
import transformExternalCDN, { autoComplete } from 'vite-plugin-external-cdn'

export default {
    plugins: [
      transformExternalCDN({
            modules: [
                autoComplete('react'),
                autoComplete('react-dom')
            ],
        }),
        reactRefresh(),
    ],
}
```

### Autocomplete supported modules

```
"react" | "react-dom" | "react-router-dom" | 
"antd" | "ahooks" | "@ant-design/charts" | 
"vue" | "vue2" | "@vueuse/shared" | 
"@vueuse/core" | "moment" | 
"eventemitter3" | "file-saver" | 
"browser-md5-file" | "xlsx | "crypto-js" |
"axios" | "lodash" | "localforage"
```

### VueUse demo

```js
import vue from '@vitejs/plugin-vue'
import { importToCDN, autoComplete } from 'vite-plugin-cdn-import'

export default {
    plugins: [
        vue(),
        importToCDN({
            modules: [
                autoComplete('vue'), // vue2 use autoComplete('vue2')
                autoComplete('@vueuse/shared'),
                autoComplete('@vueuse/core')
            ],
        }),
    ],
}
```

## Options

| Name    | Description                                                                                  | Type            | Default                                                |
| ------- | -------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------ |
| prodUrl | Overrides the global prodUrl, allowing you to specify the CDN location for a specific module | string          | <https://cdn.jsdelivr.net/npm/{name}@{version}/{path}> |
| modules | Modules config                                                                               | Array`<Module>` / Array`<(prodUrl:string) => Module>` | -                                                      |

### Module

| Name | Description                                                                           | Type              |
| ---- | ------------------------------------------------------------------------------------- | ----------------- |
| name | The name of the module you want to externalize                                        | string            |
| var  | A variable that will be assigned to the module in global scope, Rollup requires this  | string            |
| path | Specify the load path on the CDN                                                      | string / string[] |
| css  | You can alternatively specify multiple style sheets which will be loaded from the CDN | string / string[] |

## Other CDN prodUrl

| Name  | pordUrl                                                  |
| ----- | -------------------------------------------------------- |
| unpkg | //unpkg.com/{name}@{version}/{path}                      |
| cdnjs | //cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path} |

## Resources

- [webpack-cdn-plugin](https://github.com/shirotech/webpack-cdn-plugin)
- [rollup-plugin-external-globals](https://github.com/eight04/rollup-plugin-external-globals)