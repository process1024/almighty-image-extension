// import { Button, Checkbox } from "antd";
import React, { useCallback, useContext, useMemo, useState } from 'react';

import AppContext from '../context';

import './index.less';

interface HeaderRightProps {
  all: number;
  selected: number;
  onSelectAll: Function;
  onClose: Function;
  // tracker: TrackerEvent;
}

export default function HeaderRight(props: HeaderRightProps) {
  const [config, setConfig] = useContext(AppContext);
  // const [loginStatus] = useLoginStatus();
  // const [boardId, setBoardId] = useState(null);
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

  function onAllChange(e) {
    onSelectAll(e.target.checked);

    tracker.batchPinClickBottom('全选');
  }

  function onTagChange(e) {
    config.tags = e;
    setConfig({ ...config });
  }

  async function pin() {
    const batchData = config.selectedImgs.map((img) => img.src)

    chrome.runtime.sendMessage({ type: "download", urls: batchData });

    props.onClose && props.onClose();
  }

  // const selectProps = {
  //   size: 'large',
  //   getPopupContainer: () =>
  //     document.getElementById('huaban-pin-shadow').shadowRoot.querySelector('.batch-pin-container'),
  //   style: { width: '160px' },
  //   placement: 'bottomLeft',
  //   className: 'batch-pin-hd-right-select',
  // };

  return (
    <div className="batch-pin-hd-right">
      <div className="no-margin-right">
        {/* indeterminate={indeterminate} */}
        <div>全选按钮</div>
        {/* <input
          type="checkbox"
          className="batch-pin-hd-right-check_btn"
          checked={checkAll}
          onChange={onAllChange}>
          <span className="batch-pin-hd-right-text">全选</span>
        </input> */}
      </div>

      <button
        onClick={() => pin()}
        disabled={!config.selectedImgs.length}
        className="batch-pin-hd-right-btn custom-btn btn-4">
          <span>
          采下来({config.selectedImgs.length})
          </span>
        
      </button>
    </div>
  );
}
