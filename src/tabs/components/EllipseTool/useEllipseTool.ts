import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import { TOOL_TYPES } from '../../constants/tools';
import type { ShapeOptions } from '../controlTypes';

type FabricPointer = ReturnType<fabric.Canvas['getPointer']>;

export const useEllipseTool = (canvas: fabric.Canvas | null, activeTool: string) => {
  const [ellipseOptions, setEllipseOptions] = useState<ShapeOptions>({
    stroke: '#ff0000',
    strokeWidth: 4,
    fill: 'transparent',
  });

  const isDrawingRef = useRef(false);
  const startPointRef = useRef<FabricPointer | null>(null);
  const ellipseRef = useRef<fabric.Ellipse | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: fabric.IEvent<Event>) => {
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
        evented: false,
      });

      canvas.add(ellipseRef.current);
      canvas.renderAll();
    };

    const handleMouseMove = (e: fabric.IEvent<Event>) => {
      if (!isDrawingRef.current || !startPointRef.current || !ellipseRef.current) return;

      const pointer = canvas.getPointer(e.e);
      const width = Math.abs(pointer.x - startPointRef.current.x);
      const height = Math.abs(pointer.y - startPointRef.current.y);

      // 设置椭圆中心点和半径
      ellipseRef.current.set({
        left: Math.min(startPointRef.current.x, pointer.x),
        top: Math.min(startPointRef.current.y, pointer.y),
        rx: width / 2,
        ry: height / 2,
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
          evented: true,
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
    setEllipseOptions,
  };
};
