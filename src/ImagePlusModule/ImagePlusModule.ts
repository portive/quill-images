import Quill from "quill";
import { addImageSelectHandlers } from "./addImageSelectHandlers";
import { ImagePlusOptions } from "./types";

export class ImagePlusModule {
  quill: Quill;
  options: ImagePlusOptions;

  constructor(quill: Quill, options: Partial<ImagePlusOptions>) {
    this.quill = quill;
    this.options = Object.assign(
      {
        minWidth: 50,
        maxWidth: 480,
        imageBorderRadius: 0,
        focusBorderWidth: 4,
        focusBorderColor: "black",
        labelColor: "white",
        labelBackground: "black",
        labelHeight: 20,
        labelBorderRadius: 3,
        labelBorderColor: "rgba(255, 255, 255, 0.25)",
        labelBorderWidth: 1,
        labelFontFamily: "sans-serif",
        labelFontSize: 10,
        labelOffset: 4,
        handleColor: "black",
        smallHandleThreshold: { width: 100, height: 100 },
        bigHandleRadius: 8,
        bigHandleWidth: 16,
        bigHandleHeight: 48,
        smallHandleRadius: 6,
        smallHandleWidth: 16,
        smallHandleHeight: 24,
        smallHandleColor: "black",
        smallHandleOffset: 1,
        resizePresets: [160, 320, "1/2", "100%"],
        presetColor: "white",
        presetBackground: "black",
        presetOffset: 4,
      },
      options
    );

    addImageSelectHandlers(quill);

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
