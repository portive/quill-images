import Quill from "quill";
import { addImageHandlers } from "./addImageHandlers";
import { ImagePlusOptions } from "./types";

export class ImagePlusModule {
  quill: Quill;
  options: Required<ImagePlusOptions>;

  constructor(quill: Quill, options: ImagePlusOptions) {
    this.quill = quill;
    this.options = Object.assign(
      {
        maxWidth: 480,
        imageBorderRadius: 0,
        imageFocusBoxShadow: "0 0 0 4px black",
      },
      options
    );

    addImageHandlers(quill);

    this.addEditorTextChangeHandler();
  }

  addEditorTextChangeHandler() {
    /**
     * NOTE: Must be `editor-change` as `text-change` doesn't fire on first load
     */
    this.quill.on(
      "editor-change",
      (eventName: "text-change" | "selection-change") => {
        if (eventName === "text-change") {
          this.onEditorTextChange();
        }
      }
    );
  }

  /**
   * Make sure all `img` elements are wrapped in a `span` with the `ql-image`
   * class.
   */
  onEditorTextChange() {
    const images: NodeListOf<HTMLImageElement> =
      this.quill.root.querySelectorAll(":not(.ql-image) > img");
    images.forEach((image: HTMLImageElement) => {
      const span = document.createElement("span");
      span.setAttribute("class", "ql-image");
      /**
       * If resize isn't working on the image, especially on the first click,
       * this may be the issue.
       *
       * Be careful here. When we clone the image, it's not the original image
       * and if we aren't careful with some of this logic, we end up with a
       * Preact component trying to modify the wrong Image element's width and
       * the resize doesn't work.
       */
      const cloneImage = image.cloneNode(true) as HTMLImageElement;
      span.appendChild(cloneImage);
      const parentNode = image.parentNode;
      parentNode?.replaceChild(span, image);
    });
  }
}

Quill.register("modules/imagePlus", ImagePlusModule);
