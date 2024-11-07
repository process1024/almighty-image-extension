// src/components/ImageEditor/components/MosaicTool/MosaicControls.jsx
import React from 'react';
import styled from 'styled-components';

const StyledControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 0 16px;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MosaicControls = ({ options, onUpdate }) => {
  return (
    <StyledControls>
      <ControlGroup>
        <label>马赛克大小：</label>
        <input
          type="number"
          min="5"
          max="50"
          value={options.blockSize}
          onChange={(e) => onUpdate({ blockSize: parseInt(e.target.value) })}
        />
      </ControlGroup>
      <ControlGroup>
        <label>笔刷大小：</label>
        <input
          type="number"
          min="5"
          max="100"
          value={options.brushSize}
          onChange={(e) => onUpdate({ brushSize: parseInt(e.target.value) })}
        />
      </ControlGroup>
    </StyledControls>
  );
};