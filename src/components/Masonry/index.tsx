// import styles from './index.module.less';
import classNames from "classnames";
import { debounce } from "lodash-es";
import React, { ReactNode, Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import "./index.less";

interface MasonryProps {
  ref: Ref<HTMLElement>;
  /** 数据源 */
  bricks: Record<string, any>[];
  /** 数据的唯一标识字段 */
  brickId?: string;
  /** 卡片的渲染函数 */
  render: React.FC;
  /** 卡片的间距*/
  gutter?: number;
  /** 每一列的宽度（卡片宽度）*/
  columnSize?: number;
  /** 列数*/
  columnNum?: number;
  /** 特定插入的元素*/
  children?: ReactNode;
  /** 预加载的滚动区域*/
  threshold: number;
  /** 滚动元素，支持传入id、元素，默认为document.documentElement*/
  scrollElement?: string | HTMLElement;
  /** 瀑布流的class*/
  className?: string;
  /** 切换不同的瀑布流实例，用于，重新计算 containerOffsetTop 值*/
  masonryKey?: string;
}

// 瀑布流
export default forwardRef(function Masonry(
  {
    brickId = "id",
    bricks = [],
    render,
    gutter = 24,
    columnSize = 240,
    columnNum = 4,
    children,
    threshold,
    scrollElement,
    className = "masonry",
    masonryKey = "masonryKey"
  },
  ref
) {
  useImperativeHandle(ref, () => ({
    // 获取所有图片的位置，用来做框选操作
    getBricksPosition: () => {
      return {
        containerOffsetTop: containerRef.current?.getBoundingClientRect()?.top,
        containerOffsetLeft: containerRef.current?.getBoundingClientRect()?.left,
        computedBricks
      };
    }
  }));
  const containerRef = useRef(null);
  const computedBricks = useRef(new Map()); // 已经计算大小和位置的bricks
  const columnHeightArr = useRef([]); // 瀑布流各列高度
  const [containerOffsetTop, setContainerOffsetTop] = useState(0); // 瀑布流容器位置
  const visibleRectRef = useRef({}); // 展示brick的区域
  const allBricks = useRef([]);

  const [renderBricks, setRenderBricks] = useState([]); // 当前被渲染的brick
  const [scrollTop, setScrollTop] = useState(0); // 页面滚动高度

  const isUnmount = useRef(false); // 是否销毁

  useEffect(() => {
    isUnmount.current = false;
    return () => {
      isUnmount.current = true;
    };
  }, []);

  const renderChild = useMemo(() => {
    const childrenNode = React.Children.toArray(children);
    return (record) => {
      // 先渲染 组件子元素
      if (record.mansonryInnerChildIndex !== undefined) {
        return childrenNode[record.mansonryInnerChildIndex];
      }
      return render(record);
    };
  }, [children, render]);

  // 获取瀑布流容器位置
  useEffect(() => {
    const realScrollElement =
      typeof scrollElement === "string"
        ? document.getElementById(scrollElement)
        : scrollElement || document.documentElement;

    const containerRectTop = containerRef.current.getBoundingClientRect().top;

    if (!scrollElement) {
      setContainerOffsetTop(containerRectTop + window.scrollY);
    } else {
      setContainerOffsetTop(
        containerRectTop - realScrollElement.getBoundingClientRect().top + realScrollElement.scrollTop
      );
    }
  }, [scrollElement, masonryKey]);

  // 添加 组件子元素
  useEffect(() => {
    allBricks.current = [...bricks];

    React.Children.map(children, (child, index) => {
      if (child) {
        allBricks.current.unshift({
          mansonryInnerChildIndex: index,
          [brickId]: `childId_${index}`
        });
      }
    });
  }, [children, bricks, brickId]);

  // 顶部加载新数据
  useEffect(() => {
    const bricks = allBricks.current;

    // 清除bricks
    if (!bricks.length) {
      columnHeightArr.current.fill(0);
      computedBricks.current.clear();
      return;
    }

    const keys = {};
    let index = 0;
    for (let [key] of computedBricks.current) {
      let realKey = bricks[index] && bricks[index][brickId];

      // 循环跳过重复的brick
      while (keys[realKey]) {
        index += 1;
        realKey = bricks[index][brickId];
      }

      if (!bricks[index] || bricks[index][brickId] !== key) {
        // 变更出现在前面几个，直接全部清空
        if (index < 5) {
          columnHeightArr.current.fill(0);
          computedBricks.current.clear();
          break;
        }

        // 清除当前brick后的所有brick缓存
        let clearAfter = false;
        for (let [remainKey, remainBrick] of computedBricks.current) {
          if (clearAfter || remainKey === key) {
            clearAfter = true;

            computedBricks.current.delete(remainKey);
            columnHeightArr.current[remainBrick.column] = Math.min(
              remainBrick.top,
              columnHeightArr.current[remainBrick.column]
            );
          }
        }
        break;
      }

      keys[key] = true;
      index += 1;
    }
  }, [bricks, brickId]);

  // 列数量发生变化
  useEffect(() => {
    columnHeightArr.current = Array(columnNum).fill(0);
    computedBricks.current.clear();

    // 真实滚动元素
    // const realScrollElement =
    //   typeof scrollElement === "string"
    //     ? document.getElementById(scrollElement)
    //     : scrollElement || document.documentElement;

    // @TODO: 临时解决列数变化情况，触发滚动，重新布局
    // realScrollElement.scrollBy(0, 1);
    setScrollTop((scrollTop) => scrollTop + 1);
  }, [columnNum, scrollElement]);

  // 显示区域
  const getVisibleRect = useMemo(() => {
    columnHeightArr.current.fill(0);
    computedBricks.current.clear();

    return (scrollTop) => {
      // 真实滚动元素
      const realScrollElement =
        typeof scrollElement === "string"
          ? document.getElementById(scrollElement)
          : scrollElement || document.documentElement;

      // 元素高度
      const clientHeight = realScrollElement?.clientHeight || 0;

      // 在视口范围内，添加到渲染中
      const thresholdTop = threshold || clientHeight * 0.5;
      const thresholdBottom = threshold || clientHeight;
      const top = scrollTop - containerOffsetTop - thresholdTop;
      const bottom = scrollTop + clientHeight - containerOffsetTop + thresholdBottom;

      return { top, bottom };
    };
  }, [scrollElement, threshold, containerOffsetTop]);

  // 需要被渲染的brick
  useEffect(() => {
    const bricks = allBricks.current;

    const keys = {}; // 避免重复
    const beRenders = [];

    const visibleRect = getVisibleRect(scrollTop);

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      const id = brick[brickId];
      const rect = computedBricks.current.get(id);

      if (rect) {
        if (rect.buttom > visibleRect.top && rect.top < visibleRect.bottom) {
          // 视口范围内
          if (!keys[id]) {
            beRenders.push(brick);
            keys[id] = true;
          }
        }
      } else {
        // 找到没有加载过的brick
        if (!keys[id]) {
          beRenders.push(brick);
          keys[id] = true;
        }
      }

      // 最多200个， TODO
      if (beRenders.length > 200) {
        break;
      }
    }

    visibleRectRef.current = visibleRect;
    setRenderBricks(beRenders);
  }, [bricks, scrollTop, brickId, getVisibleRect, children]);

  // 定位所有Dom节点
  useEffect(() => {
    const container = containerRef.current;

    const brickDom = [...container.children];

    let columNum = 0;
    let minHeight = Infinity;

    const computedBrickMap = computedBricks.current;
    const visibleRect = visibleRectRef.current;

    brickDom.forEach((brick, index) => {
      const rect = computedBrickMap.get(renderBricks[index][brickId]);
      if (rect) {
        // 已经渲染过
        brick.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
        brick.classList.add("brick");
      } else {
        // 新的brick
        columnHeightArr.current.forEach((value, i) => {
          if (value < minHeight) {
            columNum = i;
            minHeight = value;
          }
        });
        const clientWidth = brick.clientWidth;
        const rect = {
          column: columNum,
          left: columNum * (columnSize + gutter),
          top: minHeight,
          height: brick.clientHeight,
          buttom: minHeight + brick.clientHeight,
          right: columNum * (columnSize + gutter) + clientWidth
        };

        if (rect.buttom > visibleRect.top && rect.top < visibleRect.bottom) {
          // 视口范围内
          brick.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
          brick.classList.add("brick");
        } else {
          // 视口外的移到不可见区域
          brick.style.transform = `translate(-99999px, ${rect.top}px)`;
        }

        // 更新已经渲染数据
        computedBrickMap.set(renderBricks[index][brickId], rect);

        minHeight = columnHeightArr.current[columNum] = minHeight + brick.clientHeight + gutter;
      }
    });

    // requestAnimationFrame(() => {
    //   brickDom.forEach(dom => {
    //     dom.classList.add(styles.brickShown);
    //   })
    // });

    container.style.height = Math.max(...columnHeightArr.current) + "px";
  }, [renderBricks, columnSize, gutter, brickId]);

  // 滚动事件
  useEffect(() => {
    // 没有提供 scrollElement 的话，绑定window的滚动事件
    let target = typeof scrollElement === "string" ? document.getElementById(scrollElement) : scrollElement || window;

    const change = debounce(
      () => {
        if (isUnmount.current) {
          return;
        }

        // 获取真实 DOM是scrollTop， window是scrollY
        setScrollTop(target.scrollTop || target.scrollY || 0);
      },
      100,
      { trailing: true, maxWait: 200, leading: false }
    );

    // 初始化设置
    change();

    // 绑定滚动事件
    target.addEventListener("scroll", change, { passive: true });

    // 取消滚动事件
    return () => {
      target.removeEventListener("scroll", change, { passive: true });
    };
  }, [scrollElement]);

  return (
    <div className={classNames(["masonry", className])} ref={containerRef}>
      {/* {console.count("Masonry Render")} */}
      {renderBricks.map(renderChild)}
    </div>
  );
});
