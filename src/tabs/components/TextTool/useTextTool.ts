// src/components/ImageEditor/components/TextTool/useTextTool.js
import { useState, useEffect } from 'react';
import { TOOL_TYPES } from '../../constants/tools';
import { fabric } from 'fabric';

export const useTextTool = (canvas, activeFunction) => {
  const [textOptions, setTextOptions] = useState({
    fontSize: 20,
    fill: '#000000',
    fontFamily: 'Arial',
    textAlign: 'left'
  });

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (options) => {
      if (!canvas) return;

      // 当存在激活对象时，取消激活并阻止新建文本
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      if (options.target || activeFunction !== TOOL_TYPES.TEXT) return;

      const pointer = canvas.getPointer(options.e);
      const text = new fabric.TextBox('双击编辑文字', {
        left: pointer.x,
        top: pointer.y,
        ...textOptions,
        // 设置选中框样式
        borderColor: textOptions.fill,
        cornerColor: textOptions.fill,
        cornerStyle: 'circle',
        transparentCorners: false,
        borderDashArray: [5, 5],
        // 只显示旋转控制点
        hasControls: true,
        hasBorders: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockUniScaling: true,
        // 设置控制点大小
        cornerSize: 10,
        // 设置控制点距离边界的距离
        padding: 5
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    };

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
    };
  }, [canvas, activeFunction, textOptions]);

  return {
    textOptions,
    setTextOptions
  };
};