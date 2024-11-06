// src/components/ImageEditor/components/ArrowTool/useArrowTool.js
import { useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { TOOL_TYPES } from '../../constants/tools';

export const useArrowTool = (canvas, activeFunction) => {
  const [arrowOptions, setArrowOptions] = useState({
    stroke: '#000000',
    strokeWidth: 2
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  useEffect(() => {
    setIsDrawing(false);
    setStartPoint(null);
  }, [activeFunction]);

  const handleMouseDown = useCallback((event) => {
    if (!canvas || activeFunction !== TOOL_TYPES.ARROW) return;

    const target = event.target;
    if (target) return;

    const pointer = canvas.getPointer(event.e);
    setIsDrawing(true);
    setStartPoint({ x: pointer.x, y: pointer.y });
  }, [canvas, activeFunction]);

  const handleMouseMove = useCallback((event) => {
    if (!canvas || !isDrawing || activeFunction !== TOOL_TYPES.ARROW) return;

    const pointer = canvas.getPointer(event.e);
    
    const objects = canvas.getObjects();
    const lastObject = objects[objects.length - 1];
    if (lastObject && lastObject._tempArrow) {
      canvas.remove(lastObject);
    }

    const arrow = new fabric.Arrow([
      startPoint.x,
      startPoint.y,
      pointer.x,
      pointer.y
    ], {
      ...arrowOptions,
      _tempArrow: true,
      selectable: false,
    });

    canvas.add(arrow);
    canvas.renderAll();
  }, [canvas, isDrawing, startPoint, activeFunction, arrowOptions]);

  const handleMouseUp = useCallback((event) => {
    if (!canvas || !isDrawing || activeFunction !== TOOL_TYPES.ARROW) return;

    const pointer = canvas.getPointer(event.e);
    
    const objects = canvas.getObjects();
    const lastObject = objects[objects.length - 1];
    if (lastObject && lastObject._tempArrow) {
      canvas.remove(lastObject);
    }

    const arrow = new fabric.Arrow([
      startPoint.x,
      startPoint.y,
      pointer.x,
      pointer.y
    ], {
      ...arrowOptions,
      selectable: true,
    });

    canvas.add(arrow);
    canvas.renderAll();

    setIsDrawing(false);
    setStartPoint(null);
  }, [canvas, isDrawing, startPoint, activeFunction, arrowOptions]);

  useEffect(() => {
    if (!canvas) return;

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    arrowOptions,
    setArrowOptions
  };
};