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
        {/* <label>颜色：</label> */}
        <input
          type="color"
          value={options.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
        />
      </div>
      <div>
        {/* <label>线宽：</label> */}
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