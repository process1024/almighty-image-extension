// src/components/ImageEditor/hooks/useCanvas.js
import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

export const useCanvas = (canvasRef) => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight - 64,
      backgroundColor: '#ffffff'
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

    console.log(canvas, 'canvas');

    const handleSelection = () => {

      const actives = canvas.getActiveObjects()
      console.log('actives', actives);
      console.log('actives', actives[0].type);
      if(actives.length === 1) {
        console.log('actives', actives[0].type);
        setSelectedObject(actives[0]);
      }
      // console.log('e.target', e);
      // console.log('actives', actives);
      // console.log('actives', actives[0].type);
      // setSelectedObject(e.target);
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedObject(null));

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  return {
    canvas,
    selectedObject,
    setSelectedObject
  };
};