import Quill from "quill";
import "./ImagePlusBlot";
import { addResizeHandlers } from "./addResizeHandlers";

export type ImagePlusOptions = {
  maxWidth?: number;
};

export class ImagePlusModule {
  quill: Quill;
  options: ImagePlusOptions;

  constructor(quill: Quill, options: ImagePlusOptions) {
    this.quill = quill;
    this.options = options;

    addResizeHandlers(quill);

    // Listen for 'editor-change' events to handle image rendering
    quill.on("editor-change", this.handleEditorChange.bind(this));
  }

  handleEditorChange(eventName: any) {
    /**
     * NOTE: This needs to be here and not in `.on('text-change')` because
     * it doesn't fire on initial load in that event handler but it does in
     * `editor-change`
     */
    if (eventName === "text-change") {
      this.placeImagesInDivs();
    }
  }

  placeImagesInDivs() {
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
