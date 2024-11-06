// src/components/ImageEditor/components/TextTool/useTextTool.js
import { useState, useEffect } from 'react';
import { TOOL_TYPES } from '../../constants/tools';

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
      if (options.target || activeFunction !== TOOL_TYPES.TEXT) return;

      const pointer = canvas.getPointer(options.e);
      const text = new fabric.TextBox('双击编辑文字', {
        left: pointer.x,
        top: pointer.y,
        ...textOptions
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