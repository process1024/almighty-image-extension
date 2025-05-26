// src/components/ImageEditor/components/TextTool/TextControls.jsx
import React, { useEffect, useState } from 'react';
import { StyledControls } from './styles';

export const TextControls = ({ 
  selectedObject, 
  defaultTextOptions, 
  onUpdateSelected, 
  onUpdateDefaults 
}) => {
  const [textProps, setTextProps] = useState({
    fontSize: 20,
    fill: '#000000',
    fontFamily: 'Arial',
    textAlign: 'left'
  });

  // 当选中对象改变或默认选项改变时更新本地状态
  useEffect(() => {
    if (selectedObject) {
      // 如果有选中对象，使用选中对象的属性
      setTextProps({
        fontSize: selectedObject.fontSize || 20,
        fill: selectedObject.fill || '#000000',
        fontFamily: selectedObject.fontFamily || 'Arial',
        textAlign: selectedObject.textAlign || 'left'
      });
    } else {
      // 如果没有选中对象，使用默认属性
      setTextProps(defaultTextOptions);
    }
  }, [selectedObject, defaultTextOptions]);

  const handleUpdate = (property, value) => {
    const newProps = { [property]: value };
    setTextProps(prev => ({ ...prev, ...newProps }));
    
    if (selectedObject) {
      // 如果有选中对象，更新选中对象的属性
      onUpdateSelected(newProps);
    } else {
      // 如果没有选中对象，更新默认属性
      onUpdateDefaults(newProps);
    }
  };

  return (
    <StyledControls>
      <div>
        {/* <label>字体大小：</label> */}
        <input
          type="number"
          min="12"
          max="100"
          value={textProps.fontSize}
          onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value))}
        />
      </div>
      <div>
        {/* <label>字体颜色：</label> */}
        <input
          type="color"
          value={textProps.fill}
          onChange={(e) => handleUpdate('fill', e.target.value)}
        />
      </div>
      <div>
        {/* <label>字体：</label> */}
        <select
          value={textProps.fontFamily}
          onChange={(e) => handleUpdate('fontFamily', e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Microsoft YaHei">微软雅黑</option>
        </select>
      </div>
      {/* <div>
        <select
          value={textProps.textAlign}
          onChange={(e) => handleUpdate('textAlign', e.target.value)}
        >
          <option value="left">左对齐</option>
          <option value="center">居中</option>
          <option value="right">右对齐</option>
        </select>
      </div> */}
    </StyledControls>
  );
};