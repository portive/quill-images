import { ImagePlusOptions } from "./types";

type HandleDirection = "left" | "right" | "both" | "neither";

function getHandleDirection(
  size: { width: number; height: number },
  minWidth: number,
  maxWidth: number
): HandleDirection {
  if (size.width === maxWidth && size.width === minWidth) {
    return "neither";
  } else if (size.width === maxWidth) {
    return "left";
  } else if (size.width === minWidth) {
    return "right";
  } else {
    return "both";
  }
}

function getHandleStyleFromDirection(
  dir: HandleDirection,
  options: ImagePlusOptions
) {
  switch (dir) {
    case "both":
      return {
        right: -(options.bigHandleWidth + options.focusBorderWidth) / 2,
        borderRadius: options.bigHandleRadius,
        cursor: "ew-resize",
      };
    case "left":
      return {
        right: 0,
        borderTopLeftRadius: options.bigHandleRadius,
        borderBottomLeftRadius: options.bigHandleRadius,
        cursor: "w-resize",
      };
    case "right":
      return {
        right: -options.bigHandleWidth,
        borderTopRightRadius: options.bigHandleRadius,
        borderBottomRightRadius: options.bigHandleRadius,
        cursor: "e-resize",
      };
  }
}

export function ResizeHandle({
  onMouseDown,
  options,
  size,
  minWidth,
  maxWidth,
}: {
  onMouseDown: (e: MouseEvent) => void;
  options: ImagePlusOptions;
  size: { width: number; height: number };
  minWidth: number;
  maxWidth: number;
}) {
  const dir = getHandleDirection(size, minWidth, maxWidth);
  const style = getHandleStyleFromDirection(dir, options);
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        marginTop: -options.bigHandleHeight / 2,
        width: options.bigHandleWidth,
        height: options.bigHandleHeight,
        backgroundColor: options.handleColor,
        zIndex: 100,
        userSelect: "none",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
        transition: "all 250ms",
        ...style,
      }}
      onMouseDown={onMouseDown}
    ></div>
  );
}
