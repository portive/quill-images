import Quill from "quill";
import { insertImage } from "./insertImage";
import "./ImagePlusModule";
import { ImagePlusOptions } from "./ImagePlusModule";
import "./preactTest.tsx";
import { addResizeHandlers } from "./imageResizeOverlay.tsx";

const imageOptions: ImagePlusOptions = {
  maxWidth: 480,
};

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    // imageDrop: true,
    imagePlus: imageOptions,
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
