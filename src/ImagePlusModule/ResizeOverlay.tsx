import { render } from "preact";
import { useState } from "preact/hooks";
import Quill from "quill";
import { ResizeLabel } from "./ResizeLabel";

export function ResizeOverlay({
  image,
  quill,
}: {
  image: HTMLImageElement;
  quill: Quill;
}) {
  const [currentSize, setCurrentSize] = useState({
    width: image.width,
    height: image.height,
  });

  const onMouseDown = (e: MouseEvent) => {
    const imagePlus = quill.getModule("imagePlus");

    console.log("onMouseDOwn");
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;

    const startWidth = image.width;

    let maxWidth: number | null = null;
    let maxHeight: number | null = null;

    const unsizedImage = new Image();
    unsizedImage.onload = () => {
      maxWidth = unsizedImage.width;
      maxHeight = unsizedImage.height;
    };
    unsizedImage.src = image.src;

    const onMouseMove = (e: MouseEvent) => {
      /**
       * Prevent default behavior to prevent selecting text while resizing
       * image.
       */
      e.stopPropagation();
      e.preventDefault();
      const deltaX = e.clientX - startX;

      const targetWidth = startWidth + deltaX;
      const MIN_WIDTH = 50;
      let width = maxWidth
        ? Math.min(maxWidth, Math.max(targetWidth, MIN_WIDTH))
        : targetWidth;
      console.log({ image, width });
      image.setAttribute("width", `${width}`);
      const computedWidth = window
        .getComputedStyle(image)
        .getPropertyValue("width");
      const computedHeight = window
        .getComputedStyle(image)
        .getPropertyValue("height");

      console.log({ computedWidth, computedHeight });
    };

    const onMouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    /**
     * contenteditable=false to prevent typing in the overlay/handle
     */
    <div class="ql-image-resize-overlay" contentEditable={false}>
      <div class="ql-image-resize-handle" onMouseDown={onMouseDown}></div>
      <ResizeLabel size={currentSize} />
    </div>
  );
}
