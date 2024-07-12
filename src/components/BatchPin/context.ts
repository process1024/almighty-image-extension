import React, { createContext } from "react";

import { globalConfig } from "~services/config";

export interface ImageType {
  alt: string;
  // 原图
  src: string;
  // 渲染的src
  renderSrc: string;
  width: number;
  height: number;
  fileType: string;
}

export const initialState = () => {
  return {
    format: "all",
    /**页面的所有图片 */
    allImg: [] as ImageType[],
    /**筛选后的图片 */
    filterImgs: [] as ImageType[],
    /**已选中的图片 */
    selectedImgs: [] as ImageType[],
    minWidth: globalConfig.batchPin.minWidth,
    minHeight: globalConfig.batchPin.minHeight,
    tags: [],
    boardId: "",
    rangSize: {
      maxWith: globalConfig.batchPin.minWidth,
      maxHeight: globalConfig.batchPin.minHeight,
      minWidth: 1,
      minHeight: 1
    }
  };
};

type TState = ReturnType<typeof initialState>;

export const AppContext = createContext([initialState(), () => {}] as [
  TState,
  React.Dispatch<React.SetStateAction<TState>>
]);
export default AppContext;
