import { useMount, useRequest } from 'ahooks';
// import { Button, Checkbox } from "antd";
import selectArrowDownSvg from 'data-base64:~assets/select-arrow-down.svg';
// import addSvg from "data-base64:~assets/add-gray.svg";
import React, { useCallback, useContext, useMemo, useState } from 'react';

// import { Storage } from '@plasmohq/storage';

// import BoardSelect from "~components/BoardSelect";
// import HBTagInput from "~components/HBTagInput";
// import { EVENT } from '~constants/event';
// import { getTags } from '~services';
// import { getIsLogin } from '~services/login';
// import type { TrackerEvent } from "~services/tracker";
// import Event from '~utils/event';

import AppContext from '../context';

import './index.less';

// import { useLoginStatus } from '~services/login';

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
  const [boardId, setBoardId] = useState(null);
  const { all, selected, onSelectAll, tracker } = props;
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

  const onBoardChange = useCallback(
    (e) => {
      setBoardId(e);
      if (JSON.stringify(e) === JSON.stringify(boardId)) return;
      // 第一次初始化值时 不触发埋点
      if (boardId === null) return;
      // tracker.batchPinClickBottom('画板选择框');
    },
    [config],
  );

  async function pin(id?) {
    // const isLogin = await getIsLogin();
    // if (!isLogin) return;
    config.boardId = id ? id : boardId;
    setConfig({ ...config });
    const batchData = {
      boardId: config.boardId,
      tags: config.tags,
      imgs: config.selectedImgs.map((img) => {
        return {
          src: img.src,
          alt: img.alt,
          height: img.height,
          width: img.width,
        };
      }),
      link: window.location.href,
    };

    props.onClose && props.onClose();

    // Event.dispatch(EVENT.BATCH_UPLOAD_MODAL_OPEN, batchData);
    // tracker.batchPinClickBottom('采下来');
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

      {/* <HBTagInput
        {...selectProps}
        suggestVisible={false}
        className="hbTagInput"
        // suggestTags={tagResult?.recent}
        allTags={tagResult?.tags}
        suffixIcon={<img src={selectArrowDownSvg} className="selectArrow" />}
        tags={config.tags}
        allowClear
        placeholder={"标签"}
        onChange={onTagChange}
        dropdownMatchSelectWidth={360}
      /> */}
      {/* <BoardSelect
        disabled={!loginStatus}
        disablePin={!config.selectedImgs.length}
        selectFirst={true}
        {...selectProps}
        onChange={onBoardChange}
        onPin={pin}
        placeholder="选择画板"
      /> */}
      <button
        onClick={() => pin()}
        disabled={!config.selectedImgs.length || !boardId}
        className="batch-pin-hd-right-btn">
        采下来({config.selectedImgs.length})
      </button>
    </div>
  );
}
