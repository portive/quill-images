import { render } from "preact";
import Quill from "quill";
import { ResizeControls } from "./ResizeControls";
import { getImagePlusOptions } from ".";
import { setStyles } from "./utils";

/**
 * The
 */
export function addImageHandlers(quill: Quill) {
  /**
   * When you click anywhere in the editor, we check if the clicked element is
   * an <img> element. If it is, we add the `ql-image-selected` class to the
   * parent element and render the resize overlay.
   *
   * We use Preact to do this because it simplifies the logic and only adds
   * a few kb to the bundle.
   */
  quill.root.addEventListener("click", (e: MouseEvent) => {
    const options = getImagePlusOptions(quill);
    const clickedElement = e.target as HTMLElement;

    // Check if the clicked element is an <img> element
    if (clickedElement.tagName.toLowerCase() !== "img") return;

    e.preventDefault();
    e.stopPropagation();

    const imageElement = clickedElement as HTMLImageElement;

    const parentElement = imageElement.parentElement;

    if (!parentElement) return;

    // parentElement.classList.add("ql-image-selected");

    imageElement.setAttribute("draggable", "false");
    const resetStyles = setStyles(parentElement, {
      boxShadow: options.imageFocusBoxShadow,
    });

    render(<ResizeControls image={imageElement} quill={quill} />, parentElement);

    const deselectImage = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.parentElement === parentElement) return;

      resetStyles();
      // parentElement.classList.remove("ql-image-selected");
      render(null, parentElement);
      imageElement.setAttribute("draggable", "true");
      document.removeEventListener("click", deselectImage);
      document.removeEventListener("dragstart", deselectImage);
    };

    document.addEventListener("click", deselectImage);
    document.addEventListener("dragstart", deselectImage);
  });
}
