import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import { TOOL_TYPES } from '../../constants/tools';
import type { StrokeOptions } from '../controlTypes';
import { registerCustomFabricTypes } from '../../utils/fabricCustomTypes';

type FabricPointer = ReturnType<fabric.Canvas['getPointer']>;
type ArrowObject = fabric.Line & {
  set(key: string | Record<string, unknown>, value?: unknown): ArrowObject;
};

export const useArrowTool = (canvas: fabric.Canvas | null, activeTool: string) => {
  const [arrowOptions, setArrowOptions] = useState<StrokeOptions>({
    stroke: '#ff0000',
    strokeWidth: 6,
  });
  const isDrawingRef = useRef(false);
  const arrowRef = useRef<ArrowObject | null>(null);
  const startPointRef = useRef<FabricPointer | null>(null);

  useEffect(() => {
    if (!canvas) return;

    // 使用统一的自定义类型注册
    registerCustomFabricTypes();

    let prevSelection = canvas.selection;
    const handleMouseDown = (e: fabric.IEvent<Event>) => {
      if (activeTool !== TOOL_TYPES.ARROW) return;

      console.log('handleMouseDown', e);

      const target = e.target;
      if (target) return;

      prevSelection = canvas.selection;
      canvas.selection = false;
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arrow = new (fabric as any).Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        ...arrowOptions,
        // selectable: false,
        // evented: false,
      });
      arrowRef.current = arrow;
      isDrawingRef.current = true;
      canvas.add(arrow);
      // canvas.discardActiveObject();
      // canvas.getObjects().forEach((obj) => {
      //   obj.selectable = false;
      //   obj.hasControls = false;
      // });
      // canvas.requestRenderAll();
    };

    const handleMouseMove = (e: fabric.IEvent<Event>) => {
      if (!isDrawingRef.current || !arrowRef.current) return;
      const pointer = canvas.getPointer(e.e); // 确保箭头在画布范围内
      const x2 = Math.min(Math.max(pointer.x, 0), canvas.width ?? 0);
      const y2 = Math.min(Math.max(pointer.y, 0), canvas.height ?? 0);
      arrowRef.current.set({ x2, y2 });
      // canvas.discardActiveObject();
      // canvas.requestRenderAll();
      canvas.renderAll();
    };

    const handleMouseUp = (e: fabric.IEvent<Event>) => {
      if (!isDrawingRef.current || !arrowRef.current || !startPointRef.current) return;
      isDrawingRef.current = false;
      const pointer = canvas.getPointer(e.e);
      const dx = pointer.x - startPointRef.current.x;
      const dy = pointer.y - startPointRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 5) {
        canvas.remove(arrowRef.current);
      } else {
        arrowRef.current.set({ selectable: true, evented: true });
        canvas.setActiveObject(arrowRef.current);
      }
      // canvas.discardActiveObject();
      canvas.requestRenderAll();

      canvas.selection = prevSelection;
      arrowRef.current = null;
      startPointRef.current = null;
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, arrowOptions]);
  return { arrowOptions, setArrowOptions };
};
