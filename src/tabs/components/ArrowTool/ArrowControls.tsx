// src/components/ImageEditor/components/ArrowTool/ArrowControls.jsx
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
      <ControlGroup>
        <label>颜色：</label>
        <input
          type="color"
          value={options.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <label>线宽：</label>
        <input
          type="number"
          min="1"
          max="50"
          value={options.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
        />
      </ControlGroup>
      <ControlGroup>
        <label>箭头长度：</label>
        <input
          type="number"
          min="10"
          max="50"
          value={options.arrowHeadLength}
          onChange={(e) => handleChange('arrowHeadLength', parseInt(e.target.value))}
        />
      </ControlGroup>
      <ControlGroup>
        <label>箭头宽度：</label>
        <input
          type="number"
          min="10"
          max="50"
          value={options.arrowHeadWidth}
          onChange={(e) => handleChange('arrowHeadWidth', parseInt(e.target.value))}
        />
      </ControlGroup>
    </StyledControls>
  );
};