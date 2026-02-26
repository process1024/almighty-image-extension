export type Preference = {
  pinButton: {
    type: 'primary' | 'shallow' | 'disable';
    position: 'leftTop' | 'rightTop';
    mode: 'hover' | 'alt';
  };
  /**
   * pinEnable：全局启用下是否启用或禁用
   * pinDisable：全局禁用下是否启用或禁用
   * dragEnable：全局启用下是否启用或禁用
   * dragDisable： 全局禁用下是否启用或禁用
   */
  siteSetting: Record<
    string,
    {
      pinEnable: boolean;
      pinDisable: boolean;
      dragEnable: boolean;
      dragDisable: boolean;
    }
  >;
  drag: {
    mode: 'direction' | 'bottom' | 'disable';
  };
  shortcut: {
    batchPin: string;
    captureSelect: string;
    captureCurrent: string;
    captureFull: string;
  };
};
