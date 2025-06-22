import { fabric } from 'fabric';

// 定义从对象反序列化的接口
interface ArrowObjectData extends fabric.ILineOptions {
  type: 'arrow';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

interface TextBoxObjectData extends fabric.ITextboxOptions {
  type: 'textbox';
  text: string;
}

// 确保自定义类型只注册一次的标志
let customTypesRegistered = false;

// 统一注册所有自定义Fabric类型
export const registerCustomFabricTypes = () => {
  if (customTypesRegistered) return;

  // 注册箭头类型
  if (!Object.hasOwnProperty.call(fabric, 'Arrow')) {
    const ArrowClass = fabric.util.createClass(fabric.Line, {
      type: 'arrow',
      superType: 'drawing',
      initialize(points: number[], options: fabric.ILineOptions) {
        if (!points) {
          const opts = options as fabric.ILineOptions & { x1?: number; y1?: number; x2?: number; y2?: number };
          points = [opts.x1 || 0, opts.y1 || 0, opts.x2 || 0, opts.y2 || 0];
        }
        options = options || {};
        this.callSuper('initialize', points, options);
      },
      _render(ctx: CanvasRenderingContext2D) {
        this.callSuper('_render', ctx);
        ctx.save();
        ctx.scale(1 / this.scaleX, 1 / this.scaleY);
        const xDiff = (this.x2 - this.x1) * this.scaleX;
        const yDiff = (this.y2 - this.y1) * this.scaleY;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate(
          ((this.x2 - this.x1) / 2) * this.scaleX,
          ((this.y2 - this.y1) / 2) * this.scaleY,
        );
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.stroke;
        ctx.fillStyle = this.stroke;
        ctx.stroke();
        ctx.fill();
        ctx.restore();
      },
      toObject() {
        return fabric.util.object.extend(this.callSuper('toObject'), {
          type: 'arrow'
        });
      }
    });

    // 添加fromObject静态方法，这是关键！
    ArrowClass.fromObject = function(object: ArrowObjectData, callback?: (obj: fabric.Object) => void) {
      const points = [object.x1 || 0, object.y1 || 0, object.x2 || 0, object.y2 || 0];
      const arrow = new ArrowClass(points, object);
      if (callback) {
        callback(arrow);
      }
      return arrow;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).Arrow = ArrowClass;
  }

  // 注册文本框类型
  if (!Object.hasOwnProperty.call(fabric, 'TextBox')) {
    const TextBoxClass = fabric.util.createClass(fabric.IText, {
      type: 'textbox',
      superType: 'drawing',
      initialize: function(text: string, options: fabric.ITextboxOptions) {
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
          fill: this.fill,
          type: 'textbox'
        });
      },
      onDblClick: function() {
        if (!this.editable) return;
        
        if (!this.canvas) return;
        this.canvas.setActiveObject(this);
        
        this.enterEditing();
        this.selectAll();
        this.canvas.requestRenderAll();
      }
    });

    // 添加fromObject静态方法，这是关键！
    TextBoxClass.fromObject = function(object: TextBoxObjectData, callback?: (obj: fabric.Object) => void) {
      const textbox = new TextBoxClass(object.text || '', object);
      if (callback) {
        callback(textbox);
      }
      return textbox;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fabric as any).TextBox = TextBoxClass;
  }

  customTypesRegistered = true;
  console.log('自定义Fabric类型已注册');
};

// 重置注册状态（用于测试）
export const resetCustomTypesRegistration = () => {
  customTypesRegistered = false;
}; 