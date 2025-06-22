import { useState, useCallback, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { registerCustomFabricTypes } from '../utils/fabricCustomTypes';

interface HistoryState {
  canvasState: string;
  action: string;
  timestamp: number;
}

export const useHistory = (canvas: fabric.Canvas | null) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isLoadingRef = useRef(false);
  const lastSavedStateRef = useRef<string>('');
  const isRecordingRef = useRef(true);

  // 保存历史记录状态
  const saveState = useCallback((action: string = 'unknown') => {
    if (!canvas || isLoadingRef.current || !isRecordingRef.current) return;
    
    try {
      // 确保自定义类型已注册
      registerCustomFabricTypes();
      
      const currentState = JSON.stringify(canvas.toJSON(['id', 'selectable', 'evented']));
      
      // 避免保存相同的状态
      if (currentState === lastSavedStateRef.current) {
        return;
      }
      
      lastSavedStateRef.current = currentState;
      
      const historyEntry: HistoryState = {
        canvasState: currentState,
        action,
        timestamp: Date.now()
      };
      
      setHistory(prev => {
        // 移除当前索引之后的所有历史记录（处理分支情况）
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(historyEntry);
        
        // 限制历史记录数量，保留最近50个操作
        const maxHistorySize = 50;
        if (newHistory.length > maxHistorySize) {
          return newHistory.slice(-maxHistorySize);
        }
        
        return newHistory;
      });
      
      setCurrentIndex(prev => prev + 1);
      
      console.log(`历史记录已保存: ${action}`);
      
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [canvas, currentIndex]);

  // 初始化时保存画布状态
  useEffect(() => {
    if (canvas) {
      // 确保自定义类型已注册
      registerCustomFabricTypes();
      // 延迟初始化，确保画布完全加载
      setTimeout(() => {
        saveState('初始化');
      }, 100);
    }
  }, [canvas, saveState]);

  // 监听画布事件并自动记录历史
  useEffect(() => {
    if (!canvas) return;

    // 对象添加完成（绘制完成）
    const handleObjectAdded = (e: fabric.IEvent<Event>) => {
      if (isLoadingRef.current) return;
      const obj = (e as fabric.IEvent<Event> & { target?: fabric.Object }).target;
      const actionMap: Record<string, string> = {
        'rect': '创建矩形',
        'ellipse': '创建椭圆', 
        'textbox': '创建文本',
        'path': '绘制路径',
        'arrow': '创建箭头'
      };
      const action = actionMap[obj?.type || ''] || '添加对象';
      // 延迟保存，确保对象完全添加
      setTimeout(() => saveState(action), 10);
    };

    // 对象删除完成
    const handleObjectRemoved = (e: fabric.IEvent<Event>) => {
      if (isLoadingRef.current) return;
      const obj = (e as fabric.IEvent<Event> & { target?: fabric.Object }).target;
      const actionMap: Record<string, string> = {
        'rect': '删除矩形',
        'ellipse': '删除椭圆',
        'textbox': '删除文本', 
        'path': '删除路径',
        'arrow': '删除箭头'
      };
      const action = actionMap[obj?.type || ''] || '删除对象';
      setTimeout(() => saveState(action), 10);
    };

    // 对象修改完成（移动、缩放、旋转、属性修改）
    const handleObjectModified = (e: fabric.IEvent<Event>) => {
      if (isLoadingRef.current) return;
      const obj = (e as fabric.IEvent<Event> & { target?: fabric.Object }).target;
      const action = `修改${obj?.type || '对象'}`;
      setTimeout(() => saveState(action), 10);
    };

    // 路径绘制完成
    const handlePathCreated = () => {
      if (isLoadingRef.current) return;
      setTimeout(() => saveState('绘制完成'), 10);
    };

    // 添加事件监听
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('path:created', handlePathCreated);

    // 清理事件监听
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, saveState]);

  const undo = useCallback(() => {
    if (currentIndex <= 0 || !canvas || history.length === 0) return;

    try {
      isLoadingRef.current = true;
      isRecordingRef.current = false; // 停止记录，避免撤销操作被记录
      
      // 确保自定义类型已注册
      registerCustomFabricTypes();
      
      const newIndex = currentIndex - 1;
      const prevState = history[newIndex];
      
      console.log(`撤销操作: ${history[currentIndex]?.action} → ${prevState.action}`);

      console.log('prevState', prevState);
      
      // 使用Promise包装loadFromJSON以更好地处理错误
      const loadPromise = new Promise((resolve, reject) => {
        try {
          canvas.loadFromJSON(JSON.parse(prevState.canvasState), () => {
            try {
              canvas.renderAll();
              setCurrentIndex(newIndex);
              lastSavedStateRef.current = prevState.canvasState;
              
              // 重新启用记录
              setTimeout(() => {
                isLoadingRef.current = false;
                isRecordingRef.current = true;
              }, 100);
              
              // 触发自定义事件
              canvas.fire('history:undo', { 
                index: newIndex, 
                action: prevState.action 
              });
              resolve(true);
            } catch (renderError) {
              reject(renderError);
            }
          });
        } catch (loadError) {
          reject(loadError);
        }
      });

      loadPromise.catch((error) => {
        console.error('撤销操作失败 - 详细错误:', error);
        isLoadingRef.current = false;
        isRecordingRef.current = true;
        // 可以在这里添加用户友好的错误提示
      });

    } catch (error) {
      console.error('撤销操作失败:', error);
      isLoadingRef.current = false;
      isRecordingRef.current = true;
    }
  }, [currentIndex, history, canvas]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1 || !canvas) return;
    
    try {
      isLoadingRef.current = true;
      isRecordingRef.current = false; // 停止记录，避免重做操作被记录
      
      // 确保自定义类型已注册
      registerCustomFabricTypes();
      
      const newIndex = currentIndex + 1;
      const nextState = history[newIndex];
      
      console.log(`重做操作: ${history[currentIndex]?.action} → ${nextState.action}`);
      
      // 使用Promise包装loadFromJSON以更好地处理错误
      const loadPromise = new Promise((resolve, reject) => {
        try {
          canvas.loadFromJSON(JSON.parse(nextState.canvasState), () => {
            try {
              canvas.renderAll();
              setCurrentIndex(newIndex);
              lastSavedStateRef.current = nextState.canvasState;
              
              // 重新启用记录
              setTimeout(() => {
                isLoadingRef.current = false;
                isRecordingRef.current = true;
              }, 100);
              
              // 触发自定义事件
              canvas.fire('history:redo', { 
                index: newIndex, 
                action: nextState.action 
              });
              resolve(true);
            } catch (renderError) {
              reject(renderError);
            }
          });
        } catch (loadError) {
          reject(loadError);
        }
      });

      loadPromise.catch((error) => {
        console.error('重做操作失败 - 详细错误:', error);
        isLoadingRef.current = false;
        isRecordingRef.current = true;
        // 可以在这里添加用户友好的错误提示
      });

    } catch (error) {
      console.error('重做操作失败:', error);
      isLoadingRef.current = false;
      isRecordingRef.current = true;
    }
  }, [currentIndex, history, canvas]);

  // 手动保存状态（用于特殊操作）
  const manualSave = useCallback((action: string) => {
    saveState(action);
  }, [saveState]);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    lastSavedStateRef.current = '';
    
    if (canvas) {
      saveState('重置');
    }
  }, [canvas, saveState]);

  // 获取历史记录信息（用于调试）
  const getHistoryInfo = useCallback(() => {
    return {
      total: history.length,
      current: currentIndex,
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1,
      currentAction: history[currentIndex]?.action || '无',
      prevAction: history[currentIndex - 1]?.action || '无',
      nextAction: history[currentIndex + 1]?.action || '无'
    };
  }, [history, currentIndex]);

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    manualSave, // 替代原来的 saveState
    clearHistory,
    getHistoryInfo,
    historyLength: history.length,
    currentIndex,
    isLoading: isLoadingRef.current
  };
};