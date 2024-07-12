// 限制最大的采集数量
export const MAX_BATCH_IMG = 100;
// 采集图片大小限制，最大20m
export const MAC_IMG_SIZE = 20;
// 滚动截图 分页数限制
export const CAPTURE_LIMIT = 20;

export const globalConfig = {
  latestVersion: '2.0.8',
  // hover图片的大小限制
  imageMinWidth: 150,
  imageMinHeight: 150,
  elemMinWidth: 150,
  elemMinHeight: 150,
  // 按钮偏移
  btnPosition: {
    x: 12,
    y: 12,
  },
  // 批量采集的图片限制
  batchPin: {
    minHeight: 100,
    minWidth: 100,
  },
  block: ['*://www.zcool.com.cn/*', '*://*.huaban.com/*'],
  btnPositions: [
    {
      rule: [/behance.net/],
      btnPosition: '12, 40',
    },
  ],
  background: 'https://grocery-cdn.huaban.com/file/a8ab2fa0-4df9-11ed-9568-6da6a93f31f3.png',
  backgroundJump: 'https://www.huaban.com',
  backgroundMark: '',
  backgroundMarkJump: '',
  sortImgByRenderSize: [/behance.net/],
  // 需要通过图片定位判断hover的站点
  hoverImgPositionSite: [] as { domain: string }[],
  // 需要通过图片定位判断hover的站点
  pinBtnDelaySite: [] as RegExp[],
};

// 获取当前页面的按钮位置配置，
export function getBtnPositionOffset() {
  for (let index = 0; index < globalConfig.btnPositions.length; index++) {
    const positionRule = globalConfig.btnPositions[index];
    let result: typeof globalConfig.btnPosition = null;
    positionRule.rule.forEach((siteRule) => {
      if (siteRule.test(window.location.origin)) {
        const [x, y] = positionRule.btnPosition.split(',');
        result = { x: +x, y: +y };
        return;
      }
    });
    if (result) {
      return result;
    }
  }
  return globalConfig.btnPosition;
}

// 当前网站是否 要按照图片渲染大小排序
export function isSortByRender() {
  for (let index = 0; index < globalConfig.sortImgByRenderSize.length; index++) {
    if (globalConfig.sortImgByRenderSize[index].test(window.location.origin)) {
      return true;
    }
  }
}
