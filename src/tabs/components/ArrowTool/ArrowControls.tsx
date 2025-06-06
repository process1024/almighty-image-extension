// src/components/ImageEditor/components/ArrowTool/ArrowControls.jsx
import React from 'react';
import { StyledControls } from '../../styles/toolControls';

export const ArrowControls = ({
  defaultArrowOptions,
  selectedObject,
  onUpdateSelected,
  onUpdateDefaults
}) => {
  const handleChange = (property, value) => {
    if (selectedObject) {
      onUpdateSelected({ [property]: value });
    } else {
      onUpdateDefaults({ [property]: value });
    }
  };

  const options = selectedObject || defaultArrowOptions;

  return (
    <StyledControls>
      <div>
        <div>颜色：</div>
        <input
          type="color"
          value={options.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
        />
      </div>
      <div>
        <div>线宽：</div>
        <input
          type="number"
          min="1"
          max="50"
          value={options.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
        />
      </div>
    </StyledControls>
  );
};