import Quill from "quill";

const Embed = Quill.import("blots/block/embed");

export class ImagePlusBlot extends Embed {
  static blotName = "customImage";
  static tagName = "SPAN";
  static className = "ql-image";
  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("draggable", "true");
    const image = document.createElement("img");
    image.setAttribute("draggable", "false");
    image.setAttribute("src", value);
    node.appendChild(image);
    return node;
  }

  /**
   * Returns the image element inside the span.
   *
   * In our case, the `span` itself is the embed so to get the image from it,
   * we need to grab the child.
   */
  static getImage(node: HTMLSpanElement): HTMLImageElement {
    for (const childNode of node.childNodes) {
      if (childNode.nodeName.toLowerCase() !== "img") continue;
      return childNode as HTMLImageElement;
    }
    console.log(node);
    throw new Error(`Could not find image in embed`);
  }

  /**
   * Returns the `src` as the main value for the image.
   */
  static value(node: HTMLSpanElement) {
    const img = this.getImage(node);
    return img.getAttribute("src");
  }

  /**
   * Returns the attributes of the image for the `formats`
   */
  static formats(node: HTMLSpanElement) {
    const attrs: {
      width?: string;
      height?: string;
    } = {};
    const img = this.getImage(node as HTMLSpanElement);
    const width = img.getAttribute("width");
    const height = img.getAttribute("height");
    if (typeof width == "string") attrs.width = width;
    if (typeof height == "string") attrs.height = height;

    return attrs;
  }
}

Quill.register("blots/customImage", ImagePlusBlot);
