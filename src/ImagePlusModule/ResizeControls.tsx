// import { render } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import Quill from "quill";
import { ResizeLabel } from "./ResizeLabel";
// import { resizeInWidth } from "@portive/client";
import { getImagePlusOptions } from ".";
// import { ImagePlusModule } from "./ImagePlusModule";
import { generateSrcSet, getSizeFromUrl } from "./utils";
import { ResizeHandle } from "./ResizeHandle";
import { ResizePresets } from "./ResizePresets";
import { Size } from "./types";
import { useStateRef } from "./hooks";

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

  /**
   * Load the original size of the image to help us with resizing.
   */
  // const originalSizeRef = useRef<Size | null>(null);
  const [originalSize, setOriginalSize, originalSizeRef] =
    useStateRef<Size | null>(null);

  useEffect(() => {
    (async () => {
      const nextOriginalSize = await getSizeFromUrl(image.src);
      setOriginalSize(nextOriginalSize);
    })();
  }, [image.src]);

  const handleType =
    currentSize.width <= options.smallHandleThreshold.width ||
    currentSize.height <= options.smallHandleThreshold.height
      ? "small"
      : "big";

  const setSize = useCallback(
    (size: Size) => {
      image.setAttribute("width", `${size.width}`);
      image.setAttribute("height", `${size.height}`);
      setCurrentSize(size);
    },
    [image]
  );

  const setSizeFinal = useCallback(
    (size: Size) => {
      setSize(size);
      const src = image.getAttribute("src");
      if (src) {
        const srcset = generateSrcSet({
          url: src,
          size,
        });
        image.setAttribute("srcset", srcset);
      }
    },
    [image]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = image.width;

      const setSizeFromMouseEvent = (e: MouseEvent) => {
        // const originalSize = originalSizeRef.current;
        if (!originalSizeRef.current) return null;
        const aspect =
          originalSizeRef.current.width / originalSizeRef.current.height;
        const deltaX = e.clientX - startX;

        const targetWidth = startWidth + deltaX;
        let width = originalSizeRef.current
          ? Math.min(
              originalSizeRef.current.width,
              Math.max(targetWidth, options.minWidth)
            )
          : targetWidth;
        /**
         * We want to round because we don't want `height` to trigger changes
         * without the `width` changing because of decimal pointes. We want to
         * round early here.
         */
        width = Math.round(Math.min(width, options.maxWidth));
        const height = Math.round(width / aspect);
        const nextSize = { width, height };
        setSize(nextSize);
        return nextSize;
      };

      const onMouseMove = (e: MouseEvent) => {
        setSizeFromMouseEvent(e);
      };

      const onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        const nextSize = setSizeFromMouseEvent(e);
        if (nextSize == null) return;
        setSizeFinal(nextSize);
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
    },
    [image]
  );

  return (
    /**
     * contenteditable=false to prevent typing in the overlay/handle
     */
    <div class="ql-image-resize-controls" contentEditable={false}>
      <ResizeHandle
        onMouseDown={onMouseDown}
        options={options}
        size={currentSize}
        handleType={handleType}
        minWidth={minWidth}
        maxWidth={maxWidth}
      />
      {!isResizing ? (
        <ResizePresets
          options={options}
          originalSize={originalSize}
          setSizeFinal={setSizeFinal}
        />
      ) : null}
      <ResizeLabel size={currentSize} options={options} />
    </div>
  );
}
