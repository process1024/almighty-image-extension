import { fabric } from 'fabric';
import { message } from 'antd';

export const useCanvasActions = (canvas: fabric.Canvas | null) => {
  const copyCanvas = async () => {
    if (!canvas) {
      message.error('画布未就绪，无法复制');
      return false;
    }
    
    // 显示加载提示
    const hide = message.loading('正在复制图片到剪贴板...', 0);
    
    try {
      // 将画布转换为 base64 图片数据
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      // 将 base64 转换为 Blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      hide();
      message.success('图片已成功复制到剪贴板！');
      return true;
    } catch (error) {
      hide();
      console.error('复制失败:', error);
      
      // 根据不同错误类型提供具体的错误信息
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          message.error('复制失败：浏览器不允许访问剪贴板，请检查权限设置');
        } else if (error.name === 'NotSupportedError') {
          message.error('复制失败：当前浏览器不支持剪贴板功能');
        } else {
          message.error(`复制失败：${error.message}`);
        }
      } else {
        message.error('复制失败：未知错误，请重试');
      }
      return false;
    }
  };

  const downloadCanvas = () => {
    if (!canvas) {
      message.error('画布未就绪，无法下载');
      return false;
    }
    
    // 显示加载提示
    const hide = message.loading('正在生成下载文件...', 0);
    
    try {
      // 将画布转换为 base64 图片数据
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      // 生成文件名：canvas-年月日-时分秒.png
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[:-]/g, '')
        .replace(/\..+/, '')
        .replace('T', '-');
      const filename = `图图插件-${timestamp}.png`;
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      hide();
      message.success(`图片已保存为 ${filename}`);
      return true;
    } catch (error) {
      hide();
      console.error('下载失败:', error);
      
      if (error instanceof Error) {
        message.error(`下载失败：${error.message}`);
      } else {
        message.error('下载失败：无法生成图片文件，请重试');
      }
      return false;
    }
  };

  return {
    copyCanvas,
    downloadCanvas,
  };
}; 