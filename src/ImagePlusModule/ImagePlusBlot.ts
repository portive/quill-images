import Quill from "quill";
import { initImagePlusSpan } from "./initImagePlusSpan";

const Embed = Quill.import("blots/block/embed");

export class ImagePlusBlot extends Embed {
  static blotName = "customImage";
  static tagName = "SPAN";
  static className = "ql-image";
  static create(value: any) {
    const node = super.create(value) as HTMLSpanElement;
    initImagePlusSpan(node);
    const image = document.createElement("img");
    image.setAttribute("src", value);
    node.appendChild(image);
    return node;
  }

  // domNode!: HTMLSpanElement;

  getImage(): HTMLImageElement {
    return ImagePlusBlot.getImage(this.domNode);
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
    throw new Error(`Could not find image in embed`);
  }

  /**
   * Returns the `src` as the main value for the image.
   */
  static value(node: HTMLSpanElement) {
    const img = this.getImage(node);
    return img.getAttribute("src");
  }

  static format(name: string, value: any) {
    //   // this.domNode;
    //   console.log("domNode", this.domNode);
    console.log("format");
    console.log({ name, value });
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
