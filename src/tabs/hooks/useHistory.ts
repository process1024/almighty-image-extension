import { fabric } from 'fabric';
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

import { registerCustomFabricTypes } from '../utils/fabricCustomTypes';

interface HistoryState {
  canvasState: string;
  mosaicDataUrl?: string; // 新增，保存马赛克像素内容
  action: string;
  timestamp: number;
}

type FabricImageElement = HTMLImageElement | HTMLVideoElement;

function toFabricImageElement(canvas: HTMLCanvasElement) {
  return canvas as unknown as FabricImageElement;
}

function restoreMosaicLayer(
  dataUrl: string | undefined,
  tempCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
  mosaicLayerRef?: MutableRefObject<fabric.Image | null>,
  canvas?: fabric.Canvas | null,
) {
  const tempCanvas = tempCanvasRef?.current;
  if (!tempCanvas) return;

  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;

  const refreshLayer = () => {
    if (!mosaicLayerRef?.current || !canvas) return;

    mosaicLayerRef.current.setElement(toFabricImageElement(tempCanvas));
    canvas.renderAll();
  };

  if (!dataUrl) {
    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    refreshLayer();
    return;
  }

  const img = new window.Image();
  img.onload = () => {
    ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(img, 0, 0);
    refreshLayer();
  };
  img.src = dataUrl;
}

