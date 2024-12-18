// src/components/ImageEditor/components/RectTool/RectControls.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledControls = styled.div`
  position: absolute;
  top: 60px;
  right: 50%;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RectControls = ({
  selectedObject,
  defaultRectOptions,
  onUpdateSelected,
  onUpdateDefaults
}) => {
  const [rectProps, setRectProps] = useState({
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'rgba(255, 255, 255, 0.3)'
  });

  useEffect(() => {
    if (selectedObject) {
      setRectProps({
        stroke: selectedObject.stroke || '#000000',
        strokeWidth: selectedObject.strokeWidth || 2,
        fill: selectedObject.fill || 'rgba(255, 255, 255, 0.3)'
      });
    } else {
      setRectProps(defaultRectOptions);
    }
  }, [selectedObject, defaultRectOptions]);

  const handleUpdate = (property, value) => {
    const newProps = { [property]: value };
    setRectProps(prev => ({ ...prev, ...newProps }));
    
    if (selectedObject) {
      onUpdateSelected(newProps);
    } else {
      onUpdateDefaults(newProps);
    }
  };

  return (
    <StyledControls>
      <ControlGroup>
        <label>边框颜色：</label>
        <input
          type="color"
          value={rectProps.stroke}
          onChange={(e) => handleUpdate('stroke', e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <label>边框粗细：</label>
        <input
          type="number"
          min="1"
          max="20"
          value={rectProps.strokeWidth}
          onChange={(e) => handleUpdate('strokeWidth', parseInt(e.target.value))}
        />
      </ControlGroup>
      <ControlGroup>
        <label>填充颜色：</label>
        <input
          type="color"
          value={rectProps.fill}
          onChange={(e) => handleUpdate('fill', e.target.value)}
        />
      </ControlGroup>
    </StyledControls>
  );
};