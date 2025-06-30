import React from 'react';

import './index.less';

import { sendCurrentTabMessage } from '~services/message';

function Popup() {
  function showBatchPin() {
    // window.open('/tabs/edit.html');
    sendCurrentTabMessage({ type: 'batchPin' });
  }
  function showSelectCapture() {
    sendCurrentTabMessage({ type: 'showSelectCapture' });
    window.close();
  }

  function captureCurrent() {
    sendCurrentTabMessage({ type: 'captureCurrent' });
    window.close();
  }

  function captureFullPage() {
    sendCurrentTabMessage({ type: 'captureFullPage' });
    window.close();
  }

  return (
    <div className="popup">
      <div className="title">图片下载</div>
      <div className="btn" onClick={showBatchPin}>
        <div className="select-pic-icon icon" />
        批量下载
      </div>
      <div className="title">截图</div>
      <div className="capture-btn-wrap">
        <button className="btn" onClick={showSelectCapture}>
          <div className="select-icon icon"></div>
          <div>选定区域截图</div>
        </button>
        <button className="btn" onClick={captureCurrent}>
          <div className="current-icon icon"></div>
          <div>可视区域截图</div>
        </button>
        <button className="btn" onClick={captureFullPage}>
          <div className="full-icon icon"></div>
          <div>整页截图</div>
        </button>
      </div>
    </div>
  );
}

export default Popup;
