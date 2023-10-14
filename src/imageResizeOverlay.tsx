import { render } from "preact";
import { useState } from "preact/hooks";
import Quill from "quill";
import { ResizeLabel } from "./ResizeLabel";

function ResizeOverlay({
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
    e.stopPropagation();
    e.preventDefault();
    // quill.root.classList.add("ql-disable-selection");
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
      console.log({ targetWidth, maxWidth });
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

export function addResizeHandlers(quill: Quill) {
  quill.root.addEventListener("click", (e: MouseEvent) => {
    const clickedElement = e.target as HTMLElement;

    // Check if the clicked element is an <img> element
    if (clickedElement.tagName.toLowerCase() !== "img") return;

    const imageElement = clickedElement as HTMLImageElement;

    const parentElement = imageElement.parentElement;

    if (!parentElement) return;

    parentElement.classList.add("ql-image-selected");

    render(<ResizeOverlay image={imageElement} quill={quill} />, parentElement);

    const deselectImage = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.parentElement === parentElement) return;

      parentElement.classList.remove("ql-image-selected");
      render(null, parentElement);
      quill.root.removeEventListener("click", deselectImage);
    };

    quill.root.addEventListener("click", deselectImage);
  });
}
