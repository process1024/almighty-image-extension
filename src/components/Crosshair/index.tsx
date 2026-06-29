import './index.less';

interface CrosshairProps {
  x: number;
  y: number;
}

export default function Crosshair({ x, y }: CrosshairProps) {
  return (
    <>
      <div className="crosshair-vertical" style={{ top: `${y}px` }}></div>
      <div className="crosshair-horizon" style={{ left: `${x}px` }}></div>
    </>
  );
}
