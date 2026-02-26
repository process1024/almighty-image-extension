// import { Button, Checkbox } from "antd";
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { CheckOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons';

import AppContext from '../context';

import './index.less';

interface HeaderRightProps {
  all: number;
  selected: number;
  onSelectAll: (checked: boolean) => void;
  onClose: () => void;
}

export default function HeaderRight(props: HeaderRightProps) {
  const [config, setConfig] = useContext(AppContext);
  const [isDownloading, setIsDownloading] = useState(false);
  const { all, selected, onSelectAll } = props;
  // const { data: tagResult } = useRequest(async () => {
  //   const storage = new Storage();
  //   const user = await storage.get('user');

  //   const tagResult = await getTags({ urlname: user.urlname, sort: 'often' });

  //   tagResult.recent = tagResult?.recent.map((item) => item.tag_name) || [];

  //   return tagResult;
  // });

  const indeterminate = useMemo(() => {
    return !!(selected && all !== selected);
  }, [selected, all]);

  const checkAll = useMemo(() => {
    return !!(selected && selected === all);
  }, [selected, all]);

  const handleSelectAll = useCallback((checked: boolean) => {
    onSelectAll(checked);
  }, [onSelectAll]);

  const handleDownload = useCallback(async () => {
    if (!config.selectedImgs.length) return;

    setIsDownloading(true);

    try {
      const batchData = config.selectedImgs.map((img) => img.src);

      // 发送下载请求
      if (window.chrome?.runtime) {
        window.chrome.runtime.sendMessage({
          type: 'download',
          urls: batchData,
        });
      }

      // 显示成功提示
      console.log(`开始下载 ${config.selectedImgs.length} 张图片`);

      // 延迟关闭，给用户反馈时间
      setTimeout(() => {
        props.onClose && props.onClose();
      }, 1000);
    } catch (error) {
      console.error('下载失败:', error);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    }
  }, [config.selectedImgs, props.onClose]);

  return (
    <div className="header-right-container">
      <div className="selection-controls">
        <div className="selection-info">
          <span className="selected-count">
            已选择 <strong>{selected}</strong> / {all}
          </span>
        </div>

        <button
          className={`select-all-btn ${checkAll ? 'checked' : ''} ${indeterminate ? 'indeterminate' : ''}`}
          onClick={() => handleSelectAll(!checkAll)}
        >
          <div className="checkbox-icon">
            {checkAll ? (
              <CheckOutlined />
            ) : indeterminate ? (
              <div className="indeterminate-icon" />
            ) : null}
          </div>
          <span>全选</span>
        </button>
      </div>

      <div className="action-controls">
        <button
          className={`download-btn ${!config.selectedImgs.length ? 'disabled' : ''} ${isDownloading ? 'loading' : ''}`}
          onClick={handleDownload}
          disabled={!config.selectedImgs.length || isDownloading}
        >
          <div className="btn-icon">
            {isDownloading ? (
              <LoadingOutlined spin />
            ) : (
              <DownloadOutlined />
            )}
          </div>
          <span className="btn-text">
            {isDownloading ? '下载中...' : `下载 (${config.selectedImgs.length})`}
          </span>
        </button>
      </div>
    </div>
  );
}
