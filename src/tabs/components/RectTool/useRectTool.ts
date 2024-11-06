// src/components/ImageEditor/components/RectTool/useRectTool.js
import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { TOOL_TYPES } from '../../constants/tools';

export const useRectTool = (canvas, activeTool) => {
  const [rectOptions, setRectOptions] = useState({
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'rgba(255, 255, 255, 0.3)'
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  let rect = null;

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e) => {
      console.log('handleMouseDown');
      console.log('activeTool', activeTool);
      if (activeTool !== TOOL_TYPES.RECT) return;
      
      setIsDrawing(true);
      const pointer = canvas.getPointer(e.e);
      setStartPoint(pointer);
      console.log('pointer', pointer);

      rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        ...rectOptions,
        selectable: false,
        evented: false
      });

      canvas.add(rect);
    };

    const handleMouseMove = (e) => {
      console.log('handleMouseMove', isDrawing, startPoint, rect);
      if (!isDrawing || !startPoint || !rect) return;

      const pointer = canvas.getPointer(e.e);
      console.log('pointer handleMouseMove', pointer);
      
      let width = pointer.x - startPoint.x;
      let height = pointer.y - startPoint.y;

      // 处理负值情况
      if (width < 0) {
        rect.set('left', pointer.x);
        width = Math.abs(width);
      }
      if (height < 0) {
        rect.set('top', pointer.y);
        height = Math.abs(height);
      }

      rect.set({
        width: width,
        height: height
      });
      console.log('rect', rect);

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      
      setIsDrawing(false);
      setStartPoint(null);
      
      if (rect) {
        rect.set({
          selectable: true,
          evented: true
        });
        canvas.setActiveObject(rect);
        canvas.renderAll();
      }
      rect = null;
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, isDrawing, startPoint, rectOptions]);

  return {
    rectOptions,
    setRectOptions
  };
};