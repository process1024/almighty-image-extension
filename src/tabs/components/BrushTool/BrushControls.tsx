// src/components/ImageEditor/components/BrushTool/BrushControls.jsx
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

export const BrushControls = ({
  defaultBrushOptions,
  onUpdateDefaults
}) => {
  const [brushProps, setBrushProps] = useState({
    color: '#000000',
    width: 2
  });

  useEffect(() => {
    setBrushProps(defaultBrushOptions);
  }, [defaultBrushOptions]);

  const handleUpdate = (property, value) => {
    const newProps = { [property]: value };
    setBrushProps(prev => ({ ...prev, ...newProps }));
    onUpdateDefaults(newProps);
  };

  return (
    <StyledControls>
      <ControlGroup>
        <label>画笔颜色：</label>
        <input
          type="color"
          value={brushProps.color}
          onChange={(e) => handleUpdate('color', e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <label>画笔粗细：</label>
        <input
          type="number"
          min="1"
          max="50"
          value={brushProps.width}
          onChange={(e) => handleUpdate('width', parseInt(e.target.value))}
        />
      </ControlGroup>
    </StyledControls>
  );
};