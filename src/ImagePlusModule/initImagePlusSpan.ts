export function initImagePlusSpan(span: HTMLSpanElement) {
  if (span.className !== "ql-image")
    throw new Error("Invalid span. Expected class .ql-image");
  span.style.position = "relative";
  span.style.display = "inline-block";
  span.style.userSelect = "none";
}
