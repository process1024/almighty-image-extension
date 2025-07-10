import React from 'react';

import './index.less';

import { sendCurrentTabMessage } from '~services/message';

function Popup() {
  const handleBatchPin = () => {
    sendCurrentTabMessage({ type: 'batchPin' });
    window.close();
  };

  const handleSelectCapture = () => {
    sendCurrentTabMessage({ type: 'showSelectCapture' });
    window.close();
  };

  const handleCaptureCurrent = () => {
    sendCurrentTabMessage({ type: 'captureCurrent' });
    window.close();
  };

  const handleCaptureFullPage = () => {
    sendCurrentTabMessage({ type: 'captureFullPage' });
    window.close();
  };

  return (
    <div className="popup">
      <div className="section">
        <div className="title">图片管理</div>
        <button className="btn" onClick={handleBatchPin}>
          <div className="select-pic-icon icon" />
          <span>批量选择下载</span>
        </button>
      </div>
      
      <div className="section">
        <div className="title">屏幕截图</div>
        <div className="capture-btn-wrap">
          <button className="btn" onClick={handleSelectCapture}>
            <div className="select-icon icon" />
            <span>选定区域截图</span>
          </button>
          <button className="btn" onClick={handleCaptureCurrent}>
            <div className="current-icon icon" />
            <span>可视区域截图</span>
          </button>
          <button className="btn" onClick={handleCaptureFullPage}>
            <div className="full-icon icon" />
            <span>整页截图</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
