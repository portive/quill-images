import { NormalizedImagePlusOptions, Size } from "./types";
import { ResizePresetDiv } from "./ResizePresetDiv";
import { RefObject, createPortal } from "preact/compat";

function getDisplayStyle(
  resizeControlsRef: RefObject<HTMLDivElement>,
  options: NormalizedImagePlusOptions
) {
  const resizeControls = resizeControlsRef.current;
  if (!resizeControls) return { display: "none" };

  const imageContainer = resizeControls.closest(".ql-image");

  if (!imageContainer) return { display: "none" };

  return {
    left: imageContainer.getBoundingClientRect().left,
    top:
      imageContainer.getBoundingClientRect().top -
      options.presetHeight -
      options.presetOffset -
      options.focusBorderWidth,
  };
}

export function ResizePresets({
  originalSize,
  setSizeFinal,
  resizeControlsRef,
  options,
}: {
  originalSize: Size | null;
  setSizeFinal: (size: Size) => void;
  resizeControlsRef: RefObject<HTMLDivElement>;
  options: NormalizedImagePlusOptions;
}) {
  const displayStyle = getDisplayStyle(resizeControlsRef, options);

  return createPortal(
    <div
      style={{
        display: "flex",
        position: "absolute",
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
        ...displayStyle,
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
    </div>,
    document.body
  );
}
