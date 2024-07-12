import React from 'react';

import './index.less';

// import styleText from "data-text:./index.less"
import { useDebounceEffect } from 'ahooks';
// import type { PlasmoGetStyle } from 'plasmo';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { When } from 'react-if';

import Crosshair from '~components/Crosshair';
// import PinBtn from "~components/PinBtn";
import { Resizer } from '~components/Resizer';
import { captureSelect } from '~services/capture';
import { useMouseDrag, useMouseMove } from '~services/hooks';
// import { onFlashPin as flashPin, openPinModal, useLastBoard } from "~services/pin";
// import type { TrackerEvent } from "~services/tracker";
import { getMouseHoverElementPosition, TElementPosition } from '~utils/element';

// export const getStyle: PlasmoGetStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = styleText
//   return style
// }

interface IDrag {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Btns = ({ pinBtnStyle, onPin, onCancel, onFlashPin, flashBoard }) => {
  return (
    <div className="capture-annotate" style={pinBtnStyle}>
      <button className="cancel-btn" size="large" onClick={onCancel}>
        取消
      </button>
      <button className="cancel-btn" size="large" onClick={onCancel}>
        采集
      </button>
    </div>
  );
};

function ElementInspector({ sharp, onClick }: { sharp: TElementPosition; onClick: Function }) {
  if (sharp) {
    return (
      <div
        className="capture-element-inspector"
        onMouseUp={onClick}
        style={{
          width: sharp.right - sharp.left + 'px',
          height: sharp.bottom - sharp.top + 'px',
          left: sharp.left,
          top: sharp.top,
        }}></div>
    );
  }
}

const Capture = ({ onCancel }: { onCancel: () => void }) => {
  const maskRef = useRef<HTMLElement>();
  const parentRef = useRef<HTMLElement>();
  const [hidden, setHidden] = useState(false);
  // const board = useLastBoard();
  const [inspectorInfo, setInspectorInfo] = useState<TElementPosition>();

  const { axis, moving } = useMouseMove(maskRef);

  const { position, dragging, setPosition } = useMouseDrag(maskRef);

  const scrollHeight = document.documentElement.scrollHeight;

  // FIX: 拖拽框太小的情况下，强制10 X 10
  useEffect(() => {
    if (!dragging) {
      const { start, end } = position;
      if (start.x - end.x > 0 && start.x - end.x < 10) {
        position.end.x = start.x - 10;
      } else if (start.x - end.x < 0 && start.x - end.x > -10) {
        position.end.x = start.x + 10;
      }

      if (start.y - end.y > 0 && start.y - end.y < 10) {
        position.end.y = start.y + 10;
      } else if (start.y - end.y < 0 && start.y - end.y > -10) {
        position.end.y = start.y - 10;
      }
      setPosition({ ...position });
    }
  }, [dragging]);

  const resizeProps = useMemo(() => {
    const { start, end } = position;
    return {
      position: {
        x: start.x < end.x ? start.x : end.x,
        y: start.y < end.y ? start.y : end.y,
      },
      size: {
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
      },
    };
  }, [position]);

  const hasCapture = useMemo(() => {
    const { start, end } = position;
    return !!(Math.abs(start.x - end.x) > 0 || Math.abs(start.y - end.y) > 0);
  }, [resizeProps]);

  const onDragStop = (e: IDrag) => {
    setPosition({
      start: {
        x: e.x,
        y: e.y,
      },
      end: {
        x: e.x + e.width,
        y: e.y + e.height,
      },
    });
  };

  function resetPosition() {
    setPosition({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    });
  }

  function inspectorClick() {
    const { left, top, right, bottom } = inspectorInfo;
    setPosition({
      start: {
        x: left,
        y: top,
      },
      end: {
        x: right,
        y: bottom,
      },
    });
    clearInspectorInfo();
  }

  function clearInspectorInfo() {
    setInspectorInfo(null);
  }

  function getHoverElement({ x, y }: typeof axis) {
    const eleInfo = getMouseHoverElementPosition({ x, y });
    if (eleInfo) {
      setInspectorInfo(eleInfo);
    }
  }

  const handleGetHoverElement = useCallback(() => {
    if (!dragging) {
      getHoverElement(axis);
    } else {
      clearInspectorInfo();
    }
  }, [axis, dragging, hasCapture]);

  useDebounceEffect(handleGetHoverElement, [axis], {
    wait: 10,
  });

  useEffect(() => {
    // tracker.captureDialogExpose();
    resetPosition();
  }, []);

  // 获取登录状态 -> 判断是否需要滚动 -> 截图 -> 采集
  const onPin = async () => {
    setHidden(true);
    const result = await captureSelect(position);
    console.log(result);
    // openPinModal({ img_url: result }, "截图采集");
    onCancel();
  };

  const onFlashPin = async () => {
    setHidden(true);
    // const result = await captureSelect(position);
    // flashPin({
    //   img_url: result,
    //   text: document.title,
    //   link: window.location.href,
    //   board_id: board.board_id
    // });
    onCancel();
  };

  const btnSize = {
    width: 135,
    height: 40,
  };

  function renderBtn(props) {
    const { offset } = props;
    const { start, end } = position;
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    let pinBtnStyle = {};
    // 选择区域到页面底部 和 选择区域底部不在当前可视区域时
    // 12为间距大小
    if (
      start.y + offset.y + resizeProps.size.height + btnSize.height + 12 >= scrollHeight ||
      end.y + offset.y + btnSize.height + 12 > scrollTop + clientHeight
    ) {
      pinBtnStyle = {
        position: 'fixed',
        bottom: '8px',
        left: end.x + offset.x - btnSize.width - 8 + 'px',
      };
    } else {
      pinBtnStyle = {
        position: 'absolute',
        bottom: '-52px',
        right: 0,
      };
    }

    return (
      <When condition={!dragging && hasCapture}>
        {/* <button>采集按钮</button> */}
        <Btns pinBtnStyle={pinBtnStyle} onPin={onPin} onFlashPin={onFlashPin} onCancel={onCancel} />
        {/* flashBoard={board.title} */}
      </When>
    );
  }

  return (
    <When condition={!hidden}>
      <div ref={parentRef} onClick={(e) => e.preventDefault()}>
        <div
          id="mask"
          className="capture-mask"
          style={{
            height: scrollHeight + 'px',
          }}
          onClick={(e) => e.preventDefault()}
          ref={maskRef}>
          <When condition={moving}>
            <Crosshair x={axis.x} y={axis.y} />
          </When>
          <ElementInspector sharp={inspectorInfo} onClick={inspectorClick} />
        </div>
        <Resizer
          position={resizeProps.position}
          size={resizeProps.size}
          onDragStop={onDragStop}
          container={parentRef}
          style={{
            pointerEvents: dragging ? 'none' : 'auto',
          }}>
          {/* <div>x1: {position.start.x}</div>
              <div>y1: {position.start.y}</div>
              <div>x2: {position.end.x}</div>
              <div>y2: {position.end.y}</div> */}
          {renderBtn}
        </Resizer>
      </div>
    </When>
  );
};

export default Capture;
