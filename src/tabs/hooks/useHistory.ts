import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export const useHistory = (canvas: fabric.Canvas | null) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const lastSavedStateRef = useRef<string>('');

  // 防抖保存状态，避免频繁保存
  const debouncedSaveState = useCallback(() => {
    if (!canvas || isLoadingRef.current) return;
    
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const currentState = JSON.stringify(canvas.toJSON(['id', 'selectable', 'evented']));
        
        // 避免保存相同的状态
        if (currentState === lastSavedStateRef.current) {
          return;
        }
        
        lastSavedStateRef.current = currentState;
        
        setHistory(prev => {
          // 移除当前索引之后的所有历史记录
          const newHistory = prev.slice(0, currentIndex + 1);
          newHistory.push(currentState);
          
          // 限制历史记录数量，保留最近100个
          const maxHistorySize = 100;
          if (newHistory.length > maxHistorySize) {
            return newHistory.slice(-maxHistorySize);
          }
          
          return newHistory;
        });
        
        setCurrentIndex(prev => {
          const newIndex = Math.min(prev + 1, 99);
          return newIndex;
        });
        
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
    }, 300); // 300ms 防抖延迟
  }, [canvas, currentIndex]);

  // 立即保存状态（用于重要操作）
  const saveState = useCallback(() => {
    if (!canvas || isLoadingRef.current) return;
    
    try {
      const currentState = JSON.stringify(canvas.toJSON(['id', 'selectable', 'evented']));
      
      // 避免保存相同的状态
      if (currentState === lastSavedStateRef.current) {
        return;
      }
      
      lastSavedStateRef.current = currentState;
      
      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(currentState);
        
        const maxHistorySize = 100;
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(-maxHistorySize);
        }
        
        return newHistory;
      });
      
      setCurrentIndex(prev => Math.min(prev + 1, 99));
      
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [canvas, currentIndex]);

  // 初始化时保存画布状态
  useEffect(() => {
    if (canvas) {
      // 延迟初始化，确保画布完全加载
      setTimeout(() => {
        saveState();
      }, 100);
    }
  }, [canvas, saveState]);

  const undo = useCallback(() => {
    if (currentIndex <= 0 || !canvas || history.length === 0) return;
    
    try {
      isLoadingRef.current = true;
      const newIndex = currentIndex - 1;
      const prevState = JSON.parse(history[newIndex]);
      
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        isLoadingRef.current = false;
        
        // 更新最后保存的状态引用
        lastSavedStateRef.current = history[newIndex];
        
        // 触发自定义事件
        canvas.fire('history:undo', { index: newIndex });
      });
    } catch (error) {
      console.error('撤销操作失败:', error);
      isLoadingRef.current = false;
    }
  }, [currentIndex, history, canvas]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1 || !canvas) return;
    
    try {
      isLoadingRef.current = true;
      const newIndex = currentIndex + 1;
      const nextState = JSON.parse(history[newIndex]);
      
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setCurrentIndex(newIndex);
        isLoadingRef.current = false;
        
        // 更新最后保存的状态引用
        lastSavedStateRef.current = history[newIndex];
        
        // 触发自定义事件
        canvas.fire('history:redo', { index: newIndex });
      });
    } catch (error) {
      console.error('重做操作失败:', error);
      isLoadingRef.current = false;
    }
  }, [currentIndex, history, canvas]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    lastSavedStateRef.current = '';
    
    if (canvas) {
      saveState();
    }
  }, [canvas, saveState]);

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    saveState,
    debouncedSaveState,
    clearHistory,
    historyLength: history.length,
    currentIndex,
    isLoading: isLoadingRef.current
  };
};