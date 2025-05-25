export const MosaicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* 马赛克效果由多个小方块组成 */}
    <rect x="3" y="3" width="4" height="4" fill="currentColor" />
    <rect x="9" y="3" width="4" height="4" fill="currentColor" opacity="0.7" />
    <rect x="15" y="3" width="4" height="4" fill="currentColor" opacity="0.5" />
    <rect x="3" y="9" width="4" height="4" fill="currentColor" opacity="0.7" />
    <rect x="9" y="9" width="4" height="4" fill="currentColor" opacity="0.5" />
    <rect x="15" y="9" width="4" height="4" fill="currentColor" opacity="0.3" />
    <rect x="3" y="15" width="4" height="4" fill="currentColor" opacity="0.5" />
    <rect x="9" y="15" width="4" height="4" fill="currentColor" opacity="0.3" />
    <rect x="15" y="15" width="4" height="4" fill="currentColor" opacity="0.2" />
  </svg>
);