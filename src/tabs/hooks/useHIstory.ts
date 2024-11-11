// src/components/ImageEditor/hooks/useHistory.js
import { useState, useCallback, useEffect } from 'react';

export const useHistory = (canvas) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 更新状态按钮
  const updateButtons = useCallback(() => {
    if (!canvas) return;
    setCanUndo(canvas.stateIndex > 0);
    setCanRedo(canvas.stateIndex < canvas.state.length - 1);
  }, [canvas]);

  // 保存状态
  const saveState = useCallback(() => {
    if (!canvas) return;
    
    // 当在历史记录中间进行了新操作时，清除后面的记录
    if (canvas.stateIndex < canvas.state.length - 1) {
      canvas.state = canvas.state.slice(0, canvas.stateIndex + 1);
    }

    const state = JSON.stringify(canvas.toJSON(['id', 'selectable']));
    canvas.state.push(state);
    canvas.stateIndex++;

    updateButtons();
  }, [canvas, updateButtons]);

  // 撤销
  const undo = useCallback(() => {
    if (!canvas || canvas.stateIndex <= 0) return;

    canvas.stateIndex--;
    const state = JSON.parse(canvas.state[canvas.stateIndex]);
    
    canvas.clear();
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      updateButtons();
    });
  }, [canvas, updateButtons]);

  // 重做
  const redo = useCallback(() => {
    if (!canvas || canvas.stateIndex >= canvas.state.length - 1) return;

    canvas.stateIndex++;
    const state = JSON.parse(canvas.state[canvas.stateIndex]);
    
    canvas.clear();
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      updateButtons();
    });
  }, [canvas, updateButtons]);

  // 初始化历史记录
  useEffect(() => {
    if (!canvas) return;

    // 初始化状态数组和索引
    canvas.state = [];
    canvas.stateIndex = -1;

    // 需要记录历史的事件列表
    const events = [
      'object:added',
      'object:removed',
      'object:modified',
      'object:skewing',
      'object:scaling',
      'object:moving',
      'object:rotating',
      'path:created'
    ];

    let debounceTimer = null;
    const handleStateChange = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        saveState();
      }, 300);
    };

    // 绑定事件
    events.forEach(event => {
      canvas.on(event, handleStateChange);
    });

    // 保存初始状态
    saveState();

    return () => {
      events.forEach(event => {
        canvas.off(event, handleStateChange);
      });
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [canvas, saveState]);

  // 快捷键支持
  useEffect(() => {
    if (!canvas) return;

    const handleKeyboard = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (isCtrlOrCmd && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [canvas, undo, redo]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveState
  };
};