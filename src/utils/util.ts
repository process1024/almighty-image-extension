import { isBase64 } from './base64';
import { cdnRule } from './cdnRule';

export function uniqArray<T>(arr: T[]) {
  return [...new Set(arr)];
}

type PipeFn = (...args: unknown[]) => unknown;

// 管道组合函数，函数从左至右执行
export const pipe
  = (...fns: PipeFn[]) =>
    (...args: unknown[]) => {
      return fns.reduce<unknown>((acc, fn) => {
        if (Array.isArray(acc)) {
          return fn(...acc);
        }

        return fn(acc);
      }, args);
    };

export function testURLMatches(url: string, matches: string[]) {
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    if (!match) {
      continue;
    }

    const r = new RegExp(`^${match.replace(/\*/g, '.*')}$`);
    if (r.test(url)) {
      return true;
    }
  }
  return false;
}

export function isWebUrl(url: string) {
  return url.startsWith('http');
}

export function getDomainByUrl(url: string) {
  try {
    return url.split('/')[2] || '';
  } catch {
    return '';
  }
}

export function sleep(time = 300) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 获取文件返回类型
// TODO: 跨域情况
export function fetchContentType(url: string) {
  return fetch(url).then((res) => {
    const contentType = res.headers.get('content-type');
    return contentType?.split('/')[1]?.match(/\b([a-z]+)/g)?.[0] ?? '';
  });
}

export function parseJwt(e: string) {
  const t = (e.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/'),
    r = decodeURIComponent(
      atob(t)
        .split('')
        .map(function (e) {
          return `%${(`00${e.charCodeAt(0).toString(16)}`).slice(-2)}`;
        })
        .join(''),
    );
  return JSON.parse(r);
}

/**
 * isAsync 是否支持异步
 **/
export function replaceCdnUrl(url: string, { isAsync } = { isAsync: false }) {
  if (isBase64(url)) return url;
  if (cdnRule && cdnRule.rules) {
    for (let t = 0; t < cdnRule.rules.length; t++)
      try {
        const r = cdnRule.rules[t];
        if (!r) {
          continue;
        }

        const n = r.urlPattern;
        if (RegExp(n).test(url)) {
          if (r.replace) {
            return r.replace(url) ?? url;
          }

          return isAsync && r.replaceAsync
            ? r.replaceAsync(url).then((nextUrl) => nextUrl ?? url)
            : url;
        }
      } catch (t) {
        return url;
      }
    return url;
  }

  return url;
}

/** 返回时差，单位小时 */
export function getTime2now(dateStart: number) {
  return (new Date().getTime() - new Date(dateStart).getTime()) / 60000 / 60;
}
