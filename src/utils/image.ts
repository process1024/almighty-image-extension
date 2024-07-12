import { replaceCdnUrl } from './util';

// 获取图片的原始宽高
export function getImgNaturalSize(el: HTMLImageElement) {
  const size = {
    width: 0,
    height: 0,
  };
  if (el.naturalWidth) {
    size.width = el.naturalWidth;
    size.height = el.naturalHeight;
  } else {
    const img = new Image();
    img.src = el.src;
    size.width = img.width;
    size.height = img.height;
  }
  if (size.width === 0 && size.height === 0) {
    if (el.width === 0 && el.height === 0) return size;
    size.width = el.width;
    size.height = el.height;
  }
  return size;
}

export function getElemSize(el: HTMLImageElement) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

// 判断图片地址是否能正常加载
export function getImageLoad(url: string) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function () {
      reject();
    };
  });
}

function isBase64(url: string) {
  return url.startsWith('data:');
}

const ALL_IMAGE_TYPE = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];

export function getImageType(url: string) {
  let imgType = 'jpg';
  if (isBase64(url)) {
    // data/image,或者data/img
    imgType = url.match('\\image/\\w+')
      ? url.match('\\image/\\w+')[0].split('/')[1]
      : url.match('\\img/\\w+')[0].split('/')[1];
  } else {
    const type = url.split('?')[0].split('.').pop();
    if (ALL_IMAGE_TYPE.includes(type)) {
      imgType = type;
    }
  }
  return imgType.toUpperCase();
}

/**
 * @function 获取图片元素 原图/当前渲染 的url、元素的背景图
 * @params img 支持三种类型
 * 1. 图片元素
 * 2. 普通元素
 * 3. 带有src 属性的对象
 * @params isAsync 是否支持异步
 */
export function getImageOriginUrl(
  img: HTMLImageElement | HTMLElement | Pick<HTMLImageElement, 'currentSrc' | 'src'>,
  { isAsync } = { isAsync: false },
): string | Promise<string> {
  const src = img.currentSrc || img.getAttribute('src');
  if (img.getAttribute('srcset') && img.currentSrc) {
    // 将srcset 值取出来并排序
    const t = /^-?\d+$/;
    const srcset = img.getAttribute('srcset');
    const handleSrcData = srcset.split(/,+/).map((curSrc) => {
      const srcData = {} as {
        url: string;
        width: number;
      };
      curSrc
        .trim()
        .split(/\s+/)
        .forEach((e, o) => {
          if (o === 0) {
            return (srcData.url = e);
          }
          const width = e.slice(0, -1);
          // 宽度单位
          const unitStr = e[e.length - 1];
          const unit = Number.parseInt(width, 10);
          // Number.parseFloat(n);
          if (unitStr === 'w' && t.test(width)) {
            unit > 0 && (srcData.width = unit);
          } else {
            unitStr === 'x' && t.test(width) && unit > 0 && (srcData.width = unit);
          }
        });

      return srcData;
    });
    const srcSort = handleSrcData
      .filter((e, index) => JSON.stringify(e) !== JSON.stringify(handleSrcData[index - 1]))
      .sort(function (a, b) {
        return a.width > b.width ? -1 : a.width < b.width ? 1 : 0;
      });
    if (srcSort.length > 0 && srcSort[0].url && srcSort[0].width > 0) {
      return handlePrefixUrl(srcSort[0].url);
    }
    return handlePrefixUrl(src);
  } else if (src) {
    return replaceCdnUrl(src, { isAsync });
  } else if (getComputedStyle(img).getPropertyValue('background-image') !== 'none') {
    const backgroundImage = getComputedStyle(img).getPropertyValue('background-image');
    return handlePrefixUrl(backgroundImage.replace(/.*url\(\"([^\)]+)\"\).*/gi, '$1'));
  }
  return '';
}

function handlePrefixUrl(url: string) {
  if (url.startsWith('//')) {
    return location.protocol + url;
  } else if (url.startsWith('/')) {
    return location.origin + url;
  }
  return url;
}
