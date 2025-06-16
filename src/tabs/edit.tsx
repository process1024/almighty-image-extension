import {
  // ArrowRightOutlined,
  BorderOutlined,
  EditOutlined,
  // SelectOutlined,
  // UndoOutlined,
  // RedoOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import './styles/global.css';

import { ArrowControls } from './components/ArrowTool/ArrowControls';
import { useArrowTool } from './components/ArrowTool/useArrowTool';
import { BrushControls } from './components/BrushTool/BrushControls';
import { useBrushTool } from './components/BrushTool/useBrushTool';
import { ToolButton } from './components/common/ToolButton';
import { EllipseControls } from './components/EllipseTool/EllipseControls';
import { useEllipseTool } from './components/EllipseTool/useEllipseTool';
import { EllipseIcon, MosaicIcon, LineArrowIcon, TextIcon, UndoIcon, RedoIcon } from './components/Icons';
import { MosaicControls } from './components/MosaicTool/MosaicControls';
import { useMosaicTool } from './components/MosaicTool/useMosaicTool';
import { RectControls } from './components/RectTool/RectControls';
import { useRectTool } from './components/RectTool/useRectTool';
import { TextControls } from './components/TextTool/TextControls';
import { useTextTool } from './components/TextTool/useTextTool';
import { TOOL_TYPES } from './constants/tools';
import { useCanvas } from './hooks/useCanvas';
import { useHistory } from './hooks/useHistory';
import { useCanvasActions } from './hooks/useCanvasActions';
import { StyledContent, StyledHeader, StyledLayout } from './styles';
import { ActionButton } from './styles/actionButtons';

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [activeFunction, setActiveFunction] = useState(TOOL_TYPES.SELECT);
  const { canvas, selectedObject } = useCanvas(canvasRef);

  const { arrowOptions, setArrowOptions } = useArrowTool(canvas, activeFunction);
  const { textOptions, setTextOptions } = useTextTool(canvas, activeFunction);
  const { rectOptions, setRectOptions } = useRectTool(canvas, activeFunction);
  const { brushOptions, setBrushOptions } = useBrushTool(canvas, activeFunction);
  const { mosaicOptions, setMosaicOptions } = useMosaicTool(canvas, activeFunction);
  const { ellipseOptions, setEllipseOptions } = useEllipseTool(canvas, activeFunction);

  // 根据选中对象类型自动设置活动工具
  // useEffect(() => {
  //   if (!selectedObject) {
  //     setActiveFunction(TOOL_TYPES.SELECT);
  //     return;
  //   }

  //   const toolMap = {
  //     'rect': TOOL_TYPES.RECT,
  //     'ellipse': TOOL_TYPES.ELLIPSE,
  //     'arrow': TOOL_TYPES.ARROW,
  //     'textbox': TOOL_TYPES.TEXT,
  //     'path': TOOL_TYPES.BRUSH,
  //     'mosaic': TOOL_TYPES.MOSAIC
  //   };

  //   setActiveFunction(toolMap[selectedObject.type] || TOOL_TYPES.SELECT);
  // }, [selectedObject]);

  const showRectControls = activeFunction === TOOL_TYPES.RECT || selectedObject?.type === 'rect';
  // 添加显示画笔控制面板的条件
  const showBrushControls = activeFunction === TOOL_TYPES.BRUSH;
  const showMosaicControls = activeFunction === TOOL_TYPES.MOSAIC;
  const isEllipse = selectedObject?.type === 'ellipse';
  const showEllipseControls = activeFunction === TOOL_TYPES.ELLIPSE || isEllipse;

  // 新增删除逻辑
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检测是否在文本输入状态
      const isEditingText = 
        selectedObject?.isEditing ||
        (e.target instanceof HTMLElement && e.target.tagName === 'INPUT');
  
      if (['Backspace', 'Delete'].includes(e.key) && canvas && selectedObject && !isEditingText) {
        canvas.remove(selectedObject);
        canvas.discardActiveObject();
        canvas.fire('object:removed');
        canvas.renderAll();
  
        if (activeFunction === selectedObject.type) {
          setActiveFunction(TOOL_TYPES.SELECT);
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, selectedObject, activeFunction]);

  const handleToolClick = (toolType: string) => {
    if (activeFunction === toolType) {
      // 如果点击的是当前激活的工具，切换到选择模式
      setActiveFunction(TOOL_TYPES.SELECT);
      // 只有在切换到选择模式时才清除选中对象
      canvas?.discardActiveObject();
      canvas?.renderAll();
    } else {
      // 切换到新工具时，不清除当前选中的对象
      setActiveFunction(toolType);
    }
  };
  
  // 修改updateObjectProperties方法
  const updateObjectProperties = (props) => {
    if (!selectedObject || !canvas) return;

    Object.keys(props).forEach((key) => {
      selectedObject.set(key, props[key]);
    });
  
    // 增加删除状态同步
    // if (props.isDeleted) {
    //   canvas.remove(selectedObject);
    //   canvas.discardActiveObject();
    //   if (activeFunction === selectedObject.type) {
    //     setActiveFunction(TOOL_TYPES.SELECT);
    //   }
    // }
  
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  const showTextControls = activeFunction === TOOL_TYPES.TEXT || selectedObject?.type === 'textbox';
  // 显示箭头控制面板的条件
  const showArrowControls = activeFunction === TOOL_TYPES.ARROW || selectedObject?.type === 'arrow';

  // 取消注释并修改历史钩子调用
  const { undo, redo, canUndo, canRedo, saveState } = useHistory(canvas);

  // 启用对象修改事件监听
  const handleObjectModified = useCallback(
    () => {
      if (!canvas) return;
      saveState();
    },
    [canvas, saveState],
  );

  useEffect(() => {
    if (!canvas) return;

    const events = [
      'object:modified',
      'object:added',
      'object:removed',
      'path:created',
    ];

    events.forEach(event => {
      canvas.on(event, handleObjectModified);
    });

    return () => {
      events.forEach(event => {
        canvas.off(event, handleObjectModified);
      });
    };
  }, [canvas, handleObjectModified]);
  
  // 在useEffect中添加画布选择监听
  useEffect(() => {
    if (!canvas) return;
  
    canvas.on('selection:created', (e) => {
      // console.log('selection:created', e);
      if (e.selected?.length === 1) {
        const type = e.selected[0].type;
        const toolMap = {
          'rect': TOOL_TYPES.RECT,
          'ellipse': TOOL_TYPES.ELLIPSE,
          'arrow': TOOL_TYPES.ARROW,
          'textbox': TOOL_TYPES.TEXT,
          'path': TOOL_TYPES.BRUSH,
          'mosaic': TOOL_TYPES.MOSAIC
        };
        setActiveFunction(toolMap[type] || TOOL_TYPES.SELECT);
      }
    });
  
    canvas.on('selection:cleared', () => {
      setActiveFunction(TOOL_TYPES.SELECT);
    });
  
    return () => {
      canvas.off('selection:created');
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  const { copyCanvas, downloadCanvas } = useCanvasActions(canvas);

  return (
    <StyledLayout>
      <StyledHeader>
        <Space>
          <ToolButton 
            disabled={!canUndo} 
            active={false}
            icon={<UndoIcon />} 
            onClick={undo} 
          />

          <ToolButton 
            disabled={!canRedo} 
            active={false}
            icon={<RedoIcon />} 
            onClick={redo} 
          />

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.TEXT}
              icon={<TextIcon />}
              tooltip="文本"
              onClick={() => handleToolClick(TOOL_TYPES.TEXT)}
            />
            {showTextControls && (
              <TextControls
                selectedObject={selectedObject?.type === 'textbox' ? selectedObject : null}
                defaultTextOptions={textOptions}
                onUpdateSelected={updateObjectProperties}
                onUpdateDefaults={(props) => setTextOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.ARROW}
              icon={<LineArrowIcon />}
              tooltip="箭头"
              onClick={() => handleToolClick(TOOL_TYPES.ARROW)}
            />
            {showArrowControls && (
              <ArrowControls
                defaultArrowOptions={arrowOptions}
                selectedObject={selectedObject?.type === 'arrow' ? selectedObject : null}
                onUpdateSelected={updateObjectProperties}
                onUpdateDefaults={(props) => setArrowOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.BRUSH}
              icon={<EditOutlined />}
              tooltip="画笔"
              onClick={() => handleToolClick(TOOL_TYPES.BRUSH)}
            />
            {showBrushControls && (
              <BrushControls
                defaultBrushOptions={brushOptions}
                onUpdateDefaults={(props) => setBrushOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.RECT}
              icon={<BorderOutlined />}
              tooltip="矩形"
              onClick={() => handleToolClick(TOOL_TYPES.RECT)}
            />
            {showRectControls && (
              <RectControls
                selectedObject={selectedObject?.type === 'rect' ? selectedObject : null}
                defaultRectOptions={rectOptions}
                onUpdateSelected={updateObjectProperties}
                onUpdateDefaults={(props) => setRectOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.ELLIPSE}
              icon={<EllipseIcon />}
              tooltip="圆"
              onClick={() => handleToolClick(TOOL_TYPES.ELLIPSE)}
            />
            {showEllipseControls && (
              <EllipseControls
                selectedObject={isEllipse ? selectedObject : null}
                defaultEllipseOptions={ellipseOptions}
                onUpdateSelected={updateObjectProperties}
                onUpdateDefaults={(props) => setEllipseOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <ToolButton
              active={activeFunction === TOOL_TYPES.MOSAIC}
              icon={<MosaicIcon />}
              tooltip="马赛克"
              onClick={() => handleToolClick(TOOL_TYPES.MOSAIC)}
            />
            {showMosaicControls && (
              <MosaicControls
                options={mosaicOptions}
                onUpdate={(props) => setMosaicOptions((prev) => ({ ...prev, ...props }))}
              />
            )}
          </div>
        </Space>

        <Space style={{ position: 'absolute', right: '24px' }}>
          <ActionButton onClick={copyCanvas}>
            复制
          </ActionButton>
          <ActionButton onClick={downloadCanvas} isLast={true} primary={true}>
            下载
          </ActionButton>
        </Space>
      </StyledHeader>
      <StyledContent>
        <canvas ref={canvasRef} />
      </StyledContent>
    </StyledLayout>
  );
};

export default ImageEditor;
