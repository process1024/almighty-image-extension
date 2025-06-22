import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { registerCustomFabricTypes } from '../../utils/fabricCustomTypes';

import { TOOL_TYPES } from '../../constants/tools';

export const useArrowTool = (canvas: fabric.Canvas, activeTool: string) => {
  const [arrowOptions, setArrowOptions] = useState({
    stroke: '#ff0000',
    strokeWidth: 6,
  });
  const isDrawingRef = useRef(false);
  const arrowRef = useRef(null);
  const startPointRef = useRef(null);
  useEffect(() => {
    if (!canvas) return;
    
    // 使用统一的自定义类型注册
    registerCustomFabricTypes();

    let prevSelection = canvas.selection;
    const handleMouseDown = (e) => {
      if (activeTool !== TOOL_TYPES.ARROW) return;

      console.log('handleMouseDown', e);

      const target = e.target;
      if (target) return;

      prevSelection = canvas.selection;
      canvas.selection = false;
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arrowRef.current = new (fabric as any).Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        ...arrowOptions,
        // selectable: false,
        // evented: false,
      });
      isDrawingRef.current = true;
      canvas.add(arrowRef.current);
      // canvas.discardActiveObject();
      // canvas.getObjects().forEach((obj) => {
      //   obj.selectable = false;
      //   obj.hasControls = false;
      // });
      // canvas.requestRenderAll();
    };
    const handleMouseMove = (e) => {
      if (!isDrawingRef.current || !arrowRef.current) return;
      const pointer = canvas.getPointer(e.e); // 确保箭头在画布范围内
      const x2 = Math.min(Math.max(pointer.x, 0), canvas.width);
      const y2 = Math.min(Math.max(pointer.y, 0), canvas.height);
      arrowRef.current.set({ x2: x2, y2: y2 });
      // canvas.discardActiveObject();
      // canvas.requestRenderAll();
      canvas.renderAll();
    };
    const handleMouseUp = (e) => {
      if (!isDrawingRef.current) return;
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
