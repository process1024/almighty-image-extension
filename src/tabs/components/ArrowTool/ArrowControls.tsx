import { StyledControls } from '../../styles/toolControls';
import type {
  ControlUpdater,
  EditableFabricObject,
  StrokeOptions,
} from '../controlTypes';

interface ArrowControlsProps {
  defaultArrowOptions: StrokeOptions;
  selectedObject: EditableFabricObject | null;
  onUpdateSelected: ControlUpdater<StrokeOptions>;
  onUpdateDefaults: ControlUpdater<StrokeOptions>;
}

export const ArrowControls = ({
  defaultArrowOptions,
  selectedObject,
  onUpdateSelected,
  onUpdateDefaults,
}: ArrowControlsProps) => {
  const handleChange = <K extends keyof StrokeOptions>(property: K, value: StrokeOptions[K]) => {
    if (selectedObject) {
      onUpdateSelected({ [property]: value });
    } else {
      onUpdateDefaults({ [property]: value });
    }
  };

  const options: StrokeOptions = selectedObject
    ? {
      stroke: typeof selectedObject.stroke === 'string' ? selectedObject.stroke : '#000000',
      strokeWidth: selectedObject.strokeWidth ?? defaultArrowOptions.strokeWidth,
    }
    : defaultArrowOptions;

  return (
    <StyledControls>
      <div>
        <div>颜色：</div>
        <input
          type="color"
          value={options.stroke}
          onChange={(e) => handleChange('stroke', e.target.value)}
        />
      </div>
      <div>
        <div>线宽：</div>
        <input
          type="number"
          min="1"
          max="100" // 扩大最大线宽范围
          step="0.5" // 允许小数输入
          value={options.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', parseFloat(e.target.value))}
        />
      </div>
    </StyledControls>
  );
};
