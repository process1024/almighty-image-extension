import {
  // ArrowRightOutlined,
  BorderOutlined,
  EditOutlined,
  // SelectOutlined,
  // UndoOutlined,
  // RedoOutlined,
} from '@ant-design/icons';
import { Space } from 'antd';
import { fabric } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';

import './styles/global.css';

import { ArrowControls } from './components/ArrowTool/ArrowControls';
import { useArrowTool } from './components/ArrowTool/useArrowTool';
import { BrushControls } from './components/BrushTool/BrushControls';
import { useBrushTool } from './components/BrushTool/useBrushTool';
import { ToolButton } from './components/common/ToolButton';
import { EllipseControls } from './components/EllipseTool/EllipseControls';
import { useEllipseTool } from './components/EllipseTool/useEllipseTool';
import {
  EllipseIcon,
  LineArrowIcon,
  MosaicIcon,
  RedoIcon,
  TextIcon,
  UndoIcon,
} from './components/Icons';
import { MosaicControls } from './components/MosaicTool/MosaicControls';
import { useMosaicTool } from './components/MosaicTool/useMosaicTool';
import { RectControls } from './components/RectTool/RectControls';
import { useRectTool } from './components/RectTool/useRectTool';
import { TextControls } from './components/TextTool/TextControls';
import { useTextTool } from './components/TextTool/useTextTool';
import { TOOL_TYPES } from './constants/tools';
import { useCanvas } from './hooks/useCanvas';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useHistory } from './hooks/useHistory';
import { StyledContent, StyledHeader, StyledLayout } from './styles';
import { ActionButton } from './styles/actionButtons';

// 定义类型接口
interface EditableObject extends fabric.Object {
  isEditing?: boolean;
}

const ImageEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFunction, setActiveFunction] = useState(TOOL_TYPES.SELECT);
  // 用户主动选择的工具 - 这是用户真正想要使用的工具
  const [userSelectedTool, setUserSelectedTool] = useState(TOOL_TYPES.SELECT);
  // 是否处于临时显示状态（因选中元素而显示对应工具）
  const [isTemporaryDisplay, setIsTemporaryDisplay] = useState(false);
  // 标志是否正在处理用户主动的工具切换操作
  const [isUserAction, setIsUserAction] = useState(false);

  const { canvas, selectedObject } = useCanvas(canvasRef);

  const { arrowOptions, setArrowOptions } = useArrowTool(canvas, activeFunction);
  const { textOptions, setTextOptions } = useTextTool(canvas, activeFunction);
  const { rectOptions, setRectOptions } = useRectTool(canvas, activeFunction);
  const { brushOptions, setBrushOptions } = useBrushTool(canvas, activeFunction);
  const { mosaicOptions, setMosaicOptions } = useMosaicTool(canvas, activeFunction);
  const { ellipseOptions, setEllipseOptions } = useEllipseTool(canvas, activeFunction);

  // 控制面板显示逻辑 - 基于当前激活的工具类型
  const showRectControls = activeFunction === TOOL_TYPES.RECT;
  const showBrushControls = activeFunction === TOOL_TYPES.BRUSH;
  const showMosaicControls = activeFunction === TOOL_TYPES.MOSAIC;
  const showEllipseControls = activeFunction === TOOL_TYPES.ELLIPSE;
  const showTextControls = activeFunction === TOOL_TYPES.TEXT;
  const showArrowControls = activeFunction === TOOL_TYPES.ARROW;

  // 取消注释并修改历史钩子调用
  const { undo, redo, canUndo, canRedo } = useHistory(canvas);

  // 启用对象修改事件监听 - 现在由useHistory自动处理
  // const handleObjectModified = useCallback(() => {
  //   if (!canvas) return;
  //   // 使用防抖保存，避免频繁的小改动触发过多保存
  //   debouncedSaveState();
  // }, [canvas, debouncedSaveState]);

  // 处理重要操作的立即保存 - 现在由useHistory自动处理
  // const handleImportantChange = useCallback(() => {
  //   if (!canvas) return;
  //   // 立即保存重要操作
  //   saveState();
  // }, [canvas, saveState]);

  // useHistory现在自动处理所有事件监听
  // useEffect(() => {
  //   if (!canvas) return;

  //   // 监听对象的修改、移动、缩放等操作（使用防抖）
  //   const modifyEvents = [
  //     'object:modified',
  //     'object:scaling',
  //     'object:moving',
  //     'object:rotating',
  //     'object:skewing',
  //   ];

  //   // 监听重要操作（立即保存）
  //   const importantEvents = ['object:added', 'object:removed', 'path:created'];

  //   modifyEvents.forEach((event) => {
  //     canvas.on(event, handleObjectModified);
  //   });

  //   importantEvents.forEach((event) => {
  //     canvas.on(event, handleImportantChange);
  //   });

  //   return () => {
  //     modifyEvents.forEach((event) => {
  //       canvas.off(event, handleObjectModified);
  //     });
  //     importantEvents.forEach((event) => {
  //       canvas.off(event, handleImportantChange);
  //     });
  //   };
  // }, [canvas, handleObjectModified, handleImportantChange]);

  // 处理删除操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检测是否在文本输入状态
      const isEditingText =
        (selectedObject as EditableObject)?.isEditing ||
        (e.target instanceof HTMLElement && e.target.tagName === 'INPUT');

      if (['Backspace', 'Delete'].includes(e.key) && canvas && selectedObject && !isEditingText) {
        canvas.remove(selectedObject);
        canvas.discardActiveObject();
        canvas.renderAll();

        if (activeFunction === selectedObject.type) {
          setActiveFunction(TOOL_TYPES.SELECT);
        }

        // 删除操作会被useHistory自动记录，无需手动保存
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, selectedObject, activeFunction]);

  // 处理用户主动点击工具按钮
  const handleToolClick = (toolType: string) => {
    console.log('handleToolClick', toolType);
    console.log('userSelectedTool', userSelectedTool);
    console.log('isTemporaryDisplay', isTemporaryDisplay);

    // 标记这是用户主动操作
    setIsUserAction(true);

    if (userSelectedTool === toolType) {
      //   // 如果点击的是当前用户选择的工具，切换到选择模式
      setUserSelectedTool(TOOL_TYPES.SELECT);
      setActiveFunction(TOOL_TYPES.SELECT);
      setIsTemporaryDisplay(false);
      //   // 清除选中对象
      canvas?.discardActiveObject();
      canvas?.renderAll();
    } else {
      // 用户主动选择新工具
      setUserSelectedTool(toolType);
      setActiveFunction(toolType);
      setIsTemporaryDisplay(false);
      // 清除选中对象，准备使用新工具
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }
  };

  // 修改updateObjectProperties方法
  const updateObjectProperties = (props: Record<string, unknown>) => {
    if (!selectedObject || !canvas) return;

    Object.keys(props).forEach((key) => {
      (selectedObject as fabric.Object & { set: (key: string, value: unknown) => void }).set(
        key,
        props[key],
      );
    });

    canvas.renderAll();
    canvas.fire('object:modified');
  };

  // 画布选择事件监听
  useEffect(() => {
    if (!canvas) return;

    // 处理选中对象
    const handleSelectionCreated = (e: fabric.IEvent<Event>) => {
      const event = e as fabric.IEvent<Event> & { selected?: fabric.Object[] };
      if (event.selected?.length === 1) {
        const selectedObj = event.selected[0];
        const type = selectedObj.type;

        const toolMap: Record<string, string> = {
          rect: TOOL_TYPES.RECT,
          ellipse: TOOL_TYPES.ELLIPSE,
          arrow: TOOL_TYPES.ARROW,
          textbox: TOOL_TYPES.TEXT,
          path: TOOL_TYPES.BRUSH,
          mosaic: TOOL_TYPES.MOSAIC,
        };

        const mappedTool = toolMap[type];
        if (mappedTool) {
          // 临时显示对应工具的控制面板，用于修改元素属性
          setActiveFunction(mappedTool);
          setIsTemporaryDisplay(true);
        }
      }
    };

    // 处理选择更新（从一个对象切换到另一个对象）
    const handleSelectionUpdated = (e: fabric.IEvent<Event>) => {
      handleSelectionCreated(e); // 使用相同的逻辑
    };

    // 处理取消选择
    const handleSelectionCleared = () => {

      // 如果是用户主动操作导致的选择清除，不要恢复工具状态
      if (isUserAction) {
        return;
      }

      if (isTemporaryDisplay) {
        // 如果当前是临时显示状态，恢复到用户主动选择的工具
        setActiveFunction(userSelectedTool);
        setIsTemporaryDisplay(false);
      }
      // 如果不是临时显示状态，保持当前工具状态
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [canvas, userSelectedTool, isTemporaryDisplay, isUserAction]);

  const { copyCanvas, downloadCanvas } = useCanvasActions(canvas);

  return (
    <StyledLayout>
      <StyledHeader>
        <Space>
          <ToolButton disabled={!canUndo} active={false} icon={<UndoIcon />} onClick={undo} />

          <ToolButton disabled={!canRedo} active={false} icon={<RedoIcon />} onClick={redo} />

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
                selectedObject={selectedObject?.type === 'ellipse' ? selectedObject : null}
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
          <ActionButton onClick={copyCanvas}>复制</ActionButton>
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
