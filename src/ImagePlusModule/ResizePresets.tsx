import { ImagePlusOptions, ResizePreset } from "./types";

export function ResizePresets({ options }: { options: ImagePlusOptions }) {
  return (
    <div
      style={{
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
        <ResizePresetDiv preset={preset} options={options} />
      ))}
    </div>
  );
}

function ResizePresetDiv({
  options,
  preset,
}: {
  options: ImagePlusOptions;
  preset: ResizePreset;
}) {
  return (
    <div
      style={{
        display: "inline-block",
        userSelect: "none",
        padding: `0 4px`,
        cursor: "pointer",
      }}
    >
      {preset.label}
    </div>
  );
}
