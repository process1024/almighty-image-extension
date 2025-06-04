import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import { TOOL_TYPES } from '../../constants/tools';

const createArrowClass = () => {
  return fabric.util.createClass(fabric.Line, {
    type: 'arrow',
    superType: 'drawing',
    initialize(points, options) {
      if (!points) {
        const { x1, x2, y1, y2 } = options;
        points = [x1, y1, x2, y2];
      }
      options = options || {};
      this.callSuper('initialize', points, options);
    },
    _render(ctx) {
      this.callSuper('_render', ctx);
      ctx.save(); // 乘或除对应的scaleX(Y)，抵消元素放缩造成的影响，使箭头不会变形
      ctx.scale(1 / this.scaleX, 1 / this.scaleY);
      const xDiff = (this.x2 - this.x1) * this.scaleX;
      const yDiff = (this.y2 - this.y1) * this.scaleY;
      const angle = Math.atan2(yDiff, xDiff);
      ctx.translate(
        ((this.x2 - this.x1) / 2) * this.scaleX,
        ((this.y2 - this.y1) / 2) * this.scaleY,
      );
      ctx.rotate(angle);
      ctx.beginPath(); // Move 5px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
      ctx.moveTo(5, 0);
      ctx.lineTo(-5, 5);
      ctx.lineTo(-5, -5);
      ctx.closePath();
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = this.stroke;
      ctx.fillStyle = this.stroke;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    },
  });
};
export const useArrowTool = (canvas, activeTool) => {
  const [arrowOptions, setArrowOptions] = useState({
    stroke: '#ff0000',
    strokeWidth: 6,
  });
  const isDrawingRef = useRef(false);
  const arrowRef = useRef(null);
  const startPointRef = useRef(null);
  useEffect(() => {
    if (!canvas) return;
    const ArrowClass = createArrowClass();
    fabric.Arrow = ArrowClass;

    let prevSelection = canvas.selection;
    const handleMouseDown = (e) => {
      if (activeTool !== TOOL_TYPES.ARROW) return;

      prevSelection = canvas.selection;
      canvas.selection = false;
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      arrowRef.current = new fabric.Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        ...arrowOptions,
        // selectable: false,
        // evented: false,
      });
      isDrawingRef.current = true;
      canvas.add(arrowRef.current);
      canvas.discardActiveObject();
      // canvas.getObjects().forEach((obj) => {
      //   obj.selectable = false;
      //   obj.hasControls = false;
      // });
      canvas.requestRenderAll();
    };
    const handleMouseMove = (e) => {
      if (!isDrawingRef.current || !arrowRef.current) return;
      const pointer = canvas.getPointer(e.e); // 确保箭头在画布范围内
      const x2 = Math.min(Math.max(pointer.x, 0), canvas.width);
      const y2 = Math.min(Math.max(pointer.y, 0), canvas.height);
      arrowRef.current.set({ x2: x2, y2: y2 });
      canvas.discardActiveObject();
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
      canvas.discardActiveObject();
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
