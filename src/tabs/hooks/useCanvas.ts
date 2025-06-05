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
      const canvas = new fabric.Canvas(canvasRef.current!, {
        width: window.innerWidth,
        height: window.innerHeight - 110,
        backgroundColor: '#ffffff',
        selection: true,
        selectionColor: 'rgba(100, 149, 237, 0.3)',
        selectionBorderColor: 'rgba(100, 149, 237, 0.8)',
        selectionLineWidth: 2,
        selectionDashArray: [10, 5],
      }) as FabricCanvas;

      // 设置默认对象样式
      fabric.Object.prototype.set({
        transparentCorners: false,
        borderColor: '#4169E1',
        cornerColor: '#4169E1',
        cornerSize: 8,
        cornerStyle: 'circle',
        borderDashArray: [5, 5],
        padding: 5,
        hasControls: true,
        hasBorders: true
      });

      return canvas;
    };

    const loadImageData = async (canvas: FabricCanvas) => {
      try {
        const res = await chrome.storage.local.get(['imageData']);
        const { imageData } = res;
        const { width, height } = await getBase64ImageDimensions(imageData);
        
        canvas.setDimensions({ width, height });
        canvas.setBackgroundImage(imageData, canvas.renderAll.bind(canvas));
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };

    const canvas = initCanvas();
    loadImageData(canvas);

    chrome.storage.local.get(['imageData']).then(async res => {
      const { imageData } = res;
      const { width, height } = await getBase64ImageDimensions(imageData);
      console.log(width, height);

      canvas.setWidth(width);
      canvas.setHeight(height);

      canvas.setBackgroundImage(
        imageData,
        canvas.renderAll.bind(canvas)
      );
    });

    setCanvas(canvas);

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 64
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
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