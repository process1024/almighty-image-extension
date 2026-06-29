import { useEffect, useState } from 'react';
import { StyledControls } from '../../styles/toolControls';
import type { BrushOptions, ControlUpdater } from '../controlTypes';

interface BrushControlsProps {
  defaultBrushOptions: BrushOptions;
  onUpdateDefaults: ControlUpdater<BrushOptions>;
}

export const BrushControls = ({
  defaultBrushOptions,
  onUpdateDefaults,
}: BrushControlsProps) => {
  const [brushProps, setBrushProps] = useState<BrushOptions>({
    color: '#000000',
    width: 2,
  });

  useEffect(() => {
    setBrushProps(defaultBrushOptions);
  }, [defaultBrushOptions]);

  const handleUpdate = <K extends keyof BrushOptions>(property: K, value: BrushOptions[K]) => {
    const newProps = { [property]: value };
    setBrushProps(prev => ({ ...prev, ...newProps }));
    onUpdateDefaults(newProps);
  };

  return (
    <StyledControls>
      <div>
        <label>画笔颜色：</label>
        <input
          type="color"
          value={brushProps.color}
          onChange={(e) => handleUpdate('color', e.target.value)}
        />
      </div>
      <div>
        <label>画笔粗细：</label>
        <input
          type="number"
          min="1"
          max="50"
          value={brushProps.width}
          onChange={(e) => handleUpdate('width', parseInt(e.target.value))}
        />
      </div>
    </StyledControls>
  );
};
