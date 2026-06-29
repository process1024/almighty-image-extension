import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import { TOOL_TYPES } from '../../constants/tools';
import type { ShapeOptions } from '../controlTypes';

type FabricPointer = ReturnType<fabric.Canvas['getPointer']>;

export const useRectTool = (canvas: fabric.Canvas | null, activeTool: string) => {
  const [rectOptions, setRectOptions] = useState<ShapeOptions>({
    stroke: '#ff0000',
    strokeWidth: 2,
    fill: 'transparent',
  });

  const isDrawingRef = useRef(false);
  const startPointRef = useRef<FabricPointer | null>(null);
  const rectRef = useRef<fabric.Rect | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: fabric.IEvent<Event>) => {
      if (activeTool !== TOOL_TYPES.RECT) return;

      const target = e.target;
      if (target) return;

      // 获取鼠标相对于画布的坐标
      const pointer = canvas.getPointer(e.e);

      isDrawingRef.current = true;
      startPointRef.current = pointer;

      // 创建新矩形
      rectRef.current = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        stroke: rectOptions.stroke,
        strokeWidth: rectOptions.strokeWidth,
        fill: rectOptions.fill,
        selectable: false,
        evented: false,
      });

      canvas.add(rectRef.current);
      canvas.renderAll();
    };

    const handleMouseMove = (e: fabric.IEvent<Event>) => {
      if (!isDrawingRef.current || !startPointRef.current || !rectRef.current) return;

      const pointer = canvas.getPointer(e.e);
      let width = pointer.x - startPointRef.current.x;
      let height = pointer.y - startPointRef.current.y;

      // 处理负值情况
      if (width < 0) {
        rectRef.current.set('left', pointer.x);
        width = Math.abs(width);
      }
      if (height < 0) {
        rectRef.current.set('top', pointer.y);
        height = Math.abs(height);
      }

      rectRef.current.set({
        width,
        height,
      });

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      startPointRef.current = null;

      if (rectRef.current) {
        rectRef.current.set({
          selectable: true,
          evented: true,
        });
        canvas.setActiveObject(rectRef.current);
        canvas.renderAll();
        rectRef.current = null;
      }
    };

    // 添加事件监听
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    // 清理事件监听
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, rectOptions]);

  return {
    rectOptions,
    setRectOptions,
  };
};