export const useHistory = (
  canvas: fabric.Canvas | null,
  tempCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
  mosaicLayerRef?: MutableRefObject<fabric.Image | null>,
) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isLoadingRef = useRef(false);
  const lastSavedStateRef = useRef<string>('');
  const isRecordingRef = useRef(true);
  const isInitializedRef = useRef(false);
  const isDrawingRef = useRef(false);

  // 保存历史记录状态
  const saveState = useCallback(
    (action: string = 'unknown') => {
      if (!canvas || isLoadingRef.current || !isRecordingRef.current || isDrawingRef.current)
        return;

      try {
        // 确保自定义类型已注册
        registerCustomFabricTypes();

        const currentState = JSON.stringify(canvas.toJSON(['id', 'selectable', 'evented']));

        // 避免保存相同的状态
        if (currentState === lastSavedStateRef.current) {
          return;
        }

        lastSavedStateRef.current = currentState;

        // 新增：保存马赛克像素内容
        let mosaicDataUrl: string | undefined;
        if (tempCanvasRef && tempCanvasRef.current) {
          try {
            mosaicDataUrl = tempCanvasRef.current.toDataURL();
          } catch (e) {
            mosaicDataUrl = undefined;
          }
        }
        const historyEntry: HistoryState = {
          canvasState: currentState,
          action,
          timestamp: Date.now(),
        };
        if (mosaicDataUrl) {
          historyEntry.mosaicDataUrl = mosaicDataUrl;
        }

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
    },
    [canvas, currentIndex, tempCanvasRef],
  );

  // 初始化时保存画布状态（只执行一次）
  useEffect(() => {
    if (canvas && !isInitializedRef.current) {
      // 确保自定义类型已注册
      registerCustomFabricTypes();

      // 标记已初始化
      isInitializedRef.current = true;

      // 延迟初始化，确保画布完全加载
      setTimeout(() => {
        if (canvas && !isLoadingRef.current) {
          saveState('初始化');
        }
      }, 100);
    }
  }, [canvas]); // 移除saveState依赖，避免循环

  // 监听画布事件并自动记录历史
  useEffect(() => {
    if (!canvas) return;

    // 绘制开始事件（鼠标按下）
    const handleMouseDown = () => {
      isDrawingRef.current = true;
    };

    // 绘制结束事件（鼠标抬起）
    const handleMouseUp = () => {
      // 延迟标记绘制结束，确保对象已完全添加
      setTimeout(() => {
        isDrawingRef.current = false;
      }, 50);
    };

    // 对象添加完成（绘制完成）
    const handleObjectAdded = (e: fabric.IEvent<Event>) => {
      if (isLoadingRef.current) return;

      const obj = (e as fabric.IEvent<Event> & { target?: fabric.Object }).target;
      const actionMap: Record<string, string> = {
        rect: '创建矩形',
        ellipse: '创建椭圆',
        textbox: '创建文本',
        path: '绘制路径',
        arrow: '创建箭头',
      };
      const action = actionMap[obj?.type || ''] || '添加对象';

      // 如果正在绘制中，延迟保存直到绘制完成
      // 如果不在绘制中，立即保存（比如通过代码添加的对象）
      if (isDrawingRef.current) {
        // 等待绘制完成后保存
        const checkAndSave = () => {
          if (!isDrawingRef.current) {
            saveState(action);
          } else {
            // 如果还在绘制中，继续等待
            setTimeout(checkAndSave, 20);
          }
        };
        setTimeout(checkAndSave, 60); // 给mouse:up事件足够时间执行
      } else {
        // 不在绘制中，立即保存
        setTimeout(() => saveState(action), 10);
      }
    };

    // 对象删除完成
    const handleObjectRemoved = (e: fabric.IEvent<Event>) => {
      if (isLoadingRef.current) return;
      const obj = (e as fabric.IEvent<Event> & { target?: fabric.Object }).target;
      const actionMap: Record<string, string> = {
        rect: '删除矩形',
        ellipse: '删除椭圆',
        textbox: '删除文本',
        path: '删除路径',
        arrow: '删除箭头',
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

      // 对于画笔工具，绘制完成后立即保存
      if (isDrawingRef.current) {
        const checkAndSave = () => {
          if (!isDrawingRef.current) {
            saveState('绘制完成');
          } else {
            setTimeout(checkAndSave, 20);
          }
        };
        setTimeout(checkAndSave, 60);
      } else {
        setTimeout(() => saveState('绘制完成'), 10);
      }
    };

    // 添加事件监听
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('path:created', handlePathCreated);

    // 清理事件监听
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:up', handleMouseUp);
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
      if (!prevState) {
        isLoadingRef.current = false;
        isRecordingRef.current = true;
        return;
      }

      console.log(`撤销操作: ${history[currentIndex]?.action || '未知'} → ${prevState.action}`);

      // 使用Promise包装loadFromJSON以更好地处理错误
      const loadPromise = new Promise<boolean>((resolve, reject) => {
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
                action: prevState.action,
              });

              // 新增：恢复马赛克像素内容
              restoreMosaicLayer(prevState.mosaicDataUrl, tempCanvasRef, mosaicLayerRef, canvas);
              resolve(true);
            } catch (renderError) {
              reject(renderError);
            }
          });
        } catch (loadError) {
          reject(loadError);
        }
      });

      loadPromise.catch(error => {
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
  }, [currentIndex, history, canvas, tempCanvasRef, mosaicLayerRef]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1 || !canvas) return;

    try {
      isLoadingRef.current = true;
      isRecordingRef.current = false; // 停止记录，避免重做操作被记录

      // 确保自定义类型已注册
      registerCustomFabricTypes();

      const newIndex = currentIndex + 1;
      const nextState = history[newIndex];
      if (!nextState) {
        isLoadingRef.current = false;
        isRecordingRef.current = true;
        return;
      }

      console.log(`重做操作: ${history[currentIndex]?.action || '未知'} → ${nextState.action}`);

      // 使用Promise包装loadFromJSON以更好地处理错误
      const loadPromise = new Promise<boolean>((resolve, reject) => {
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
                action: nextState.action,
              });

              // 新增：恢复马赛克像素内容
              restoreMosaicLayer(nextState.mosaicDataUrl, tempCanvasRef, mosaicLayerRef, canvas);
              resolve(true);
            } catch (renderError) {
              reject(renderError);
            }
          });
        } catch (loadError) {
          reject(loadError);
        }
      });

      loadPromise.catch(error => {
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
  }, [currentIndex, history, canvas, tempCanvasRef, mosaicLayerRef]);

  // 手动保存状态（用于特殊操作）
  const manualSave = useCallback(
    (action: string) => {
      saveState(action);
    },
    [saveState],
  );

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
      nextAction: history[currentIndex + 1]?.action || '无',
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
    isLoading: isLoadingRef.current,
  };
};
