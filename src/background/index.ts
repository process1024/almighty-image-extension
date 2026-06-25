import type { RuntimeMessage } from '~shared/chrome/messages';
import tabHelper from '~services/tabHelper';
import { batchDownloadImages, getImageType } from '~utils/image';

export default {};

// const cache = {};

const listener = (
  request: RuntimeMessage,
  _sender: chrome.runtime.MessageSender,
  response: (response?: unknown) => void,
) => {
  switch (request.type) {
  // 用于通用通信
  // { type: "event", data: ... }
  case 'event': {
    tabHelper.getActiveTab(true).then((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, request, response);
      }
    });
    return true;
  }
  case 'download': {
    batchDownloadImages(request.urls);
    return true;
  }
  case 'open': {
    tabHelper.createTab(request.url);
    return true;
  }
  case 'storage': {
    const { key, data } = request.data;
    chrome.storage.local.set({ [key]: data }, function () {
      response({});
    });
    return true;
  }
  // 用户获取base64图片
  // { type: "base64", url: ... }
  case 'base64': {
    fetch(request.url, {})
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        }

        response({
          errCode: 2,
          err: true,
          msg: '图片获取失败',
        });
        throw new Error('图片获取失败');
      })
      .then((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            if (typeof reader.result !== 'string') {
              response({
                errCode: 2,
                err: true,
                msg: '图片读取失败',
              });
              return;
            }

            // FIX: 修复图片文件 content-type 返回不是图片类型，例如返回文件流类型
            if (!blob.type.startsWith('image/')) {
              response(reader.result.replace(/data:.*;/, `data:image/${getImageType(request.url)};`));
            } else {
              response(reader.result);
            }
          };
        } else {
          response({
            errCode: 2,
            err: true,
            msg: '图片获取失败',
          });
        }
      })
      .catch(() => {
        response({
          errCode: 2,
          err: true,
          msg: '图片获取失败',
        });
      });
    return true;
  }

  case 'getActiveTab': {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      response(activeTab);
    });

    return true;
  }

  case 'getCapture': {
    chrome.windows.getCurrent(function (win) {
      if (!win.id) {
        response({
          errCode: 2,
          err: true,
          msg: '窗口获取失败',
        });
        return;
      }

      chrome.tabs.captureVisibleTab(win.id, { format: 'jpeg', quality: 100 }, (image: string) => {
        response(image);
      });
    });

    return true;
  }
  default: {
    response(false);
    break;
  }
  }
  return true;
};

chrome.runtime.onMessage.addListener(listener);

console.log(listener);
