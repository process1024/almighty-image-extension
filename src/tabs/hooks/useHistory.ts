import { useState, useCallback, useEffect } from 'react';

export const useHistory = (canvas) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 初始化时保存画布状态
  useEffect(() => {
    if (canvas) {
      saveState();
    }
  }, [canvas]);

  const saveState = useCallback(() => {
    if (!canvas) return;
    
    try {
      const newState = JSON.stringify(canvas.toJSON());
      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(newState);
        return newHistory.slice(-50); // 保留最近50个历史记录
      });
      setCurrentIndex(prev => Math.min(prev + 1, 49));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [canvas, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex <= 0 || !canvas) return;
    
    try {
      setCurrentIndex(prev => prev - 1);
      const prevState = JSON.parse(history[currentIndex - 1]);
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        canvas.fire('history:undo');
      });
    } catch (error) {
      console.error('撤销操作失败:', error);
    }
  }, [currentIndex, history, canvas]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1 || !canvas) return;
    
    try {
      setCurrentIndex(prev => prev + 1);
      const nextState = JSON.parse(history[currentIndex + 1]);
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        canvas.fire('history:redo');
      });
    } catch (error) {
      console.error('重做操作失败:', error);
    }
  }, [currentIndex, history, canvas]);

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    saveState
  };
};