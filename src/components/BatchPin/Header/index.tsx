// import { Dropdown, Menu, Slider } from 'antd';
// import huabanImg from "data-base64:~assets/with-text-logo.svg";
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { globalConfig } from '~services/config';
import { uniqArray } from '~utils/util';

import AppContext from '../context';
import HeaderRight from '../HeaderRight';

import './index.less';

interface HeaderProps {
  formats: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormatDropdown = ({ formats, onChange }: HeaderProps) => {
  const [format, setFormat] = useState('all');

  const menuItems = useMemo(() => {
    const formatAll = { label: '全部格式', key: 'all' };
    return [formatAll].concat(
      formats.map((item) => {
        return {
          label: item.toUpperCase(),
          key: item,
        };
      }),
    );
  }, [formats]);

  const formatName = useMemo(() => {
    return menuItems.find((menu) => menu.key === format).label;
  }, [format]);

  function selectFormat(e) {
    setFormat(e.key);
    onChange(e.key);
  }

  return (
    <select name="cars" id="cars">
      {menuItems.map((item) => {
        return (
          <option value={item.key} key={item.key}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
};

// const trackEventKeyMap = {
//   format: '',
//   minHeight: '高度控制条',
//   minWidth: '宽度控制条',
// };

export default function Header({ onClose, tracker, all, selected, onSelectAll }) {
  const { minHeight, minWidth } = globalConfig.batchPin;
  const [config, setConfig] = useContext(AppContext);
  // const [rangSize, setRangSize] = useState({
  //   maxWith: minWidth,
  //   maxHeight: minHeight,
  //   minWidth: 1,
  //   minHeight: 1
  // });

  const onChange = (key: string, value: any) => {
    console.log(key, value);
    config[key] = value;
    setConfig({ ...config });

    // tracker.batchPinClickTop(trackEventKeyMap[key] || value);
  };

  const formats = useMemo(() => {
    return uniqArray(config.allImg.map((img) => img.fileType)).filter((type) => {
      return !!type;
    });
  }, [config.allImg]);

  // const rangSize = useMemo(() => {
  //   const sortWidthImgs = config.allImg.sort((a, b) => a.width - b.width);
  //   const sortHeightImgs = config.allImg.sort((a, b) => a.height - b.height);
  //   return {
  //     maxWith: sortWidthImgs[config.allImg.length - 1]?.width || minWidth,
  //     maxHeight: sortHeightImgs[config.allImg.length - 1]?.height || minHeight,
  //     minWidth: sortWidthImgs[0]?.width || 1,
  //     minHeight: sortHeightImgs[0]?.height || 1
  //   };
  // }, [config.allImg]);

  useEffect(() => {
    const { rangSize } = config;
    if (rangSize.minHeight === rangSize.maxHeight && rangSize.minWidth === rangSize.maxWith) {
      config.minHeight = rangSize.minHeight;
      config.minWidth = rangSize.minWidth;
      setConfig({ ...config });
    }
  }, [config.rangSize]);

  useEffect(() => {
    const sortWidthImgs = [...config.allImg.sort((a, b) => a.width - b.width)];
    const sortHeightImgs = config.allImg.sort((a, b) => a.height - b.height);
    config.rangSize = {
      maxWith: sortWidthImgs[config.allImg.length - 1]?.width || minWidth,
      maxHeight: sortHeightImgs[config.allImg.length - 1]?.height || minHeight,
      minWidth: sortWidthImgs[0]?.width || 1,
      minHeight: sortHeightImgs[0]?.height || 1,
    };

    if (config.allImg.length > 0 && config.minHeight === 200 && config.filterImgs.length == 0) {
      config.minHeight = config.rangSize.minHeight;
      config.minWidth = config.rangSize.minWidth;
    }
    setConfig({ ...config });
  }, [config.allImg]);

  return (
    <header className="batch-pin-header">
      {/* <span className="batch-pin-header-logo">
        <img src={huabanImg} alt="logo" />
      </span> */}
      <div className="operate-setting">
        <div className="test">
          <FormatDropdown formats={formats} onChange={(v) => onChange('format', v)} />
          <div className="flex-align-center">
            <label>最小宽度</label>
            <input
              type="range"
              min={config.rangSize.minWidth}
              max={config.rangSize.maxWith}
              value={config.minWidth}
              onChange={(e) => onChange('minWidth', e.target.value)}></input>
            <span className="max-num-text">{config.minWidth}px</span>
          </div>
          <div className="flex-align-center">
            <label>最小高度</label>

            <input
              type="range"
              min={config.rangSize.minHeight}
              max={config.rangSize.maxHeight}
              value={config.minHeight}
              onChange={(e) => onChange('minHeight', e.target.value)}></input>
            <span className="max-num-text">{config.minHeight}px</span>
          </div>

          <HeaderRight
            // tracker={tracker}
            all={all}
            selected={selected}
            onSelectAll={onSelectAll}
            onClose={onClose}
          />
        </div>
      </div>

      <svg
        className="batch-pin-header-close-btn"
        onClick={onClose}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none">
        <rect width="32" height="32" rx="16" fill="#1C1F23" fillOpacity="0.29" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7143 16L24 22.2857L22.2857 24L16 17.7143L9.71429 24L8 22.2857L14.2857 16L8 9.71429L9.71429 8L16 14.2857L22.2857 8L24 9.71429L17.7143 16Z"
          fill="white"
        />
      </svg>
    </header>
  );
}
