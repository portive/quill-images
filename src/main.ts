import Quill from "quill";
import { registerImagePlus, ImagePlusOptions } from "./ImagePlusModule";

registerImagePlus();

const AUTH_TOKEN = import.meta.env.VITE_PORTIVE_AUTH_TOKEN;

if (!AUTH_TOKEN) {
  throw new Error(`Expected VITE_PORTIVE_AUTH_TOKEN to be defined`);
}

const imagePlusOptions: ImagePlusOptions = {
  portiveAuthToken: AUTH_TOKEN,
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
