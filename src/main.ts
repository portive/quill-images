import Quill from "quill";
import { insertImage } from "./insertImage";
import {
  CustomImageBlot,
  ImageInDivModule,
  ImageOptions,
} from "./ImageInDivModule";
import "./preactTest.tsx";
import { addResizeHandlers } from "./imageResizeOverlay.tsx";

Quill.register("modules/imageInDiv", ImageInDivModule);
Quill.register("blots/customImage", CustomImageBlot);

const imageOptions: ImageOptions = {
  maxWidth: 480,
};

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    // imageDrop: true,
    imageInDiv: imageOptions,
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

// quill.root.addEventListener("mousedown", (e: MouseEvent) => {
//   const clickedElement = e.target as HTMLElement;
//   if (clickedElement.tagName.toLowerCase() === "img") {
//     console.log("clickedElement", clickedElement);
//   }
// });

// quill.root.addEventListener("click", (event: MouseEvent) => {
//   const clickedElement = event.target as HTMLElement;

//   // Check if the clicked element is an <img> element
//   if (clickedElement.tagName.toLowerCase() === "img") {
//     // clickedElement.style.outline = "4px solid #06c";
//     // clickedElement.style.boxShadow = "none";
//     // clickedElement.style.userSelect = "none";

//     const imageBlot = Quill.find(clickedElement);

//     // Get the image's container element
//     const imageIndex = quill.getIndex(imageBlot);

//     // // Check if the imageContainer is valid
//     // if (imageIndex) {
//     // Calculate the image's range
//     const imageRange = {
//       index: imageIndex,
//       length: 1, // Assuming the image is a single character
//     };

//     // Set the selection to the image's range
//     quill.setSelection(imageRange);
//     // }
//   }
// });

addResizeHandlers(quill);

// quill.root.addEventListener("mousedown", (e: MouseEvent) => {
//   const clickedElement = e.target as HTMLElement;

//   // Check if the clicked element is an <img> element
//   if (clickedElement.tagName.toLowerCase() !== "img") return;

//   const parentElement = clickedElement.parentElement;
//   console.log("parentElement", parentElement);
// });

// quill.on('selection-change', (range, oldRange, source) => {

// })

quill.on("text-change", () => {
  const contents = quill.getContents();
  (document.getElementById("value") as HTMLTextAreaElement).value =
    JSON.stringify(contents, null, 2);
});
