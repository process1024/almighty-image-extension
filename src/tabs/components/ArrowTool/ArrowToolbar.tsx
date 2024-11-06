// src/components/ImageEditor/components/ArrowTool/ArrowToolbar.jsx
import React from 'react';
import { StyledToolbarControls } from './styles';

export const ArrowToolbar = ({ arrowColor, arrowWidth, setArrowColor, setArrowWidth }) => {
  return (
    <StyledToolbarControls>
      <div>
        <label>箭头颜色：</label>
        <input
          type="color"
          value={arrowColor}
          onChange={(e) => setArrowColor(e.target.value)}
        />
      </div>
      <div>
        <label>箭头粗细：</label>
        <input
          type="range"
          min="1"
          max="10"
          value={arrowWidth}
          onChange={(e) => setArrowWidth(parseInt(e.target.value))}
        />
        <span>{arrowWidth}px</span>
      </div>
    </StyledToolbarControls>
  );
};