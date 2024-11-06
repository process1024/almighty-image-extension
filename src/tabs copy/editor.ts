import {fabric} from 'fabric';

console.log(fabric);

class Editor  {
  private canvas: fabric.Canvas | null = null;

  init(canvas: fabric.Canvas) {
    console.log('' + canvas);
    console.log(this);
    this.canvas = canvas;
  }

  get fabricCanvas() {
    return this.canvas;
  }

  destory() {
    console.log('destory')
    this.canvas = null;
  }
}

export default Editor;
