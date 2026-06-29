import { fabric } from 'fabric';
import { useEffect, useState } from 'react';

import { TOOL_TYPES } from '../../constants/tools';
import type { BrushOptions } from '../controlTypes';

export const useBrushTool = (canvas: fabric.Canvas | null, activeTool: string) => {
  const [brushOptions, setBrushOptions] = useState<BrushOptions>({
    color: '#ff0000',
    width: 8,
  });

  useEffect(() => {
    if (!canvas) return;

    // 当工具切换时更新画布的绘制模式
    if (activeTool === TOOL_TYPES.BRUSH) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = brushOptions.color;
      canvas.freeDrawingBrush.width = brushOptions.width;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, activeTool, brushOptions]);

  // 当画笔选项改变时更新画布的画笔属性
  useEffect(() => {
    if (!canvas || !canvas.freeDrawingBrush) return;

    canvas.freeDrawingBrush.color = brushOptions.color;
    canvas.freeDrawingBrush.width = brushOptions.width;
  }, [canvas, brushOptions]);

  return {
    brushOptions,
    setBrushOptions,
  };
};
