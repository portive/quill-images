import Quill from "quill";
import { registerImagePlus, ImagePlusOptions } from "./ImagePlusModule";

registerImagePlus();

const imagePlusOptions: ImagePlusOptions = {
  maxWidth: 480,
  labelBorderRadius: 0,
  imageBorderRadius: 8,
};

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    imagePlus: imagePlusOptions,
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
    ],
  },
});

quill.on("text-change", () => {
  const contents = quill.getContents();
  (document.getElementById("value") as HTMLTextAreaElement).value =
    JSON.stringify(contents, null, 2);
});
