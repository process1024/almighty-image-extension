import {
  ArrowRightOutlined,
  BorderOutlined,
  FontSizeOutlined,
  SelectOutlined,
  UndoOutlined,
  RedoOutlined,
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
import { EllipseIcon, MosaicIcon } from './components/Icons';
import { MosaicControls } from './components/MosaicTool/MosaicControls';
import { useMosaicTool } from './components/MosaicTool/useMosaicTool';
import { RectControls } from './components/RectTool/RectControls';
import { useRectTool } from './components/RectTool/useRectTool';
import { initTextClass } from './components/TextTool/TextBox';
import { TextControls } from './components/TextTool/TextControls';
import { useTextTool } from './components/TextTool/useTextTool';
import { TOOL_TYPES } from './constants/tools';
import { useCanvas } from './hooks/useCanvas';
import { useHistory } from './hooks/useHistory';
import { StyledContent, StyledHeader, StyledLayout } from './styles';

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

  useEffect(() => {
    // initArrowClass();
    initTextClass();
  }, []);

  const showRectControls = activeFunction === TOOL_TYPES.RECT || selectedObject?.type === 'rect';
  // 添加显示画笔控制面板的条件
  const showBrushControls = activeFunction === TOOL_TYPES.BRUSH;

  const showMosaicControls = activeFunction === TOOL_TYPES.MOSAIC;

  const isEllipse = selectedObject?.type === 'ellipse';
  const showEllipseControls = activeFunction === TOOL_TYPES.ELLIPSE || isEllipse;

  const updateObjectProperties = (props) => {
    if (!selectedObject || !canvas) return;

    Object.keys(props).forEach((key) => {
      selectedObject.set(key, props[key]);
    });

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
      'selection:created',
      'selection:updated',
      'selection:cleared'
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

  // 在工具栏添加撤销/重做按钮
  return (
    <StyledLayout>
      <StyledHeader>
        <Space>
          {/* 在现有工具按钮后添加 */}
          <ToolButton 
            disabled={!canUndo} 
            active={false}
            icon={<UndoOutlined />} 
            onClick={undo} 
          />
          <ToolButton 
            disabled={!canRedo} 
            active={false}
            icon={<RedoOutlined />} 
            onClick={redo} 
          />
          <ToolButton
            active={activeFunction === TOOL_TYPES.SELECT}
            icon={<SelectOutlined />}
            onClick={() => setActiveFunction(TOOL_TYPES.SELECT)}
          />

          <ToolButton
            active={activeFunction === TOOL_TYPES.TEXT}
            icon={<FontSizeOutlined />}
            onClick={() => setActiveFunction(TOOL_TYPES.TEXT)}
          />
          <ToolButton
            active={activeFunction === TOOL_TYPES.ARROW}
            icon={<ArrowRightOutlined />}
            onClick={() => setActiveFunction(TOOL_TYPES.ARROW)}
          />

          <ToolButton
            active={activeFunction === TOOL_TYPES.RECT}
            icon={<BorderOutlined />}
            onClick={() => setActiveFunction(TOOL_TYPES.RECT)}
          />

          <ToolButton
            active={activeFunction === TOOL_TYPES.ELLIPSE}
            icon={<EllipseIcon />} // 椭圆轮廓图标
            onClick={() => setActiveFunction(TOOL_TYPES.ELLIPSE)}
          />

          <ToolButton
            active={activeFunction === TOOL_TYPES.MOSAIC}
            icon={<MosaicIcon />}  // 网格图标
            onClick={() => setActiveFunction(TOOL_TYPES.MOSAIC)}
          />

          {showTextControls && (
            <TextControls
              selectedObject={selectedObject?.type === 'textbox' ? selectedObject : null}
              defaultTextOptions={textOptions}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setTextOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showArrowControls && (
            <ArrowControls
              defaultArrowOptions={arrowOptions}
              selectedObject={selectedObject?.type === 'arrow' ? selectedObject : null}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setArrowOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showRectControls && (
            <RectControls
              selectedObject={selectedObject?.type === 'rect' ? selectedObject : null}
              defaultRectOptions={rectOptions}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setRectOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showBrushControls && (
            <BrushControls
              defaultBrushOptions={brushOptions}
              onUpdateDefaults={(props) => setBrushOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showMosaicControls && (
            <MosaicControls
              options={mosaicOptions}
              onUpdate={(props) => setMosaicOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showEllipseControls && (
            <EllipseControls
              selectedObject={isEllipse ? selectedObject : null}
              defaultEllipseOptions={ellipseOptions}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setEllipseOptions((prev) => ({ ...prev, ...props }))}
            />
          )}
        </Space>
      </StyledHeader>
      <StyledContent>
        <canvas ref={canvasRef} />
      </StyledContent>
    </StyledLayout>
  );
};

export default ImageEditor;
