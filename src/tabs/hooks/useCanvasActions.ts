import { fabric } from 'fabric';

export const useCanvasActions = (canvas: fabric.Canvas | null) => {
  const copyCanvas = async () => {
    if (!canvas) return;
    
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
      
      return true;
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    
    try {
      // 将画布转换为 base64 图片数据
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `canvas-${new Date().getTime()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('下载失败:', error);
      return false;
    }
  };

  return {
    copyCanvas,
    downloadCanvas,
  };
}; 