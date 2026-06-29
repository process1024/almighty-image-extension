export function getImgElTitle(el: HTMLElement | HTMLImageElement) {
  const selectedText = (
    `${window.getSelection ? window.getSelection() : document.getSelection()}`
  ).replace(/(^\s+|\s+$)/g, '');
  const alt = el instanceof HTMLImageElement ? el.alt : '';

  return selectedText || el.getAttribute('huaban-alt') || alt || document.title;
}
