import { render } from "preact";
import Quill from "quill";
import { ResizeControls } from "./ResizeControls";
import { getImagePlusOptions } from ".";
import { setStyles } from "./utils";

/**
 * The
 */
export function addImageSelectHandlers(quill: Quill) {
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

    // If the clicked element is not an <img> element then exit
    if (clickedElement.tagName.toLowerCase() !== "img") return;

    const imageElement = clickedElement as HTMLImageElement;

    const parentElement = imageElement.parentElement;

    if (!parentElement) return;

    e.preventDefault();
    e.stopPropagation();

    /**
     * Disable dragging when focused.
     *
     * It might be nice to re-enable this, but beware dragging when the image
     * is selected for the image gets dragged outside of the `span` and then
     * you have an orphaned image.
     *
     * To test this, try dragging the selected image into a new paragraph and
     * make sure everything still works correctly.
     */
    imageElement.setAttribute("draggable", "false");

    parentElement.style.boxShadow = `0 0 0 ${options.focusBorderWidth}px ${options.focusBorderColor}`;
    // const resetBoxShadow = setStyles(parentElement, {
    //   boxShadow: `0 0 0 ${options.focusBorderWidth}px ${options.focusBorderColor}`,
    // });
    // parentElement.style.boxShadow = `0 0 0 ${options.focusBorderWidth}px ${options.focusBorderColor}`;

    render(
      <ResizeControls image={imageElement} quill={quill} />,
      parentElement
    );

    const deselectImage = () => {
      render(null, parentElement);
      parentElement.style.boxShadow = "none";
      imageElement.setAttribute("draggable", "true");
      // document.removeEventListener("click", deselectImage);
      quill.off("selection-change", deselectImage);
    };

    quill.blur();
    quill.on("selection-change", deselectImage);
  });
}
