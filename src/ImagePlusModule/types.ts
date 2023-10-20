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

type SharedImagePlusOptions = {
  minWidth: number;
  maxWidth: number;

  /**
   * image
   */
  imageBorderRadius: number;

  /**
   * focus
   */
  focusBorderWidth: number;
  focusBorderColor: string;

  /**
   * preset
   */
  presetColor: string;
  presetBackground: string;
  presetDisabledColor: string;
  presetDisabledBackground: string;
  presetFocusColor: string;
  presetFocusBackground: string;
  presetHeight: number;
  presetBorderRadius: number;
  presetBorderColor: string;
  presetBorderWidth: number;
  presetFontFamily: string;
  presetFontSize: number;
  presetOffset: number;

  /**
   * label
   */
  labelColor: string;
  labelBackground: string;
  labelHeight: number;
  labelBorderRadius: number;
  labelBorderColor: string;
  labelBorderWidth: number;
  labelFontFamily: string;
  labelFontSize: number;
  labelOffset: number;

  /**
   * handle
   */
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
};

export type ImagePlusOptions = Partial<NormalizedImagePlusOptions> & {
  resizePresets?: ResizePresetInput[];
};

export type NormalizedImagePlusOptions = SharedImagePlusOptions & {
  resizePresets: ResizePreset[];
};
