import Quill from "quill";
import { insertImage } from "./ImagePlusModule/uploadImage";
import "./ImagePlusModule";
import { ImagePlusOptions } from "./ImagePlusModule/types";

const imagePlusOptions: Partial<ImagePlusOptions> = {
  maxWidth: 480,
  labelBorderRadius: 0,
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

quill.getModule("toolbar").addHandler("image", () => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    insertImage(quill, file);
  };
});

quill.on("text-change", () => {
  const contents = quill.getContents();
  (document.getElementById("value") as HTMLTextAreaElement).value =
    JSON.stringify(contents, null, 2);
});
