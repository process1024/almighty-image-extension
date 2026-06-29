import { uniqWith } from 'lodash-es';
import { useEffect, useState } from 'react';

// import { pinMessage } from "~components/Message";
import { isSortByRender, MAX_BATCH_IMG } from '~services/config';
import { getImgElTitle } from '~services/pin';
import { getImageOriginUrl, getImageType, getImgNaturalSize } from '~utils/image';
import { fetchContentType, replaceCdnUrl } from '~utils/util';

import type { ImageType } from '../context';

// 过滤小图片
function filterSize(img: HTMLImageElement | Element) {
  const { width, height } = img instanceof HTMLImageElement
    ? getImgNaturalSize(img)
    : img.getBoundingClientRect();

  return width > 45 && height > 45;
}

export const CHECKTYPE = {
  UNCHECK: 'uncheck', // 未选中
  CHECK: 'check', // 选中
  TEMPORARYCHECKED: 'temporaryCheck', // 临时选中
  TEMPORARYUNCHECKED: 'temporaryUnCheck', // 临时不选中
} as const;

type CheckValue = (typeof CHECKTYPE)[keyof typeof CHECKTYPE];

export interface ISelectedImg extends ImageType {
  checked: CheckValue;
}

type BatchPinConfig = ReturnType<typeof import('../context').initialState>;

function toSelectedImage(img: ImageType, checked: CheckValue = CHECKTYPE.UNCHECK): ISelectedImg {
  return {
    ...img,
    checked,
  };
}

export function useBatchPin(config: BatchPinConfig) {
  const [loading, setLoading] = useState(true);
  const [imageEles, setImageEles] = useState<ImageType[]>([]);
  const [filterImgs, setFilterImgs] = useState<ISelectedImg[]>([]);

  useEffect(() => {
    const filterImage = imageEles
      .filter((img) => {
        if (config.minHeight > img.height) {
          return false;
        }
        if (config.minWidth > img.width) {
          return false;
        }
        if (config.format !== 'all' && config.format !== img.fileType) {
          return false;
        }
        return true;
      })
      .map((img) => {
        const checked = filterImgs.find((i) => i.src === img.src)?.checked ?? CHECKTYPE.UNCHECK;
        return {
          ...img,
          checked,
        };
      });
    setFilterImgs(filterImage);
  }, [imageEles, config.format, config.minWidth, config.minHeight]);

  useEffect(() => {
    const images = document.images;
    const imagesArr = Array.from(images);

    let result: ImageType[] = (uniqWith(imagesArr, isSomeImage) as HTMLImageElement[])
      .filter((img) => filterSize(img))
      .map((img) => {
        // FIX: getComputedStyle(img).getPropertyValue("src")，解决src为空浏览器返回当前地址的问题
        const url = img.currentSrc || getComputedStyle(img).getPropertyValue('src');
        const image: ImageType = {
          alt: getImgElTitle(img),
          src: getImageOriginUrl(img) as string,
          renderSrc: url,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          fileType: getImageType(url) || '',
          img,
        };
        return image;
      })
      .filter((img) => filterType(img));
    // 处理 获取原图需要异步的情况
    Promise.all(
      result.map(async (img) => {
        return {
          ...img,
          src: await replaceCdnUrl(img.src, { isAsync: true }),
        };
      }),
    );
    // console.time();
    // 背景图 类型的元素
    const bgImgs = getPageBackgroundImages(update).filter((img) => filterType(img));
    // .filter((img) => filterSize(img));
    // console.timeEnd();

    result.push(...bgImgs);

    const videoImgs = getPageVideoImages();
    result.push(...videoImgs);

    function update() {
      setImageEles([...result]);
    }

    function isSomeImage(a: HTMLImageElement, b: HTMLImageElement) {
      return a.currentSrc === b.currentSrc;
    }

    function filterType(img: ImageType, type = 'svg') {
      return !img.fileType.includes(type) && img.renderSrc;
    }

    // 过滤属性huaban = nopin 的图片
    // function filterNoPin(img) {
    //   return img.getAttribute('huaban') !== 'nopin';
    // }

    if (isSortByRender()) {
      result = result.sort((a, b) =>
        (b.img?.height ?? b.height) * (b.img?.width ?? b.width)
        - (a.img?.height ?? a.height) * (a.img?.width ?? a.width),
      );
    }

    // 再次去重
    result = uniqWith(result, (a: ImageType, b: ImageType) => a.src === b.src) as ImageType[];

    setImageEles([...result]);

    // 对拿不到后缀名的，通过fetch请求拿到content-type
    const promiseAll = [];
    for (const img of result) {
      if (!img.fileType) {
        promiseAll.push(
          new Promise((resolve) => {
            fetchContentType(img.src)
              .then((res) => {
                img.fileType = res;
                resolve(1);
              })
              .catch(() => {});
          }),
        );
      }
    }
    if (promiseAll.length) {
      Promise.all(promiseAll).then(() => {
        // console.log("then all");
        setImageEles([...result]);
      });
    }

    // result.forEach((img) => {
    //   if (img.src !== img.renderSrc) {
    //     const image = new Image();
    //     image.src = img.src;
    //     image.onload = (e) => {
    //       console.log(img, "img load");
    //       const { width, height } = e.target;
    //       img.width = width;
    //       img.height = height;
    //     };
    //     image.onerror = (e) => {
    //       console.log(e, "onerror");
    //     };
    //   }
    // });

    const filterResult = result.filter((img) => {
      if (config.minHeight > img.height) {
        return false;
      }
      if (config.minWidth > img.width) {
        return false;
      }
      return true;
    });

    const selectedFilterResult = filterResult.map((img) => toSelectedImage(img));
    setFilterImgs(selectedFilterResult);
    config.filterImgs = selectedFilterResult;

    setLoading(false);

    // 禁止页面滚动
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = '.tutu-no-scroll{ overflow: hidden }';
    document.head.appendChild(styleElement);
    document.documentElement.classList.add('tutu-no-scroll');

    return () => {
      document.documentElement.classList.remove('tutu-no-scroll');
      document.head.removeChild(styleElement);
    };
  }, []);

  function addSelectImg(img: ImageType) {
    setFilterImgs(
      filterImgs.map((item) => {
        return {
          ...item,
          checked: item.src === img.src ? CHECKTYPE.CHECK : item.checked,
        };
      }),
    );
  }

  function removeSelectImg(img: ImageType) {
    setFilterImgs(
      filterImgs.map((item) => {
        return {
          ...item,
          checked: item.src === img.src ? CHECKTYPE.UNCHECK : item.checked,
        };
      }),
    );
  }

  function clearSelected() {
    setFilterImgs(
      filterImgs.map((item) => {
        return {
          ...item,
          checked: CHECKTYPE.UNCHECK,
        };
      }),
    );
  }

  function selectAll(e: boolean) {
    if (!e || filterImgs.length <= MAX_BATCH_IMG) {
      setFilterImgs(
        filterImgs.map((item) => {
          return {
            ...item,
            checked: e ? CHECKTYPE.CHECK : CHECKTYPE.UNCHECK,
          };
        }),
      );
    } else {
      setFilterImgs(
        filterImgs.map((item, index) => {
          return {
            ...item,
            checked: index >= MAX_BATCH_IMG ? CHECKTYPE.UNCHECK : CHECKTYPE.CHECK,
          };
        }),
      );
      // pinMessage.open("fail", `最多选择${MAX_BATCH_IMG}张`);
    }
  }

  function toggleSelected(e: boolean, img: ImageType) {
    if (e) {
      const selectedLength = filterImgs.filter((item) => item.checked === CHECKTYPE.CHECK).length;
      if (selectedLength === MAX_BATCH_IMG) {
        console.warn(`最多选择${MAX_BATCH_IMG}张`);
        return;
      }
      addSelectImg(img);
    } else {
      removeSelectImg(img);
    }
  }

  return {
    imageEles,
    filterImgs,
    setFilterImgs,
    addSelectImg,
    removeSelectImg,
    clearSelected,
    selectAll,
    toggleSelected,
    loading,
  };
}

