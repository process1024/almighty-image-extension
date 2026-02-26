import { useState } from 'react';

import './index.less';

// let loadingInstanceNum = 1;

/**
 * 加载状态
 */
export default function Loading({
  size = '1em', // 尺寸
  stroke = '#FF5967', // 线条颜色
  shadow = 'rgba(0,0,0,0.15)', // 底色线条颜色
  strokeWidth = 14, // 线条粗细
  strokeDasharray = '771px 771px', // svg 总长度 771px, 合适的尺寸：771、128
  strokeLinecap = 'square', // square、round
  animationDuration = '1.6s',
}) {
  const [id] = useState(() => {
    return 'hb_petal_loading_id';
  });

  const defaultWidth = 10;
  const viewBox = [
    1 - (strokeWidth - defaultWidth) / 2,
    0 - (strokeWidth - defaultWidth) / 2,
    144 + strokeWidth - defaultWidth,
    143 + strokeWidth - defaultWidth,
  ];

  return (
    <span className="hb-loading" style={{ width: size, height: size }}>
      <svg viewBox={viewBox.join(' ')} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <g id={id} fill="none" fillRule="evenodd">
            <path d="m138.202 6.04-38.053.142c-10.609.704-15.236.704-29.356 7.012-25.534 11.31-37.165 43.13-35.934 58.426 1.23 15.296 1.762 19.878 7.642 30.243 5.879 10.364 20.595 33.162 57.52 34.69 18.145.184 30.86.144 38.144-.12l.774-18.162c1.108-16.41-2.866-30.769-7.743-44.7-11.796-28.034-31.93-48.16-60.403-60.377C49.713 6.298 40.67 4.565 25.84 5.52l-18.254.662V42.06c.473 13.995 3.164 24.755 7.935 33.225 7.472 13.264 16.673 20.334 26.98 26.579 15.502 6.459 20.63 7.37 30.403 7.58 31.14 0 49.979-21.439 58.41-35.871 3.627-10.333 7.625-16.855 6.888-36.589V6.04Z" />
          </g>
        </defs>
        <use xlinkHref={`#${id}`} stroke={shadow} strokeWidth={strokeWidth} />
        <use
          xlinkHref={`#${id}`}
          className="animate"
          style={{ animationDuration }}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={strokeLinecap}
        />
      </svg>
    </span>
  );
}
