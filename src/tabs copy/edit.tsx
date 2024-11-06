import { fabric } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import './edit.less';
// import { ColorPicker } from 'antd';
import { getBase64ImageDimensions } from '~utils/image';
import { createEditor } from './create-editor';
import TextControls from './components/TextControls';
import ArrowControls from './components/ArrowControls';

function EditorPage() {
  const canvasRef = useRef(null);

  const [editype, setEditype] = useState('');
  const [editor, setEditor] = useState({});
  const [history, setHistory] = useState([]);
  const [activeFunction, setActiveFunction] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // 添加拖拽状态

  const canvas = editor.canvas;


  const [isDrawing, setIsDrawing] = useState(false);
  const [arrowStart, setArrowStart] = useState(null);
  const [currentArrow, setCurrentArrow] = useState(null);

  function onChange(value) {
    if(editype === value)  {
      setEditype('');
      editor.canvas.discardActiveObject();
      editor.canvas.renderAll();
      // console.log(editor.canvas);
      return;
    }
    setEditype(value);

    switch (value) {
      case 'text':
        addText();
        break;
      case 'arrow':
        break;
      case 'rect':
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const { editor: e } = createEditor(canvasRef.current);
    setEditor(e);
    chrome.storage.local.get(['imageData']).then(async (res) => {
      const { imageData } = res;
      const { width, height } = await getBase64ImageDimensions(imageData);

      e.canvas.setWidth(width);
      e.canvas.setHeight(height);

      e.canvas.setBackgroundImage(imageData, e.canvas.renderAll.bind(e.canvas));
    });


    e.canvas.on('selection:created', (e) => {
      console.log(e)
    });
    e.canvas.on('selection:updated', (e) => {
      console.log(e)
    });
    e.canvas.on('selection:cleared', (e) => {
      console.log(e)
    });
  }, []);

  useEffect(() => {
    if (!editor.canvas) return;

    editor.canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected[0]);
    });

    editor.canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    editor.canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected[0]);
    });

    editor.canvas.on('object:modified', () => {
      saveState(editor.canvas);
    });
  }, [editor.canvas]);

  // 箭头元素
  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (options) => {
      // 如果点击到了已有对象，不启动绘制
      if (options.target || activeFunction !== 'arrow') {
        return;
      }

      const pointer = canvas.getPointer(options.e);
      setIsDrawing(true);
      setArrowStart({ x: pointer.x, y: pointer.y });

      const arrow = new fabric.Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: 2,
        stroke: '#000000',
        selectable: true,
        hasControls: true,
        hasBorders: true,
        perPixelTargetFind: true,
        cornerStyle: 'circle',
        cornerSize: 8,
        transparentCorners: false
      });

      canvas.add(arrow);
      setCurrentArrow(arrow);
    };

    const handleMouseMove = (options) => {
      if (!isDrawing || activeFunction !== 'arrow') return;

      const pointer = canvas.getPointer(options.e);
      if (currentArrow) {
        currentArrow.set({
          x2: pointer.x,
          y2: pointer.y
        });
        canvas.renderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawing || activeFunction !== 'arrow') return;

      setIsDrawing(false);
      if (currentArrow) {
        currentArrow.set({
          selectable: true,
          hasControls: true,
          hasBorders: true
        });
        canvas.renderAll();
        saveState(canvas);
        setCurrentArrow(null);
      }
    };

    // 添加对象拖动事件处理
    const handleObjectMoving = () => {
      setIsDragging(true);
    };

    const handleObjectModified = () => {
      setIsDragging(false);
      saveState(canvas);
    };

    // 选择事件处理
    const handleSelection = (e) => {
      if (e.target) {
        setSelectedObject(e.target);
        // 选中对象时禁用画布事件，除非当前不是箭头工具
        if (activeFunction === 'arrow') {
          canvas.selection = true;
          canvas.forEachObject((obj) => {
            obj.selectable = true;
            obj.evented = true;
          });
        }
      } else {
        setSelectedObject(null);
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelection);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelection);
    };
  }, [canvas, isDrawing, activeFunction, currentArrow, isDragging]);

  // 修改箭头类定义
  useEffect(() => {
    fabric.Arrow = fabric.util.createClass(fabric.Line, {
      type: 'arrow',
      initialize: function(points, options) {
        options = options || {};
        // 设置默认属性
        options.selectable = true;
        options.hasControls = true;
        options.hasBorders = true;
        this.callSuper('initialize', points, options);
      },
      _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.save();
        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate(this.x2, this.y2);
        ctx.rotate(angle);
        ctx.beginPath();
        // 调整箭头头部大小，使其更容易选中
        ctx.moveTo(-20, -10);
        ctx.lineTo(0, 0);
        ctx.lineTo(-20, 10);
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
        if (this.fill) {
          ctx.fillStyle = this.fill;
          ctx.fill();
        }
        ctx.restore();
      },
      // 添加点击检测范围
      _findTargetCorner: fabric.Object.prototype._findTargetCorner,
      _getActionFromCorner: fabric.Object.prototype._getActionFromCorner
    });
  }, []);

  // 更新箭头属性
  const updateArrowProperties = (properties) => {
    if (!selectedObject || !canvas) return;

    selectedObject.set(properties);
    canvas.renderAll();
    saveState(canvas);
  };


  const addText = () => {
    if (!editor.canvas) return;

    const text = new fabric.IText('双击编辑文字', {
      left: editor.canvas.width / 2,
      top: editor.canvas.height / 2,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#000000',
      originX: 'center',
      originY: 'center',
    });

    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.centerObject(text);
    text.enterEditing();
    editor.canvas.renderAll();
    saveState(editor.canvas);
  };

  const updateTextProperties = (properties) => {
    if (!selectedObject || !editor.canvas) return;

    selectedObject.set(properties);
    editor.canvas.renderAll();
    saveState(editor.canvas);
  };

  // 保存画布状态
  const saveState = (canvas) => {
    if (!canvas) return;
    
    const json = canvas.toJSON();
    const newHistory = [...history.slice(0, historyIndex + 1), json];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  
  const handleToolClick = (tool) => {
    setActiveFunction(tool);
    if (canvas) {
      canvas.isDrawingMode = false;
      
      if (tool === 'arrow') {
        // 切换到箭头工具时，允许选择对象
        canvas.selection = true;
        canvas.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
      }
      
      // 清除当前选中的对象
      canvas.discardActiveObject();
      canvas.renderAll();
    }
    setSelectedObject(null);
  };

  // 撤销
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      editor.canvas.loadFromJSON(history[newIndex], () => {
        editor.canvas.renderAll();
      });
    }
  };

  // 重做
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      editor.canvas.loadFromJSON(history[newIndex], () => {
        editor.canvas.renderAll();
      });
    }
  };

  // function colorChange(e) {
  //   const hex = e.toRgbString();
  //   const activeObject = editor.canvas.getActiveObject();
  //   activeObject.set('fill',  hex);
  //   editor.canvas.renderAll();
  // }

  return (
    // <EditorContext.Provider value={{ editor }}>
    <div className="editor-page">
      <div className="toolbar">
        <div className={`editor-btn ${historyIndex <= 0 ? 'disabled' : ''}`} onClick={undo}>
          <div>回退</div>
        </div>
        <div className={`editor-btn ${historyIndex >= history.length - 1 ? 'disabled': ''}`} onClick={redo}>
          <div>前进</div>
        </div>
        <div className="editor-btn" onClick={() => handleToolClick('text')}>
          <div>文字</div>
        </div>
        {/* <div className={`editor-btn  ${editype === 'text' ? 'active' : ''}`}>
          <div onClick={() => onChange('text')}>文字</div>
          <div className="tool-menu">
            <span>字体</span>
            <span>字体大小</span>
            <span>
              <ColorPicker defaultValue="#000" onChange={colorChange} />
            </span>
          </div>
        </div> */}
        <div className="editor-btn" onClick={() => handleToolClick('arrow')}>
          <div>箭头</div>
        </div>
        <div className="editor-btn" onClick={() => onChange('rect')}>
          <div>矩形</div>
        </div>
      </div>

      <div className="editor-container">
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} />
        </div>

        {selectedObject && selectedObject.type === 'i-text' && (
          <TextControls
            textObject={selectedObject}
            onUpdate={updateTextProperties}
          />
        )}

        {selectedObject && selectedObject.type === 'arrow' && (
          <ArrowControls
            arrowObject={selectedObject}
            onUpdate={updateArrowProperties}
          />
        )}
      </div>
    </div>
  );
}

export default EditorPage;
