// https://github.com/eight04/rollup-plugin-external-globals
import type { PluginOption } from 'vite';
import { Plugin, UserConfig } from 'vite';
import externalGlobals from 'rollup-plugin-external-globals';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import type { Options, Module } from './type';
import { isFullPath, generateUrl } from './utils';

/**
 * get deps version from package.json
 * */
function getDepsVersion(name: string): string {
  const pwd = process.cwd();
  const pkg = path.join(pwd, 'node_modules', name, 'package.json');
  if (name && fs.existsSync(pkg)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkg, 'utf8'));
    return pkgJson.version;
  }
  return '';
}

/**
 * generate complete module url
 * */
function generateExternals(options: Options): any[] {
  const { modules = [], prodUrl = 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}' } = options;

  return modules.map((m: any) => {
    let v: Module;
    if (typeof m === 'function') {
      v = m(prodUrl);
    } else {
      v = m;
    }

    const version = getDepsVersion(v.name);

    let pathList: string[] = [];
    if (!Array.isArray(v.path)) {
      pathList.push(v.path);
    } else {
      pathList = v.path;
    }

    const data = {
      ...v,
      version,
    };

    pathList = pathList.map(p => {
      if (!version && !isFullPath(p)) {
        throw new Error(`modules: ${data.name} package.json file does not exist`);
      }
      return generateUrl(prodUrl, {
        ...data,
        path: p,
      });
    });

    let css = v.css || [];
    if (!Array.isArray(css) && css) {
      css = [css];
    }
    const cssList = !Array.isArray(css)
      ? []
      : css.map(c =>
          generateUrl(prodUrl, {
            ...data,
            path: c,
          }),
        );

    return {
      ...v,
      version,
      pathList,
      cssList,
    };
  });
}

export function transformExternalCDN(options: Options): PluginOption | PluginOption[] {
  let isBuild = false;

  const externalMap: {
    [name: string]: string;
  } = {};

  const externals = generateExternals(options);

  externals.forEach(v => {
    externalMap[v.name] = v.var;
  });

  const externalLibs = Object.keys(externalMap);

  const plugin: Plugin[] = [
    {
      name: 'vite-plugin-external-cdn',
      enforce: 'post',
      apply: 'build',
      ...externalGlobals(externalMap),
    },
    {
      config(config, { command }) {
        const userConfig: UserConfig = {
          build: {
            rollupOptions: {},
          },
        };

        if (command === 'build') {
          isBuild = true;

          userConfig!.build!.rollupOptions = {
            external: [...externalLibs],
          };
        } else {
          isBuild = false;
        }

        return userConfig;
      },
      transformIndexHtml(html: string) {
        const cssCode = externals
          .map(v => v.cssList.map((css: any): string => `<link href="${css}" rel="stylesheet">`).join('\n'))
          .filter(v => v)
          .join('\n');

        const jsCode = !isBuild
          ? ''
          : externals
              .map(p => p.pathList.map((url: any): string => `<script src="${url}"></script>`).join('\n'))
              .join('\n');

        return html.replace(/<\/title>/i, `</title>${cssCode}\n${jsCode}`);
      },
    },
  ];

  return plugin;
}
