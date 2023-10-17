import { render } from "preact";
import { useState } from "preact/hooks";
import Quill from "quill";
import { ResizeLabel } from "./ResizeLabel";
import { resizeInWidth } from "@portive/client";
import { getImagePlusOptions } from ".";
import { ImagePlusModule } from "./ImagePlusModule";
import { generateSrcSet } from "./utils";
import { ResizeHandle } from "./ResizeHandle";

export function ResizeControls({
  image,
  quill,
}: {
  image: HTMLImageElement;
  quill: Quill;
}) {
  const options = getImagePlusOptions(quill);

  const [isResizing, setIsResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState({
    width: image.width,
    height: image.height,
  });
  const [maxWidth, setMaxWidth] = useState(options.maxWidth);
  const [minWidth, setMinWidth] = useState(options.minWidth);

  const onMouseDown = (e: MouseEvent) => {
    setIsResizing(true);

    const options = getImagePlusOptions(quill);

    const startX = e.clientX;

    const startWidth = image.width;

    let originalSize: { width: number; height: number } | null = null;

    const unsizedImage = new Image();
    unsizedImage.onload = () => {
      originalSize = {
        width: unsizedImage.width,
        height: unsizedImage.height,
      };
      setMaxWidth(Math.min(maxWidth, originalSize.width));
    };
    unsizedImage.src = image.src;

    const originalCursor = document.body.style.cursor;

    const setSizeFromMouseEvent = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;

      const targetWidth = startWidth + deltaX;
      let width = originalSize
        ? Math.min(originalSize.width, Math.max(targetWidth, options.minWidth))
        : targetWidth;
      /**
       * We want to round because we don't want `height` to trigger changes
       * without the `width` changing because of decimal pointes. We want to
       * round early here.
       */
      width = Math.round(Math.min(width, options.maxWidth));
      image.setAttribute("width", `${width}`);
      const computedWidth = window
        .getComputedStyle(image)
        .getPropertyValue("width");
      const computedHeight = window
        .getComputedStyle(image)
        .getPropertyValue("height");
      const nextSize = {
        width: parseInt(computedWidth, 10),
        height: parseInt(computedHeight, 10),
      };
      setCurrentSize(nextSize);
      return nextSize;
    };

    const onMouseMove = (e: MouseEvent) => {
      /**
       * Prevent default behavior to prevent selecting text while resizing
       * image.
       */
      e.stopPropagation();
      e.preventDefault();
      setSizeFromMouseEvent(e);
    };

    const onMouseUp = (e: MouseEvent) => {
      setIsResizing(false);
      const nextSize = setSizeFromMouseEvent(e);
      const src = image.getAttribute("src");
      if (src) {
        const srcset = generateSrcSet({
          url: src,
          size: nextSize,
        });
        image.setAttribute("srcset", srcset);
      }

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

    document.body.style.cursor = "ew-resize";
  };

  return (
    /**
     * contenteditable=false to prevent typing in the overlay/handle
     */
    <div class="ql-image-resize-controls" contentEditable={false}>
      <ResizeHandle
        onMouseDown={onMouseDown}
        options={options}
        size={currentSize}
        minWidth={minWidth}
        maxWidth={maxWidth}
      />
      <ResizeLabel size={currentSize} options={options} />
    </div>
  );
}
