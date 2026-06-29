import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { DownOutlined, FilterOutlined, SettingOutlined } from '@ant-design/icons';

import { globalConfig } from '~services/config';
import { uniqArray } from '~utils/util';

import AppContext from '../context';
import HeaderRight from '../HeaderRight';

import './index.less';

interface FormatDropdownProps {
  formats: string[];
  onChange: (format: string) => void;
}

interface HeaderProps {
  onClose: () => void;
  all: number;
  selected: number;
  onSelectAll: (checked: boolean) => void;
}

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

type HeaderConfigKey = 'format' | 'minWidth' | 'minHeight';

const FormatDropdown = ({ formats, onChange }: FormatDropdownProps) => {
  const [format, setFormat] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return menuItems.find((menu) => menu.key === format)?.label || '全部格式';
  }, [format, menuItems]);

  function selectFormat(key: string) {
    setFormat(key);
    onChange(key);
    setIsOpen(false);
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="format-dropdown-container" ref={dropdownRef}>
      <div className="dropdown-trigger"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <FilterOutlined className="filter-icon" />
        <span className="format-text">{formatName}</span>
        <DownOutlined className={`arrow-icon ${isOpen ? 'arrow-up' : ''}`} />
      </div>
      {isOpen && (
        <div
          className="dropdown-menu"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`dropdown-item ${format === item.key ? 'selected' : ''}`}
              onClick={() => selectFormat(item.key)}
            >
              <span>{item.label}</span>
              {format === item.key && <span className="check-icon">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RangeSlider = ({ label, min, max, value, onChange }: RangeSliderProps) => {
  return (
    <div className="range-slider-container">
      <label className="range-label">{label}</label>
      <div
        className="slider-wrapper"
        onPointerDown={(e) => {
          // 只对滑块thumb允许事件，阻止其他区域
          const isSliderThumb = (e.target as HTMLElement)?.matches('input[type="range"]::-webkit-slider-thumb')
                               || (e.target as HTMLElement)?.tagName === 'INPUT';
          if (!isSliderThumb) {
            e.stopPropagation();
          }
        }}
      >
        <input
          type="range"
          className="range-slider"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
        />
        <div className="value-display">
          <span className="value-text">{value}px</span>
        </div>
      </div>
    </div>
  );
};

const SettingsDropdown = ({ config, onChange }: {
  config: {
    rangSize: {
      minWidth: number;
      maxWith: number;
      minHeight: number;
      maxHeight: number;
    };
    minWidth: number;
    minHeight: number;
  };
  onChange: (key: HeaderConfigKey, value: string | number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="settings-dropdown-container" ref={dropdownRef}>
      <button
        className={`settings-btn ${isOpen ? 'active' : ''}`}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <SettingOutlined className="settings-icon" />
        <span>筛选设置</span>
        <DownOutlined className={`arrow-icon ${isOpen ? 'arrow-up' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="settings-dropdown-menu"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          <div className="settings-dropdown-content">
            <div className="settings-header">
              <h4>图片尺寸筛选</h4>
              <p>设置图片的最小尺寸要求</p>
            </div>

            <div className="settings-controls">
              <RangeSlider
                label="最小宽度"
                min={config.rangSize.minWidth}
                max={config.rangSize.maxWith}
                value={config.minWidth}
                onChange={(value) => onChange('minWidth', value)}
              />
              <RangeSlider
                label="最小高度"
                min={config.rangSize.minHeight}
                max={config.rangSize.maxHeight}
                value={config.minHeight}
                onChange={(value) => onChange('minHeight', value)}
              />
            </div>

            <div className="settings-footer">
              <span className="hint-text">
                只显示符合尺寸要求的图片
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header({ onClose, all, selected, onSelectAll }: HeaderProps) {
  const { minHeight, minWidth } = globalConfig.batchPin;
  const [config, setConfig] = useContext(AppContext);

  const onChange = (key: HeaderConfigKey, value: string | number) => {
    setConfig({
      ...config,
      [key]: value,
    });
  };

  const formats = useMemo(() => {
    return uniqArray(config.allImg.map((img) => img.fileType)).filter((type) => {
      return !!type;
    });
  }, [config.allImg]);

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
      <div className="header-left">
        <div className="app-title">
          <h2 className="title-text">图片批量下载</h2>
          <div className="stats-info">
            共找到 {all} 张图片
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="control-group">
          <FormatDropdown formats={formats} onChange={(v) => onChange('format', v)} />
          <SettingsDropdown config={config} onChange={onChange} />
        </div>
      </div>

      <div className="header-right">
        <HeaderRight
          all={all}
          selected={selected}
          onSelectAll={onSelectAll}
          onClose={onClose}
        />

        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
