import { useCallback } from "preact/hooks";
import { ImagePlusOptions, ResizePreset, Size } from "./types";
import { resizeIn } from "./utils";

/**
 * Returns the width of the image after resizing with the preset.
 *
 * Returns `null` if the image is not resizable with the preset.
 */
function getResizeWidth(
  originalSize: Size | null,
  maxWidth: number,
  preset: ResizePreset
) {
  if (originalSize == null) return null;
  const targetWidth =
    preset.type === "width"
      ? preset.width
      : preset.ratio === 1
      ? maxWidth
      : originalSize.width * preset.ratio;

  if (targetWidth > originalSize.width || targetWidth > maxWidth) return null;
  return Math.round(targetWidth);
}

export function ResizePresetDiv({
  originalSize,
  setSizeFinal,
  options,
  preset,
}: {
  originalSize: Size | null;
  setSizeFinal: (size: Size) => void;
  options: ImagePlusOptions;
  preset: ResizePreset;
}) {
  const resizeWidth = getResizeWidth(originalSize, options.maxWidth, preset);

  const onClick = useCallback(() => {
    if (originalSize == null) return;
    const nextSize =
      preset.type === "width"
        ? resizeIn(originalSize, { width: preset.width })
        : resizeIn(originalSize, {
            width: originalSize.width * preset.ratio,
          });
    setSizeFinal(nextSize);
  }, [originalSize, resizeWidth, setSizeFinal, options, preset]);

  const style =
    resizeWidth == null
      ? {
          color: options.presetDisabledColor,
          background: options.presetDisabledBackground,
          cursor: "no-drop",
        }
      : {};

  /**
   * TODO: This part needs to be done. Call setSizeFinal with the new size.
   */
  return (
    <div
      onClick={onClick}
      style={{
        userSelect: "none",
        padding: `0 4px`,
        cursor: "pointer",
        ...style,
      }}
    >
      {preset.label}
    </div>
  );
}
