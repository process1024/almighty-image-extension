// src/components/ImageEditor/components/TextTool/TextBox.js
import { fabric } from 'fabric';

export const createTextClass = () => {
  return fabric.util.createClass(fabric.IText, {
    type: 'textbox',
    superType: 'drawing',

    initialize: function(text, options) {
      options = options || {};
      this.callSuper('initialize', text, {
        ...options,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        editingBorderColor: '#1890ff',
        borderColor: '#1890ff',
        cornerColor: '#1890ff',
        cornerStyle: 'circle',
        cornerSize: 8,
        transparentCorners: false,
        lockUniScaling: true,
        editable: true,
        borderScaleFactor: 2,
        padding: 5,
        cornerStrokeColor: '#1890ff',
        lockRotation: false,
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        minScaleLimit: 0.1,
        maxScaleLimit: 10
      });
    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        textAlign: this.textAlign,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fill: this.fill
      });
    },

    onDblClick: function() {
      console.log('this', this)
      if (!this.editable) return;
      
      if (!this.canvas) return;
      this.canvas.setActiveObject(this);
      
      this.enterEditing();
      
      this.selectAll();
      
      this.canvas.requestRenderAll();

      console.log('this', this)
    }
  });
};