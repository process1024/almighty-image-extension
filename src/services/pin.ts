export function getImgElTitle(el: HTMLElement) {
  const selectedText = (
    `${window.getSelection ? window.getSelection() : document.getSelection()}`
  ).replace(/(^\s+|\s+$)/g, '');
  return selectedText || el.getAttribute('huaban-alt') || el.alt || document.title;
}
