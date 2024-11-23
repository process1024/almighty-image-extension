// src/components/ImageEditor/components/EllipseTool/useEllipseTool.js
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { TOOL_TYPES } from '../../constants/tools';

export const useEllipseTool = (canvas, activeTool) => {
  const [ellipseOptions, setEllipseOptions] = useState({
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'rgba(255, 255, 255, 0.3)'
  });

  const isDrawingRef = useRef(false);
  const startPointRef = useRef(null);
  const ellipseRef = useRef(null);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e) => {
      if (activeTool !== TOOL_TYPES.ELLIPSE) return;

      const target = e.target;
      if (target) return;

      const pointer = canvas.getPointer(e.e);
      isDrawingRef.current = true;
      startPointRef.current = pointer;

      ellipseRef.current = new fabric.Ellipse({
        left: pointer.x,
        top: pointer.y,
        originX: 'left',
        originY: 'top',
        rx: 0,
        ry: 0,
        stroke: ellipseOptions.stroke,
        strokeWidth: ellipseOptions.strokeWidth,
        fill: ellipseOptions.fill,
        selectable: false,
        evented: false
      });

      canvas.add(ellipseRef.current);
      canvas.renderAll();
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current || !startPointRef.current || !ellipseRef.current) return;

      const pointer = canvas.getPointer(e.e);
      let width = Math.abs(pointer.x - startPointRef.current.x);
      let height = Math.abs(pointer.y - startPointRef.current.y);

      // 设置椭圆中心点和半径
      ellipseRef.current.set({
        left: Math.min(startPointRef.current.x, pointer.x),
        top: Math.min(startPointRef.current.y, pointer.y),
        rx: width / 2,
        ry: height / 2
      });

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      startPointRef.current = null;

      if (ellipseRef.current) {
        ellipseRef.current.set({
          selectable: true,
          evented: true
        });
        canvas.setActiveObject(ellipseRef.current);
        canvas.renderAll();
        ellipseRef.current = null;
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, ellipseOptions]);

  return {
    ellipseOptions,
    setEllipseOptions
  };
};