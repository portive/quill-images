import { ImagePlusOptions } from "./types";

type HandleDirection = "left" | "right" | "both" | "neither";
type HandleType = "big" | "small";

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

function getDirectionStyle(
  handleType: HandleType,
  dir: HandleDirection,
  options: ImagePlusOptions
) {
  const radius =
    handleType === "big" ? options.bigHandleRadius : options.smallHandleRadius;
  switch (dir) {
    case "both":
      return {
        right: -(options.bigHandleWidth + options.focusBorderWidth) / 2,
        borderRadius: radius,
        cursor: "ew-resize",
      };
    case "left":
      return {
        right: 0,
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
        cursor: "w-resize",
      };
    case "right":
      return {
        right: -options.bigHandleWidth,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        cursor: "e-resize",
      };
  }
}

function getPositionStyle(
  handleType: HandleType,
  dir: HandleDirection,
  options: ImagePlusOptions
) {
  switch (handleType) {
    case "big":
      switch (dir) {
        case "both":
          return {
            right: -(options.bigHandleWidth + options.focusBorderWidth) / 2,
          };
        case "left":
          return {
            right: 0,
          };
        case "right":
          return {
            right: -options.bigHandleWidth,
          };
      }
      break;
    case "small":
      return {
        right: -(
          options.smallHandleOffset +
          options.focusBorderWidth +
          options.smallHandleWidth
        ),
      };
      break;
  }
}

function getHandleStyleFromType(
  handleType: HandleType,
  options: ImagePlusOptions
) {
  switch (handleType) {
    case "big":
      return {
        marginTop: -options.bigHandleHeight / 2,
        width: options.bigHandleWidth,
        height: options.bigHandleHeight,
      };
    case "small":
      return {
        marginTop: -options.smallHandleHeight / 2,
        width: options.smallHandleWidth,
        height: options.smallHandleHeight,
      };
  }
}

export function ResizeHandle({
  onMouseDown,
  options,
  size,
  handleType,
  minWidth,
  maxWidth,
}: {
  onMouseDown: (e: MouseEvent) => void;
  options: ImagePlusOptions;
  size: { width: number; height: number };
  handleType: HandleType;
  minWidth: number;
  maxWidth: number;
}) {
  const dir = getHandleDirection(size, minWidth, maxWidth);
  const handleTypeStyle = getHandleStyleFromType(handleType, options);
  const dirStyle = getDirectionStyle(handleType, dir, options);
  const positionStyle = getPositionStyle(handleType, dir, options);
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        backgroundColor: options.handleColor,
        zIndex: 100,
        userSelect: "none",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
        transition: "all 250ms",
        ...handleTypeStyle,
        ...dirStyle,
        ...positionStyle,
      }}
      onMouseDown={onMouseDown}
    ></div>
  );
}
