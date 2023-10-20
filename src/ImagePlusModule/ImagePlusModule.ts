import Quill from "quill";
import { addImageSelectHandlers } from "./addImageSelectHandlers";
import {
  ImagePlusOptions,
  NormalizedImagePlusOptions,
  ResizePreset,
  ResizePresetInput,
} from "./types";
import { initImagePlusSpan } from "./initImagePlusSpan";
import { insertImage } from "./uploadImage";

function normalizePreset(preset: ResizePresetInput): ResizePreset | null {
  if (typeof preset === "number") {
    return {
      type: "width",
      label: `${preset}px`,
      width: preset,
    };
  } else if (typeof preset === "string") {
    let matchData: RegExpMatchArray | null;
    if ((matchData = preset.match(/^(\d+)[/](\d+)$/))) {
      return {
        type: "ratio",
        label: matchData[0],
        ratio: parseInt(matchData[1]) / parseInt(matchData[2]),
      };
    } else if ((matchData = preset.match(/^(\d+)%$/))) {
      return {
        type: "ratio",
        label: matchData[0],
        ratio: parseInt(matchData[1]) / 100,
      };
    } else {
      return null;
    }
  } else {
    return preset;
  }
}

export class ImagePlusModule {
  quill: Quill;
  options: NormalizedImagePlusOptions;

  constructor(
    quill: Quill,
    { resizePresets, ...inputOptions }: ImagePlusOptions
  ) {
    this.quill = quill;
    this.options = {
      minWidth: 50,
      maxWidth: 480,
      imageBorderRadius: 0,
      focusBorderWidth: 4,
      focusBorderColor: "black",
      labelColor: "white",
      labelBackground: "black",
      labelHeight: 20,
      labelBorderRadius: 3,
      labelBorderColor: "rgba(255, 255, 255, 0.25)",
      labelBorderWidth: 1,
      labelFontFamily: "sans-serif",
      labelFontSize: 10,
      labelOffset: 4,
      presetColor: "white",
      presetBackground: "#000",
      presetDisabledColor: "#aaa",
      presetDisabledBackground: "#333",
      presetFocusColor: "yellow",
      presetFocusBackground: "black",
      presetHeight: 20,
      presetBorderRadius: 3,
      presetBorderColor: "rgba(255, 255, 255, 0.25)",
      presetBorderWidth: 1,
      presetFontFamily: "sans-serif",
      presetFontSize: 10,
      presetOffset: 2,
      handleColor: "black",
      smallHandleThreshold: { width: 100, height: 100 },
      bigHandleRadius: 8,
      bigHandleWidth: 16,
      bigHandleHeight: 48,
      smallHandleRadius: 6,
      smallHandleWidth: 16,
      smallHandleHeight: 24,
      smallHandleColor: "black",
      smallHandleOffset: 1,
      ...inputOptions,
      resizePresets: (resizePresets || [160, 320, "1/2", "100%"])
        .map(normalizePreset)
        .filter((v) => v !== null) as ResizePreset[],
    };

    addImageSelectHandlers(quill);

    this.addEditorTextChangeHandler();
    this.registerToolbar();
  }

  registerToolbar() {
    this.quill.getModule("toolbar").addHandler("image", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        insertImage(this.quill, file);
      };
    });
  }

  addEditorTextChangeHandler() {
    /**
     * NOTE: Must be `editor-change` as `text-change` doesn't fire on first load
     */
    this.quill.on(
      "editor-change",
      (eventName: "text-change" | "selection-change") => {
        if (eventName === "text-change") {
          this.onEditorTextChange();
        }
      }
    );
  }

  /**
   * Make sure all `img` elements are wrapped in a `span` with the `ql-image`
   * class.
   */
  onEditorTextChange() {
    const images: NodeListOf<HTMLImageElement> =
      this.quill.root.querySelectorAll(":not(.ql-image) > img");
    images.forEach((image: HTMLImageElement) => {
      const span = document.createElement("span");
      span.setAttribute("class", "ql-image");
      initImagePlusSpan(span);
      /**
       * If resize isn't working on the image, especially on the first click,
       * this may be the issue.
       *
       * Be careful here. When we clone the image, it's not the original image
       * and if we aren't careful with some of this logic, we end up with a
       * Preact component trying to modify the wrong Image element's width and
       * the resize doesn't work.
       */
      const cloneImage = image.cloneNode(true) as HTMLImageElement;
      span.appendChild(cloneImage);
      const parentNode = image.parentNode;
      parentNode?.replaceChild(span, image);
    });
  }
}
