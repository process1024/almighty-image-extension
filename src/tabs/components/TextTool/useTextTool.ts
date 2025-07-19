// src/components/ImageEditor/components/TextTool/useTextTool.js
import { useState, useEffect } from 'react';
import { TOOL_TYPES } from '../../constants/tools';
import { fabric } from 'fabric';
import { registerCustomFabricTypes } from '../../utils/fabricCustomTypes';

export const useTextTool = (canvas, activeFunction) => {
  const [textOptions, setTextOptions] = useState({
    fontSize: 20,
    fill: '#000000',
    fontFamily: 'Arial',
    textAlign: 'left'
  });

  useEffect(() => {
    if (!canvas) return;
    
    // 使用统一的自定义类型注册
    registerCustomFabricTypes();

    const handleMouseDown = (options) => {
      if (!canvas) return;

      // 当存在激活对象时，取消激活并阻止新建文本
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // canvas.discardActiveObject();
        // canvas.requestRenderAll();
        return;
      }

      if (options.target || activeFunction !== TOOL_TYPES.TEXT) return;

      const pointer = canvas.getPointer(options.e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = new (fabric as any).TextBox('双击编辑文字', {
        left: pointer.x,
        top: pointer.y,
        ...textOptions,
        // 设置选中框样式
        // borderColor: textOptions.fill,
        // cornerColor: textOptions.fill,
        // cornerStyle: 'circle',
        // transparentCorners: false,
        // borderDashArray: [5, 5],
        // // 设置控制点
        // hasControls: true,
        // hasBorders: true,
        // lockScalingX: false,
        // lockScalingY: false,
        // lockMovementX: false,
        // lockMovementY: false,
        // lockRotation: false,
        // lockUniScaling: true,
        // // 设置控制点大小
        // cornerSize: 10,
        // // 设置控制点距离边界的距离
        // padding: 5,
        // // 确保可以编辑
        // editable: true,
        // // 设置选中框样式
        // borderScaleFactor: 2,
        // // 设置最小尺寸
        // minScaleLimit: 0.1,
        // // 设置最大尺寸
        // maxScaleLimit: 10
      });

      // 添加文本到画布
      canvas.add(text);
      
      // 设置为活动对象
      canvas.setActiveObject(text);
      
      // 强制渲染
      canvas.requestRenderAll();
      
      // 延迟进入编辑模式
      // setTimeout(() => {
      //   text.enterEditing();
      //   text.selectAll();
      //   canvas.requestRenderAll();
      // }, 100);
    };

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
    };
  }, [canvas, activeFunction, textOptions]);

  return {
    textOptions,
    setTextOptions
  };
};