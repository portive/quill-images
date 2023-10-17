import { ImagePlusOptions } from "./types";

/**
 * The resize label that shows the width/height of the image
 */
export function ResizeLabel({
  size,
  options,
}: {
  size: { width: number; height: number };
  options: ImagePlusOptions;
}) {
  const isBelow = size.width < 100 || size.height < 100;
  const bottom = isBelow
    ? -(options.labelOffset + options.focusBorderWidth + options.labelHeight)
    : options.labelOffset;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: options.labelOffset,
        font: options.labelFont,
        color: options.labelColor,
        background: options.labelBackground,
        minWidth: 50,
        padding: "0 7px",
        borderRadius: options.labelBorderRadius,
        textAlign: "center",
        boxShadow: `0px 0px 0px ${options.labelBorderWidth}px ${options.labelBorderColor}`,
        zIndex: 100,
        transition: "bottom 250ms",
      }}
    >
      {size.width} &times; {size.height}
    </div>
  );
}
