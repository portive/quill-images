import Quill from "quill";

export type ImageOptions = {
  maxWidth?: number;
};

export class ImageInDivModule {
  quill: Quill;
  options: ImageOptions;

  constructor(quill: Quill, options: ImageOptions) {
    this.quill = quill;
    this.options = options;

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
    const images = this.quill.root.querySelectorAll("img");
    images.forEach((image: HTMLImageElement) => {
      const span = document.createElement("span");
      span.setAttribute("class", "ql-image");
      const cloneImage = image.cloneNode(true) as HTMLImageElement;
      span.appendChild(cloneImage);
      const parentNode = image.parentNode;
      if (
        parentNode &&
        "className" in parentNode &&
        parentNode.className === "ql-image"
      )
        return;
      parentNode?.replaceChild(span, image);
    });
  }
}

const Embed = Quill.import("blots/block/embed");

export class CustomImageBlot extends Embed {
  static blotName = "customImage";
  static tagName = "div";
  static className = "ql-image";
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("width", "480");
    node.setAttribute("height", "320");
    node.setAttribute("src", value.url);
    return node;
  }

  static getImage(node: HTMLDivElement) {
    return node.childNodes[0] as HTMLImageElement;
  }

  static value(node: HTMLDivElement) {
    const img = this.getImage(node);
    return img.getAttribute("src");
  }

  static formats(node: HTMLDivElement) {
    const attrs: {
      width?: string;
      height?: string;
    } = {};
    const img = this.getImage(node as HTMLDivElement);
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");
    if (typeof width == "string") attrs.width = width;
    if (typeof height == "string") attrs.height = height;

    return attrs;
  }
}
