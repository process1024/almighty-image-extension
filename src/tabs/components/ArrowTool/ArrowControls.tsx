// src/components/ImageEditor/components/ArrowTool/ArrowControls.jsx
import React, { useEffect, useState } from 'react';
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
  selectedObject,
  defaultArrowOptions,
  onUpdateSelected,
  onUpdateDefaults
}) => {
  const [arrowProps, setArrowProps] = useState({
    stroke: '#000000',
    strokeWidth: 2
  });

  useEffect(() => {
    if (selectedObject) {
      setArrowProps({
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 2
      });
    } else {
      setArrowProps(defaultArrowOptions);
    }
  }, [selectedObject, defaultArrowOptions]);

  const handleUpdate = (property, value) => {
    console.log(property, value);
    const newProps = { [property]: value };
    setArrowProps(prev => ({ ...prev, ...newProps }));
    
    if (selectedObject) {
      onUpdateSelected(newProps);
    } else {
      onUpdateDefaults(newProps);
    }
  };

  return (
    <StyledControls>
      <ControlGroup>
        <label>箭头颜色：</label>
        <input
          type="color"
          value={arrowProps.stroke}
          onChange={(e) => handleUpdate('stroke', e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <label>箭头粗细：</label>
        <input
          type="number"
          min="1"
          max="20"
          value={arrowProps.strokeWidth}
          onChange={(e) => handleUpdate('strokeWidth', parseInt(e.target.value))}
        />
      </ControlGroup>
    </StyledControls>
  );
};