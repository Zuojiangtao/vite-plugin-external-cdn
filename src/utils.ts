/**
 * 是否完整url
 * */
export const isFullPath = (path: string): boolean => {
  return path.startsWith('http:') || path.startsWith('https:') || path.startsWith('//');
};

/**
 * 组织url
 * */
export const generateUrl = (url: string, data: any): string => {
  const { name, version, path } = data;
  if (isFullPath(path)) {
    url = path;
  }
  return url
    .replace(/\{name\}/g, name)
    .replace(/\{version\}/g, version)
    .replace(/\{path\}/g, path);
};
