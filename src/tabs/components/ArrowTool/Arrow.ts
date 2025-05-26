// src/components/ImageEditor/components/ArrowTool/Arrow.js
import { fabric } from 'fabric';

export const initArrowClass = () => {
  fabric.Arrow = fabric.util.createClass(fabric.Line, {
    type: 'arrow',

    initialize: function(points, options) {
      options = options || {};
      this.callSuper('initialize', points, options);
    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        type: this.type
      });
    },

    _render: function(ctx) {
      const headLength = 20;  // 箭头头部长度
      const headAngle = Math.PI / 6; // 30度角

      // 计算主线条方向
      const dx = this.width;
      const dy = this.height;
      const angle = Math.atan2(dy, dx);

      // 绘制主线条
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(dx, dy);
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      ctx.stroke();

      // 绘制箭头头部
      ctx.beginPath();
      // 从线条末端开始绘制箭头
      ctx.moveTo(dx, dy);
      // 绘制箭头的左边
      ctx.lineTo(
        dx - headLength * Math.cos(angle - headAngle),
        dy - headLength * Math.sin(angle - headAngle)
      );
      // 回到箭头顶点，绘制右边
      ctx.moveTo(dx, dy);
      ctx.lineTo(
        dx - headLength * Math.cos(angle + headAngle),
        dy - headLength * Math.sin(angle + headAngle)
      );
      ctx.stroke();
    }
  });

  fabric.Arrow.fromObject = function(object, callback) {
    const points = [object.x1, object.y1, object.x2, object.y2];
    callback && callback(new fabric.Arrow(points, object));
  };
};