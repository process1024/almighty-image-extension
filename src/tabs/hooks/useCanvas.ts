// src/components/ImageEditor/hooks/useCanvas.js
import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { getBase64ImageDimensions } from '~utils/image';

type FabricCanvas = fabric.Canvas;

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = () => {
      return new fabric.Canvas(canvasRef.current!, {
        backgroundColor: '#ffffff',
        selection: true,
        selectionColor: 'rgba(100, 149, 237, 0.3)',
        // 移除初始窗口尺寸设置
      }) as FabricCanvas;
    };

    const loadImageData = async (canvas: FabricCanvas) => {
      try {
        const { imageData } = await chrome.storage.local.get(['imageData']);
        const { width, height } = await getBase64ImageDimensions(imageData);
        
        // 统一设置画布尺寸
        canvas.setDimensions({ 
          width,
          height,
          backstoreOnly: true 
        });
        canvas.setBackgroundImage(imageData, canvas.renderAll.bind(canvas));
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };

    const canvas = initCanvas();
    loadImageData(canvas);
    setCanvas(canvas);

    // 移除窗口resize事件监听
    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e) => {
      // console.log('Selection event:', e.type, e);
      const activeObjects = canvas.getActiveObjects();
      
      if (activeObjects.length === 1) {
        const obj = activeObjects[0];
        setSelectedObject(obj);
        // console.log('Object selected:', obj.type, obj);
      } else {
        setSelectedObject(null);
        // console.log('Selection cleared');
      }
    };

    const handleSelectionCleared = () => {
      // console.log('Selection cleared event');
      setSelectedObject(null);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas]);

  return {
    canvas,
    selectedObject,
    setSelectedObject
  };
};