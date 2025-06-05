// src/components/ImageEditor/components/MosaicTool/MosaicControls.jsx
import React from 'react';
import { StyledControls } from '../../styles/toolControls';





export const MosaicControls = ({ options, onUpdate }) => {
  return (
    <StyledControls>
      <div>
        <label>马赛克大小：</label>
        <input
          type="number"
          min="5"
          max="50"
          value={options.blockSize}
          onChange={(e) => onUpdate({ blockSize: parseInt(e.target.value) })}
        />
      </div>
      <div>
        <label>笔刷大小：</label>
        <input
          type="number"
          min="5"
          max="100"
          value={options.brushSize}
          onChange={(e) => onUpdate({ brushSize: parseInt(e.target.value) })}
        />
      </div>
    </StyledControls>
  );
};