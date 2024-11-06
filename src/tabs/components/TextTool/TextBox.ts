// src/components/ImageEditor/components/TextTool/TextBox.js
import { fabric } from 'fabric';

export const initTextClass = () => {
  fabric.TextBox = fabric.util.createClass(fabric.IText, {
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
        cornerSize: 6,
        transparentCorners: false,
        lockUniScaling: true
      });
    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        textAlign: this.textAlign,
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fill: this.fill
      });
    }
  });
};