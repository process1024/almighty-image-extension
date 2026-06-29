// import { Checkbox } from "antd";
import React, { useEffect, useState } from 'react';
import { Else, If, Then } from 'react-if';

// import { useEffect, useMemo, useState } from "react";
import type { ImageType } from '../context';

import './index.less';

interface ImageCardProps {
  image: ImageType;
  checked: boolean;
  onChange: (checked: boolean) => void;
  renderWidth?: number;
  onload: (event: Event) => void;
}

export const ImageCard = ({ image, checked, onChange, renderWidth, onload }: ImageCardProps) => {
  const [fetching, setFetching] = useState(false);
  // const actualHeight = useMemo(() => {
  //   console.log(image);
  //   return renderWidth && image.width > renderWidth ? (renderWidth / image.width) * image.height : image.height;
  // }, [renderWidth, image.width, image.height]);
  // const [size, setSize] = useState({
  //   width: 0,
  //   height: 0
  // });

  const renderHeight
    = renderWidth && image.width + 10 >= renderWidth
      ? (renderWidth / image.width) * image.height
      : image.height;

  useEffect(() => {
    // 渲染的图片不是 原图时，获取原图的尺寸大小
    if (image.src !== image.renderSrc && !image.loaded) {
      setFetching(true);
      const img = new Image();
      img.src = image.src;
      img.onload = (e) => {
        const target = e.target as HTMLImageElement;
        const { width, height } = target;
        image.width = width;
        image.height = height;
        image.loaded = true;
        onload(e);
        setFetching(false);
      };
    }
  }, []);
  return (
    <div onClick={() => onChange(!checked)} className="batch-image-card-wrapper">
      <div className={`batch-image-card ${checked ? 'batch-image-card-checked' : ''}`}>
        <img
          className={'batch-image-card__img'}
          height={renderHeight}
          src={image.renderSrc}
          alt={image.alt}
        />
      </div>
      <p className="batch-image-card__text">
        <If condition={fetching}>
          <Then>读取中</Then>
          <Else>
            {image.width} x {image.height}
          </Else>
        </If>
        &nbsp;| {image.fileType}
      </p>
      <div className='check-wrapper'>
        <input type="checkbox" checked={checked} />
      </div>
    </div>
  );
};

export default ImageCard;
