import { Upload } from "../types";

export function ProgressBar({
  upload,
  className,
  style,
  width,
  height = 16,
}: {
  upload: Upload;
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height?: number;
}) {
  if (upload.status !== "uploading") {
    return null;
  }
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
  const progressWidth =
    (upload.sentBytes / upload.totalBytes) * (width - height) + height;
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: "white",
        borderRadius: height / 2,
        boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
        ...style,
      }}
    >
      <div
        style={{
          background: "DodgerBlue",
          width: progressWidth,
          transition: "width 0.1s",
          height,
          borderRadius: height / 2,
        }}
      ></div>
    </div>
  );
}

export function ErrorBar({
  upload,
  className,
  style,
  width,
  height = 16,
}: {
  upload: Upload;
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height?: number;
}) {
  if (upload.status !== "error") {
    return null;
  }
  return (
    <div
      className={className}
      style={{
        width,
        height,
        fontFamily: "sans-serif",
        fontSize: "75%",
        fontWeight: "bold",
        lineHeight: `${height}px`,
        color: "rgba(255, 255, 255, 0.9)",
        background: "FireBrick",
        textAlign: "center",
        textTransform: "uppercase",
        borderRadius: height / 2,
        boxShadow: "0 0 1px 0px rgba(0,0,0,1)",
        ...style,
      }}
    >
      Upload Failed
    </div>
  );
}

export function StatusBar(props: {
  upload: Upload;
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height?: number;
  children?: React.ReactNode;
}) {
  switch (props.upload.status) {
    case "uploading":
      return <ProgressBar {...props} />;
    case "error":
      return <ErrorBar {...props} />;
    case "complete":
      return props.children ? (
        <div
          className={props.className}
          style={{
            width: props.width,
            height: props.height,
            ...props.style,
          }}
        >
          {props.children}
        </div>
      ) : null;
    default:
      throw new Error(`Should be unreachable`);
  }
}
