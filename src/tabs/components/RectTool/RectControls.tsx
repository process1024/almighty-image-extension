// src/components/ImageEditor/components/RectTool/RectControls.jsx
import React, { useEffect, useState } from 'react';
import { StyledControls } from '../../styles/toolControls';

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
      <div>
        <div>边框颜色：</div>
        <input
          type="color"
          value={rectProps.stroke}
          onChange={(e) => handleUpdate('stroke', e.target.value)}
        />
      </div>
      <div>
        <div>边框粗细：</div>
        <input
          type="number"
          min="1"
          max="20"
          value={rectProps.strokeWidth}
          onChange={(e) => handleUpdate('strokeWidth', parseInt(e.target.value))}
        />
      </div>
      {/* <ControlGroup>
        <label>填充颜色：</label>
        <input
          type="color"
          value={rectProps.fill}
          onChange={(e) => handleUpdate('fill', e.target.value)}
        />
      </ControlGroup> */}
    </StyledControls>
  );
};