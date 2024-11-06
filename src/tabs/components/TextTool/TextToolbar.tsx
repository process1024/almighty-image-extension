// src/components/ImageEditor/components/TextTool/TextToolbar.jsx
import React from 'react';
import { StyledToolbarControls } from './styles';

export const TextToolbar = ({ textOptions, setTextOptions }) => {
  return (
    <StyledToolbarControls>
      <div>
        <label>默认字体大小：</label>
        <input
          type="number"
          min="12"
          max="100"
          value={textOptions.fontSize}
          onChange={(e) => setTextOptions(prev => ({
            ...prev,
            fontSize: parseInt(e.target.value)
          }))}
        />
      </div>
      <div>
        <label>默认颜色：</label>
        <input
          type="color"
          value={textOptions.fill}
          onChange={(e) => setTextOptions(prev => ({
            ...prev,
            fill: e.target.value
          }))}
        />
      </div>
      <div>
        <label>默认字体：</label>
        <select
          value={textOptions.fontFamily}
          onChange={(e) => setTextOptions(prev => ({
            ...prev,
            fontFamily: e.target.value
          }))}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Microsoft YaHei">微软雅黑</option>
        </select>
      </div>
    </StyledToolbarControls>
  );
};