import Quill from "quill";
import { ImagePlusBlot } from "./ImagePlusBlot";
import { ImagePlusModule } from "./ImagePlusModule";

export function registerImagePlus() {
  Quill.register("modules/imagePlus", ImagePlusModule);
  Quill.register("blots/customImage", ImagePlusBlot);
}
