import Quill from "quill";
import "./ImagePlusBlot";
import { ImagePlusModule } from "./ImagePlusModule";
import "./ImagePlusModule";
export { registerImagePlus } from "./registerImagePlus";

export function getImagePlusOptions(quill: Quill) {
  const imagePlus = quill.getModule("imagePlus") as ImagePlusModule;
  return imagePlus.options;
}

export * from "./types";
