interface Module {
  name: string;
  var: string;
  path: string | string[];
  version?: string;
  css?: string | string[];
}

interface Options {
  modules: (Module | ((prodUrl: string) => Module))[];
  prodUrl?: string;
}
