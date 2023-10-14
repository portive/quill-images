import Quill from "quill";

const Embed = Quill.import("blots/block/embed");

export class ImagePlusBlot extends Embed {
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

Quill.register("blots/customImage", ImagePlusBlot);
