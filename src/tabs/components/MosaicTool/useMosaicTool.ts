// src/components/ImageEditor/components/MosaicTool/useMosaicTool.js
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { TOOL_TYPES } from '../../constants/tools';

export const useMosaicTool = (canvas, activeTool) => {
  const [mosaicOptions, setMosaicOptions] = useState({
    blockSize: 10,
    brushSize: 20
  });

  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const tempCanvasRef = useRef(null);
  const mosaicLayerRef = useRef(null);
  const updatePendingRef = useRef(false);

  // 初始化临时画布
  useEffect(() => {
    if (!canvas) return;

    tempCanvasRef.current = document.createElement('canvas');
    
    // 设置临时画布尺寸与主画布相同
    tempCanvasRef.current.width = canvas.width;
    tempCanvasRef.current.height = canvas.height;
    
    // 创建马赛克图层
    mosaicLayerRef.current = new fabric.Image(tempCanvasRef.current, {
      left: 0,
      top: 0,
      selectable: false,
      evented: false
    });
  }, [canvas]);

  // 应用马赛克效果的函数
  const applyMosaic = (x, y) => {
    if (!canvas || !tempCanvasRef.current) return;

    const { blockSize, brushSize } = mosaicOptions;
    const ctx = tempCanvasRef.current.getContext('2d');
    const mainCtx = canvas.getContext();

    // 计算马赛克范围
    const left = Math.max(0, x - brushSize / 2);
    const top = Math.max(0, y - brushSize / 2);
    const right = Math.min(canvas.width, x + brushSize / 2);
    const bottom = Math.min(canvas.height, y + brushSize / 2);

    // 遍历马赛克块
    for (let bx = left; bx < right; bx += blockSize) {
      for (let by = top; by < bottom; by += blockSize) {
        // 获取块的实际大小（处理边界情况）
        const bw = Math.min(blockSize, right - bx);
        const bh = Math.min(blockSize, bottom - by);

        // 获取块的平均颜色
        const imageData = mainCtx.getImageData(bx, by, bw, bh);
        const data = imageData.data;
        let r = 0, g = 0, b = 0, a = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
        }

        const pixelCount = data.length / 4;
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);
        a = Math.round(a / pixelCount);

        // 填充马赛克块
        ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
        ctx.fillRect(bx, by, bw, bh);
      }
    }

    // Instead of updating the mosaic layer immediately, batch updates
    if (!updatePendingRef.current) {
      updatePendingRef.current = true;
      requestAnimationFrame(() => {
        mosaicLayerRef.current.setElement(tempCanvasRef.current);
        canvas.renderAll();
        updatePendingRef.current = false;
      });
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e) => {
      if (activeTool !== TOOL_TYPES.MOSAIC) return;

      isDrawingRef.current = true;
      const pointer = canvas.getPointer(e.e);
      lastPosRef.current = pointer;

      // 确保马赛克图层在画布上
      if (!canvas.contains(mosaicLayerRef.current)) {
        canvas.add(mosaicLayerRef.current);
      }

      // 应用马赛克效果
      applyMosaic(pointer.x, pointer.y);
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current || activeTool !== TOOL_TYPES.MOSAIC) return;

      const pointer = canvas.getPointer(e.e);
      
      // 在当前位置应用马赛克
      applyMosaic(pointer.x, pointer.y);
      
      // 在两点之间插值应用马赛克，使效果更连续
      if (lastPosRef.current) {
        const dx = pointer.x - lastPosRef.current.x;
        const dy = pointer.y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.floor(dist / (mosaicOptions.brushSize / 4)));
        
        for (let i = 1; i < steps; i++) {
          const x = lastPosRef.current.x + (dx * i) / steps;
          const y = lastPosRef.current.y + (dy * i) / steps;
          applyMosaic(x, y);
        }
      }

      lastPosRef.current = pointer;
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    if (activeTool === TOOL_TYPES.MOSAIC) {
      // 禁用所有对象的选择和事件
      canvas.forEachObject(obj => {
        obj.selectable = false;
        obj.evented = false;
      });
      canvas.selection = false;
      
      // 添加事件监听
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    } else {
      // 恢复所有对象的选择和事件
      canvas.forEachObject(obj => {
        if (obj !== mosaicLayerRef.current) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
      canvas.selection = true;
      
      // 移除事件监听
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    }

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, mosaicOptions]);

  useEffect(() => {
    return () => {
      updatePendingRef.current = false;
    };
  }, []);

  return {
    mosaicOptions,
    setMosaicOptions
  };
};