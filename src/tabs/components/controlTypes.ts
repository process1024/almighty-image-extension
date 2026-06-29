import type { ReactNode } from 'react';

import type { fabric } from 'fabric';

export type ControlValue = string | number;
export type ControlPatch<T extends object> = Partial<T>;
export type ControlUpdater<T extends object> = (props: ControlPatch<T>) => void;

export interface StrokeOptions {
  stroke: string;
  strokeWidth: number;
}

export interface ShapeOptions extends StrokeOptions {
  fill: string;
}

export interface BrushOptions {
  color: string;
  width: number;
}

export interface TextOptions {
  fontSize: number;
  fill: string;
  fontFamily: string;
  textAlign: string;
}

export type EditableFabricObject = fabric.Object & {
  fontFamily?: string;
  fontSize?: number;
  textAlign?: string;
};

export interface ToolButtonProps {
  icon: ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  tooltip?: string;
}
