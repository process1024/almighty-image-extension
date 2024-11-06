// src/components/ImageEditor/ImageEditor.jsx
import {
  ArrowRightOutlined,
  BorderOutlined,
  FontSizeOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { initArrowClass } from './components/ArrowTool/Arrow';
import { ArrowControls } from './components/ArrowTool/ArrowControls';
import { useArrowTool } from './components/ArrowTool/useArrowTool';
import { ToolButton } from './components/common/ToolButton';
import { RectControls } from './components/RectTool/RectControls';
import { useRectTool } from './components/RectTool/useRectTool';
import { initTextClass } from './components/TextTool/TextBox';
import { TextControls } from './components/TextTool/TextControls';
import { useTextTool } from './components/TextTool/useTextTool';
import { TOOL_TYPES } from './constants/tools';
import { useCanvas } from './hooks/useCanvas';
import { StyledContent, StyledHeader, StyledLayout } from './styles';

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const [activeFunction, setActiveFunction] = useState(TOOL_TYPES.SELECT);
  const { canvas, selectedObject } = useCanvas(canvasRef);

  const { arrowOptions, setArrowOptions } = useArrowTool(canvas, activeFunction);

  const { textOptions, setTextOptions } = useTextTool(canvas, activeFunction);

  const { rectOptions, setRectOptions } = useRectTool(canvas, activeFunction);

  useEffect(() => {
    initArrowClass();
    initTextClass();
  }, []);

  const showRectControls = activeFunction === TOOL_TYPES.RECT || selectedObject?.type === 'rect';

  const updateObjectProperties = (props) => {
    if (!selectedObject || !canvas) return;

    Object.keys(props).forEach((key) => {
      selectedObject.set(key, props[key]);
    });

    canvas.renderAll();
    canvas.fire('object:modified');
  };

  // 显示文字控制面板的条件
  const showTextControls = activeFunction === TOOL_TYPES.TEXT || selectedObject?.type === 'textbox';

  // 显示箭头控制面板的条件
  const showArrowControls = activeFunction === TOOL_TYPES.ARROW || selectedObject?.type === 'arrow';

  return (
    <StyledLayout>
      <StyledHeader>
        <Space>
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
              selectedObject={selectedObject?.type === 'arrow' ? selectedObject : null}
              defaultArrowOptions={arrowOptions}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setArrowOptions((prev) => ({ ...prev, ...props }))}
            />
          )}

          {showRectControls && (
            <RectControls
              selectedObject={selectedObject?.type === 'rect' ? selectedObject : null}
              defaultRectOptions={rectOptions}
              onUpdateSelected={updateObjectProperties}
              onUpdateDefaults={(props) => setRectOptions(prev => ({ ...prev, ...props }))}
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
