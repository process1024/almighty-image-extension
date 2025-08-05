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

  const handleImageProcess = () => {
    // @ts-expect-error - Chrome extension API
    const url = chrome.runtime.getURL('tabs/process.html');
    // @ts-expect-error - Chrome extension API
    chrome.tabs.create({ url });
    window.close();
  };

  const handleOpenWebsite = () => {
    // @ts-expect-error - Chrome extension API
    chrome.tabs.create({ url: 'https://process1024.github.io/almighty-image-extension/' });
    window.close();
  };

  const handleFeedback = () => {
    // @ts-expect-error - Chrome extension API
    chrome.tabs.create({
      url: 'https://eip93iabdv.feishu.cn/wiki/ZEoxwTLw7ivucgkzetqcaCZsn2e?from=from_copylink',
    });
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
        <button className="btn" onClick={handleImageProcess}>
          <div className="process-icon icon" />
          <span>图片处理工具</span>
        </button>
      </div>

      <div className="section">
        <div className="title">屏幕截图</div>
        <div className="capture-btn-wrap">
          <button className="btn" onClick={handleSelectCapture}>
            <div className="select-icon icon" />
            <span>选定区域</span>
          </button>
          <button className="btn" onClick={handleCaptureCurrent}>
            <div className="current-icon icon" />
            <span>可视区域</span>
          </button>
          <button className="btn" onClick={handleCaptureFullPage}>
            <div className="full-icon icon" />
            <span>整页截图</span>
          </button>
        </div>
      </div>

      <div className="footer">
        <div className="footer-links">
          <button className="link-btn" onClick={handleOpenWebsite}>
            <div className="website-icon icon" />
            <span>官方网站</span>
          </button>
          <button className="link-btn" onClick={handleFeedback}>
            <div className="feedback-icon icon" />
            <span>问题反馈</span>
          </button>
        </div>
        <div className="footer-text">更多功能敬请期待</div>
      </div>
    </div>
  );
}

export default Popup;
