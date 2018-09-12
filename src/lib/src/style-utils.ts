import { ThemeConfig } from './theme/theme-config';

export interface TypographyConfig {
  fontSize: number;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase';
  gutterTop?: number;
  gutterBottom?: number;
}

export class LyStyleUtils {
  typography: {
    htmlFontSize: number,
    fontSize: number;
  };
  pxToRem(value: number) {
    const size = this.typography.fontSize / 14;
    return `${value / this.typography.htmlFontSize * size}rem`;
  }
  colorOf(value: string): string {
    return get(this, value);
  }
  rewrite(config: Partial<ThemeConfig>) {
    const ite = mergeDeep(this, config);
    console.log({ite});
  }
}

function get(obj: Object, path: any): string {
  const _path: string[] = path instanceof Array ? path : path.split(':');
  for (let i = 0; i < _path.length; i++) {
    obj = obj[_path[i]] || path;
  }
  return typeof obj === 'string' ? obj as string : obj['default'] as string;
}

export function eachMedia(str: string, fn: ((val: string, media: string, len: number) => void)) {
  const values = str.split(/\s/g);
  for (let index = 0; index < values.length; index++) {
    const valItem = values[index].split(/\@/g);
    const value = valItem.shift();
    const len = valItem.length;
    if (len) {
      for (let j = 0; j < len; j++) {
        fn.call(undefined, value, valItem[j], valItem.length);
      }
    } else {
      fn.call(undefined, value, undefined, len);
    }
  }
}

const isObject = obj => obj && typeof obj === 'object';

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param objects Objects to merge
 */
export function mergeDeep(...objects) {

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}
