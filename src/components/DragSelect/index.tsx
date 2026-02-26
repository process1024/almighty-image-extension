import { useEventListener } from 'ahooks';
import classNames from 'classnames';
import React, { memo, useRef, useState } from 'react';
import Selecto from 'react-selecto';

import './index.less';

/**
 * 主要是用来实现瀑布流的框选功能，如果不是瀑布流的场景可直接使用Selecto组件
 */
export default memo(function DragSelect(props) {
  const {
    masonryRef,
    dragCallback,
    dragEndCallback,
    container = document.body,
    dragCondition = () => true,
  } = props;
  const [showMask, setShowMask] = useState(false);
  // 用来判断用户有没有按下shift ，判断正选反选
  const [shiftKey, setShiftKey] = useState(false);
  const scrollWidth = 16;
  useEventListener(
    'scroll',
    () => {
      selectoRef?.current?.checkScroll();
    },
    {
      target: container,
    },
  );
  const selectoRef = useRef(null);
  const onDragStart = (e) => {
    setShiftKey(e.inputEvent.shiftKey);
  };
  const onDrag = (e) => {
    // 选中的id
    const chooseMap = {};
    // 浏览器往下滚动的距离
    const documentScrollTop = container.scrollTop;
    let { top: selectTop, height: selectHeight, left: selectLeft, right: selectRight } = e.rect;
    selectTop = selectTop + documentScrollTop;
    const selectBottom = selectTop + selectHeight;
    // 避免用户误操作 只有当拖拽框的top和bottom 或者 left 和right 差距2px时候才往下执行
    if (selectBottom - selectTop < 2 && selectRight - selectLeft < 2) {
      return;
    }

    // 添加蒙层
    setShowMask(true);
    const selectPosition = { selectTop, selectBottom, selectLeft, selectRight };
    const { computedBricks, containerOffsetLeft, containerOffsetTop }
      = masonryRef.current.getBricksPosition();
    // 拿到瀑布流每个图片位置的数组，这个数组是基于列表容器的距离，所以需要进行计算
    computedBricks.current.forEach((value, key) => {
      const { top: targetTop, buttom: targetBottom, left: targetLeft, right: targetRight } = value;
      const targetPosition = {
        targetTop: targetTop + containerOffsetTop + documentScrollTop,
        targetBottom: targetBottom + containerOffsetTop + documentScrollTop,
        targetLeft: targetLeft + containerOffsetLeft,
        targetRight: targetRight + containerOffsetLeft,
      };
      chooseMap[key] = checkSelect(selectPosition, targetPosition);
    });
    // 拿到被选中的数据做的操作
    !!dragCallback && dragCallback(chooseMap, shiftKey);
  };

  // 检测是否被选中
  const checkSelect = (selectPosition, targetPosition) => {
    const { selectTop, selectBottom, selectLeft, selectRight } = selectPosition;
    const { targetTop, targetBottom, targetLeft, targetRight } = targetPosition;
    if (
      selectTop > targetBottom
      || selectBottom < targetTop
      || selectLeft > targetRight
      || selectRight < targetLeft
    ) {
      return false;
    } else {
      return true;
    }
  };
  const onDragEnd = () => {
    setShowMask(false);
    setShiftKey(false);
    !!dragEndCallback && dragEndCallback();
  };

  return (
    <div className="drag-select-content">
      <Selecto
        ref={selectoRef}
        selectableTargets={[]}
        dragContainer={container}
        hitRate={0}
        selectByClick={true}
        selectFromInside={true}
        preventDragFromInside
        scrollOptions={{
          container,
          getScrollPosition: () => [container.scrollLeft, container.scrollTop],
          throttleTime: 10,
          threshold: 10,
        }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragCondition={(e) => {
          // 判断当前页面是否可以滚动
          const isScrollable = container.scrollHeight > container.clientHeight;
          /**
           * 1. 如果不能滚动，则没有滚动条可以允许触发拖拽方法
           * 2. 如果可以滚动，无法判断用户是否点击的是滚动条，所以当用户选择位置趋向滚动条时候，不触发框选方法
           */
          if (
            (!isScrollable || container.clientWidth - e.inputEvent.clientX > scrollWidth)
            && dragCondition(e)
          ) {
            return true;
          } else {
            return false;
          }
        }}
        onDrag={onDrag}
        onScroll={(e) => {
          container.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
        }}
      />
      {/* 拖拽开始添加蒙层 */}
      <div
        className={classNames([
          'drag-select-mask',
          showMask ? 'drag-select-show' : 'drag-select-hidden',
        ])}></div>
    </div>
  );
});
