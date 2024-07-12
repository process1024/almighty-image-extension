import styleText from 'data-text:./styles/content/index.less';
import React, { useEffect, useState } from 'react';
import { When } from 'react-if';

import BatchPin from '~components/BatchPin';
import Capture from '~components/Capture';
import captureService from '~services/capture';

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = styleText;
  return style;
};

function IndexContent() {
  const [contentUiType, setContentUiType] = useState('');

  useEffect(() => {
    const listenerEventMap = {
      batchPin: function () {
        setContentUiType('batchPin');
      },
      showSelectCapture: function () {
        setContentUiType('capture');
      },
      captureCurrent: function () {
        // 添加setTimeout 是因为等待一下message的关闭，避免截图到message
        setTimeout(() => {
          captureService.captureCurrent();
        }, 300);
      },
      captureFullPage: function () {
        captureService.captureFullPage();
      },
    };

    const messageListener = (request) => {
      console.log(request);
      listenerEventMap[request.type] && listenerEventMap[request.type](request);
    };

    chrome.runtime.onMessage.addListener(messageListener);
  }, []);

  return (
    <div>
      <When condition={contentUiType === 'capture'}>
        <Capture onCancel={() => setContentUiType('default')} />
      </When>

      <When condition={contentUiType === 'batchPin'}>
        <BatchPin onClose={() => setContentUiType('default')} />
      </When>
    </div>
  );
}

export default IndexContent;
