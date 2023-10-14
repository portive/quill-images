/**
 * The resize label that shows the width/height of the image
 */
export function ResizeLabel({
  size,
}: {
  size: { width: number; height: number };
}) {
  const isBelow = size.width < 100 || size.height < 100;
  const bottom = isBelow ? -24 : 4;
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 4,
        font: "10px/20px sans-serif",
        color: "white",
        background: "#404040",
        minWidth: 50,
        padding: "0 7px",
        borderRadius: 3,
        textAlign: "center",
        boxShadow: "0px 0px 2px 1px rgba(255, 255, 255, 0.5)",
        zIndex: 100,
        transition: "bottom 250ms",
      }}
    >
      {size.width} &times; {size.height}
    </div>
  );
}