// 获取页面元素的背景图并返回 imgs 标签集合
function getPageBackgroundImages(updateCb: () => void) {
  const allEl = document.body.getElementsByTagName('*');
  const imgs = [] as ImageType[];
  const selectedText = (
    `${window.getSelection ? window.getSelection() : document.getSelection()}`
  ).replace(/(^\s+|\s+$)/g, '');
  const length = allEl.length;
  for (let i = 1; i < length; i++) {
    const el = allEl[i];
    if (!el) {
      continue;
    }

    if (['IMG', 'HEAD', 'SCRIPT', 'LINK', 'STYLE', 'META'].includes(el.tagName)) continue;
    let src = getComputedStyle(el).getPropertyValue('background-image');
    if (src !== 'none' && src.indexOf('gradient') === -1 && filterSize(el)) {
      src = src.replace(/.*url\("([^")]+)"\).*/gi, '$1');
      const img = new Image();
      img.src = src;
      const width = img.width;
      const height = img.height;
      const htmlEl = el as HTMLElement & { alt?: string; title?: string };
      const result = {
        fileType: getImageType(src),
        alt: selectedText || htmlEl.alt || htmlEl.title || document.title,
        width,
        height,
        src,
        renderSrc: src,
        img,
      };

      if (width === 0) {
        img.onload = function () {
          result.width = img.width;
          result.height = img.height;
          updateCb();
        };
      }

      imgs.push(result);
    }
  }
  return imgs;
}

// 获取页面的 video 标签并返回 imgs 标签集合
function getPageVideoImages() {
  const videos = document.querySelectorAll('video');
  const imgs = [] as ImageType[];
  videos.forEach((video) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/png', 1);
      const result = {
        fileType: 'png',
        alt: document.title,
        width: canvas.width,
        height: canvas.height,
        src: base64,
        renderSrc: base64,
      };
      imgs.push(result);
    } catch (err) {
      console.error(err);
    }
  });

  return imgs;
}
