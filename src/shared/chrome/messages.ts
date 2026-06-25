export type ContentMessage =
  | { type: 'batchPin' }
  | { type: 'showSelectCapture' }
  | { type: 'captureCurrent' }
  | { type: 'captureFullPage' };

export type RuntimeMessage =
  | { type: 'event'; data?: unknown }
  | { type: 'download'; urls: string[]; format?: string }
  | { type: 'open'; url: string }
  | { type: 'storage'; data: { key: string; data: unknown } }
  | { type: 'base64'; url: string }
  | { type: 'getActiveTab' }
  | { type: 'getCapture' };

export type ExtensionMessage = ContentMessage | RuntimeMessage;

export function sendRuntimeMessage<TResponse = unknown>(
  payload: RuntimeMessage,
): Promise<TResponse> {
  return new Promise<TResponse>((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(payload, (data: TResponse) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(lastError);
          return;
        }

        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendMessageToActiveTab(payload: ContentMessage): Promise<void> {
  const tab = await getActiveTab(true);

  if (!tab.id) {
    throw new Error('Active tab has no id');
  }

  await chrome.tabs.sendMessage(tab.id, payload);
}

export function getActiveTab(isBackgroundScript?: boolean): Promise<chrome.tabs.Tab> {
  if (isBackgroundScript) {
    return queryActiveTab();
  }

  return sendRuntimeMessage<chrome.tabs.Tab>({ type: 'getActiveTab' });
}

export async function queryActiveTab(): Promise<chrome.tabs.Tab> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab) {
    throw new Error('No active tab found');
  }

  return activeTab;
}

export function createTab(url: string): Promise<chrome.tabs.Tab> {
  return chrome.tabs.create({ url });
}

export function updateTab(url: string): Promise<chrome.tabs.Tab> {
  return chrome.tabs.update({ url });
}

export function getExtensionUrl(path: string): string {
  return chrome.runtime.getURL(path);
}
