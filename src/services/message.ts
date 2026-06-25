import {
  sendMessageToActiveTab,
  sendRuntimeMessage,
  type ContentMessage,
  type RuntimeMessage,
} from '~shared/chrome/messages';

// chrome.runtime.sendMessage 转为 promise 用法
export function sendMessageByPromise<T>(payload: RuntimeMessage) {
  return sendRuntimeMessage<T>(payload);
}

export async function sendCurrentTabMessage(payload: ContentMessage) {
  return sendMessageToActiveTab(payload);
}
