export function downloadBase64Image(base64String, fileName) {
  // 创建一个隐藏的<a>元素
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);

  // 将base64字符串转换为Blob URL
  const blob = base64ToBlob(base64String);
  const url = window.URL.createObjectURL(blob);

  // 设置下载链接的属性和点击事件
  link.href = url;
  link.download = fileName;
  link.click();

  // 清理
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

export function base64ToBlob(base64String) {
  // 移除base64字符串的前缀（如果有）
  const base64 = base64String.split(',')[1];
  const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeString });
}
