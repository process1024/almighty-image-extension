import React from 'react';

import './index.less';

import { useKeyPress } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { When } from 'react-if';

import DragSelect from '~components/DragSelect';
import Loading from '~components/Loading';

import Masonry from '../Masonry';
import { AppContext, initialState } from './context';
import Header from './Header';
import { CHECKTYPE, useBatchPin } from './hook/batch';
import ImageCard from './ImageCard';

const BatchPin = (props: { onClose: () => void }) => {
  const [config, setConfig] = useState(initialState());
  const contentRef = useRef();
  const masonryRef = useRef();

  const { imageEles, filterImgs, setFilterImgs, toggleSelected, selectAll, loading } =
    useBatchPin(config);
  const [wrapperWidth, setWrapperWidth] = useState(1120);

  const masonryLayout = useMemo(() => {
    const number = wrapperWidth ? Math.floor((wrapperWidth - 142) / 264) : 0;
    const width = number * 240 + (number - 1) * 24;
    return {
      number,
      width,
    };
  }, [wrapperWidth]);

  useEffect(() => {
    // trackerEvent.batchPinExpose();

    const onResize = () => {
      const width = Math.max(window.innerWidth, 1120);
      setWrapperWidth(width);
    };

    onResize();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    config.allImg = imageEles;
    setConfig({ ...config });
  }, [imageEles]);

  useEffect(() => {
    config.selectedImgs = filterImgs.filter((item) =>
      [CHECKTYPE.CHECK, CHECKTYPE.TEMPORARYCHECKED].includes(item.checked),
    );
    setConfig({ ...config });
  }, [filterImgs]);

  useKeyPress('esc', props.onClose);

  function imgOnload(e: Event) {
    const img = e.target as HTMLImageElement; // 使用类型断言
    if (img.width > config.rangSize.maxWith) {
      config.rangSize.maxWith = img.width;
    } else if (img.width < config.rangSize.minWidth) {
      config.rangSize.minWidth = img.width;
    }
    if (img.height > config.rangSize.maxHeight) {
      config.rangSize.maxHeight = img.height;
    } else if (img.height < config.rangSize.minHeight) {
      config.rangSize.minHeight = img.height;
    }
    // setConfig({ ...config });
  }

  function render(image) {
    return (
      <ImageCard
        key={image.src}
        checked={[CHECKTYPE.CHECK, CHECKTYPE.TEMPORARYCHECKED].includes(image.checked)}
        onChange={(e: boolean) => toggleSelected(e, image)}
        renderWidth={240}
        image={image}
        onload={imgOnload}
      />
    );
  }

  const selectedLength = useMemo(() => {
    return filterImgs.filter((img) => img.checked === CHECKTYPE.CHECK).length;
  }, [filterImgs]);

  const dragCallback = (chooseMap, shiftKey) => {
    setFilterImgs(
      filterImgs.map((img) => {
        const isInside = !!chooseMap[img.src];
        const checked = img.checked;
        let newImg = { ...img };
        if (shiftKey) {
          if (checked !== CHECKTYPE.UNCHECK) {
            newImg = {
              ...img,
              checked: isInside ? CHECKTYPE.TEMPORARYUNCHECKED : CHECKTYPE.CHECK,
            };
          }
        } else {
          // 框选是一个加选的功能，重新框选不会清空前置的数据
          if (checked !== CHECKTYPE.CHECK) {
            newImg = {
              ...img,
              checked: isInside ? CHECKTYPE.TEMPORARYCHECKED : CHECKTYPE.UNCHECK,
            };
          }
        }
        return newImg;
      }),
    );
  };

  const dragEndCallback = () => {
    // 把所有的临时选中状态改为最终状态
    setFilterImgs(
      filterImgs.map((item) => {
        let checked = item.checked;
        if (checked === CHECKTYPE.TEMPORARYCHECKED) {
          checked = CHECKTYPE.CHECK;
        } else if (checked === CHECKTYPE.TEMPORARYUNCHECKED) {
          checked = CHECKTYPE.UNCHECK;
        }
        return {
          ...item,
          checked,
        };
      }),
    );
  };

  return (
    <AppContext.Provider value={[config, setConfig]}>
      <div
        className="batch-pin-container"
        // FIX: safari需要设置-webkit-user-select，在 less 写这个样式会被parcel忽略，先在 style 写入
        style={{}}>
        {/* '-webkit-user-select': 'none', */}
        <main id="batch-pin-main" ref={contentRef}>
          <When condition={loading}>
            <div className="batch-pin-loading-wrapper">
              <Loading size="30px" />
            </div>
          </When>
          <When condition={!loading}>
            {/* tracker={trackerEvent} */}
            <Header
              onClose={props.onClose}
              all={filterImgs.length}
              selected={selectedLength}
              onSelectAll={selectAll}
            />
            <When condition={!filterImgs.length}>
              <div className="empty-text">没有符合要求的图片</div>
            </When>
            <When condition={filterImgs.length}>
              <section className="batch-pin-content" style={{ width: masonryLayout.width + 'px' }}>
                <Masonry
                  ref={masonryRef}
                  brickId="src"
                  bricks={filterImgs}
                  columnNum={masonryLayout.number}
                  scrollElement={contentRef.current}
                  threshold={300}
                  render={render}></Masonry>
              </section>
            </When>
            <DragSelect
              masonryRef={masonryRef}
              container={document
                .querySelector('#huaban-pin-shadow')
                .shadowRoot.querySelector('#batch-pin-main')}
              dragCondition={(e) => e.clientY > 64}
              dragCallback={dragCallback}
              dragEndCallback={dragEndCallback}
            />
          </When>
        </main>
        {/* <Footer
          tracker={trackerEvent}
          all={filterImgs.length}
          selected={selected.length}
          onSelectAll={selectAll}
          onClose={props.onClose}
        /> */}
      </div>
    </AppContext.Provider>
  );
};

export default BatchPin;
