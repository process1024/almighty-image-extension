// src/components/ImageEditor/components/EllipseTool/EllipseControls.jsx
import React, { useEffect, useState } from 'react';
import { StyledControls } from '../../styles/toolControls';


export const EllipseControls = ({
  selectedObject,
  defaultEllipseOptions,
  onUpdateSelected,
  onUpdateDefaults,
}) => {
  const [ellipseProps, setEllipseProps] = useState({
    stroke: '#000000',
    strokeWidth: 4,
    fill: 'rgba(255, 255, 255, 0.3)',
  });

  useEffect(() => {
    if (selectedObject) {
      setEllipseProps({
        stroke: selectedObject.stroke,
        strokeWidth: selectedObject.strokeWidth,
        fill: selectedObject.fill,
      });
    } else {
      setEllipseProps(defaultEllipseOptions);
    }
  }, [selectedObject, defaultEllipseOptions]);

  const handleUpdate = (property, value) => {
    const newProps = { [property]: value };
    setEllipseProps(prev => ({ ...prev, ...newProps }));

    if (selectedObject) {
      onUpdateSelected(newProps);
    } else {
      onUpdateDefaults(newProps);
    }
  };

  return (
    <StyledControls>
      <div>
        <label>边框颜色：</label>
        <input
          type="color"
          value={ellipseProps.stroke}
          onChange={(e) => handleUpdate('stroke', e.target.value)}
        />
      </div>
      <div>
        <label>边框宽度：</label>
        <input
          type="number"
          min="1"
          max="50"
          value={ellipseProps.strokeWidth}
          onChange={(e) => handleUpdate('strokeWidth', parseInt(e.target.value))}
        />
      </div>
      {/* <ControlGroup>
        <label>填充颜色：</label>
        <input
          type="color"
          value={ellipseProps.fill}
          onChange={(e) => handleUpdate('fill', e.target.value)}
        />
      </ControlGroup>
      <ControlGroup>
        <label>填充透明度：</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={ellipseProps.fill ? parseFloat(ellipseProps.fill.split(',')[3]) : 0.3}
          onChange={(e) => {
            const color = ellipseProps.fill.split(',').slice(0, 3).join(',');
            handleUpdate('fill', `${color}, ${e.target.value})`);
          }}
        />
      </ControlGroup> */}
    </StyledControls>
  );
};
