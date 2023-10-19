import { ImagePlusOptions, Size } from "./types";
import { ResizePresetDiv } from "./ResizePresetDiv";

export function ResizePresets({
  originalSize,
  setSizeFinal,
  options,
}: {
  originalSize: Size | null;
  setSizeFinal: (size: Size) => void;
  options: ImagePlusOptions;
}) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: -(
          options.presetHeight +
          options.presetOffset +
          options.focusBorderWidth
        ),
        fontFamily: options.presetFontFamily,
        fontSize: options.presetFontSize,
        lineHeight: `${options.presetHeight}px`,
        color: options.presetColor,
        background: options.presetBackground,
        padding: "0 7px",
        borderRadius: options.presetBorderRadius,
        textAlign: "center",
        boxShadow: `0px 0px 0px ${options.presetBorderWidth}px ${options.presetBorderColor}`,
        zIndex: 100,
      }}
    >
      {options.resizePresets.map((preset) => (
        <ResizePresetDiv
          originalSize={originalSize}
          setSizeFinal={setSizeFinal}
          preset={preset}
          options={options}
        />
      ))}
    </div>
  );
}
