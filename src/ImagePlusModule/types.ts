export type Size = { width: number; height: number };
export type Bound = { width?: number; height?: number } | null | undefined;

export type ResizePreset =
  | {
      type: "width";
      label: string;
      width: number;
    }
  | {
      type: "ratio";
      label: string;
      ratio: number;
    };

export type ResizePresetInput = number | string | ResizePreset;

export type ImagePlusOptions = {
  minWidth: number;
  maxWidth: number;
  focusBorderWidth: number;
  focusBorderColor: string;
  imageBorderRadius: number;
  labelColor: string;
  labelBackground: string;
  labelHeight: number;
  labelBorderRadius: number;
  labelBorderColor: string;
  labelBorderWidth: number;
  // labelFont: string;
  labelFontFamily: string;
  labelFontSize: number;
  labelOffset: number;

  handleColor: string;
  smallHandleThreshold: { width: number; height: number };
  bigHandleRadius: number;
  bigHandleWidth: number;
  bigHandleHeight: number;
  smallHandleOffset: number;
  smallHandleRadius: number;
  smallHandleWidth: number;
  smallHandleHeight: number;
  smallHandleColor: string;

  resizePresets: ResizePreset[];
};
