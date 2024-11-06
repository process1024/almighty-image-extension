import Editor from './editor';
import { fabric } from 'fabric';

export function createEditor(canvasElement) {
  const editor = new Editor();
  const canvas = new fabric.Canvas(canvasElement);
  console.log(canvas);
  editor.init(canvas);

  return {
    editor,
    cleanUp: () => editor.destory(),
  };
}

// export const EditorContext = createContext('null');
