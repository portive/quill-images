import { render } from "preact";
import { useState } from "preact/hooks";
import Quill from "quill";
import { ResizeLabel } from "./ResizeLabel";
import { resizeInWidth } from "@portive/client";

export function ResizeOverlay({
  image,
  quill,
}: {
  image: HTMLImageElement;
  quill: Quill;
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState({
    width: image.width,
    height: image.height,
  });

  const onMouseDown = (e: MouseEvent) => {
    setIsResizing(true);
    const imagePlus = quill.getModule("imagePlus");

    console.log("onMouseDOwn");
    // e.stopPropagation();
    // e.preventDefault();
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

    const originalCursor = document.body.style.cursor;

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
      image.setAttribute("width", `${width}`);
      const computedWidth = window
        .getComputedStyle(image)
        .getPropertyValue("width");
      const computedHeight = window
        .getComputedStyle(image)
        .getPropertyValue("height");
      setCurrentSize({
        width: parseInt(computedWidth, 10),
        height: parseInt(computedHeight, 10),
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = originalCursor;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    /**
     * While dragging, we want the cursor to be `ew-resize` (left-right arrow)
     * even if the cursor happens to not be exactly on the handle at the moment
     * due to a delay in the cursor moving to a location and the image resizing
     * to it.
     *
     * Also, image has max width/height and the cursor can fall outside of it.
     */

    console.log("setting cursor");
    document.body.style.cursor = "ew-resize";
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
