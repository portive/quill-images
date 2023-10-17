export function ProgressBar({
  // upload,
  className,
  // style,
  sentBytes,
  totalBytes,
  width,
  height = 16,
}: {
  className?: string;
  // style?: JSX.CSSProperties;
  sentBytes: number;
  totalBytes: number;
  width: number;
  height?: number;
}) {
  /**
   * This formula looks a little funny because we want the `0` value of the
   * progress bar to have a width that is still the height of the progress bar.
   *
   * This is for a few reasons:
   *
   * 1. We want the zero point to start with the progress bar being a circle
   * 2. If we want rounded edges, if the width is shorter than the height,
   *    we get an oval instead of a circle
   * 3. The halfway point looks visually wrong because of the circle progress
   *    bar when it is technically at the halfway point.
   */
  const progressWidth = (sentBytes / totalBytes) * (width - height) + height;
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: "50%",
        marginTop: -height / 2,
        left: "50%",
        marginLeft: -width / 2,
        width,
        height,
        background: "white",
        borderRadius: height / 2,
        overflow: "hidden",
        boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: progressWidth,
          transition: "width 0.1s",
          height: "100%",
        }}
      ></div>
    </div>
  );
}
