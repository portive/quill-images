import { Client, uploadFile } from "@portive/client";
import { Blot } from "parchment/dist/typings/blot/abstract/blot";
import Quill, { RangeStatic } from "quill";
import Delta from "quill-delta";

const AUTH_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InB1UFoyZTdlN0tUVzh0MjQifQ.eyJpYXQiOjE2OTY1NzU0OTUsImV4cCI6MTcyODEzMzA5NX0.vbtOx4mtGFWRkY4QORoAK00ISBFwBUe7TuKFAeYB2X8`;

const portiveClient = new Client({ authToken: AUTH_TOKEN });

function calculateNewRange(delta: Delta, range: RangeStatic): RangeStatic {
  let currentIndex = 0;

  for (let op of delta.ops) {
    if (op.retain !== undefined) {
      if (currentIndex + (op.retain as number) > range.index) {
        // The delta's retain operation crosses the start of the range.
        range.index += op.retain as number;
      }
      currentIndex += op.retain as number;
    } else if (op.delete !== undefined) {
      if (currentIndex + op.delete > range.index) {
        // The delta's delete operation crosses the start of the range.
        let deletePastRangeStart = currentIndex + op.delete - range.index;
        range.index -= deletePastRangeStart;
        range.length -= op.delete - deletePastRangeStart;
      } else if (currentIndex + op.delete <= range.index) {
        range.index -= op.delete;
      }
      currentIndex += op.delete;
    } else if (op.insert !== undefined) {
      const insertLength = typeof op.insert === "string" ? op.insert.length : 1; // assuming 1 for embeds
      if (currentIndex <= range.index) {
        // The insert happens before (or exactly at) the start of the range.
        range.index += insertLength;
      }
      currentIndex += insertLength;
    }
  }

  return range;
}

export function insertImage(quill: Quill, file: File) {
  if (!file) return;

  const range = quill.getSelection(true);

  // Read the file as a data URL and insert it
  const reader = new FileReader();

  reader.onload = async (e) => {
    if (!e.target) return;

    /**
     * Insert the image as a custom blot
     */
    const dataURL = e.target.result as string;
    let delta = new Delta()
      .retain(range.index)
      .delete(range.length)
      .insert({ customImage: dataURL });
    quill.updateContents(delta);

    /**
     * Create a reference to a dynamic range that will be updated as the user
     * types.
     */
    let dynamicRange = { index: range.index + 1, length: 1 };
    const textChangeHandler = (changeDelta: Delta) => {
      dynamicRange = calculateNewRange(changeDelta, dynamicRange);
    };
    quill.on("text-change", textChangeHandler);

    quill.setSelection(range.index + 1, 0);

    const uploadResult = await uploadFile({
      client: portiveClient,
      file,
      onProgress(e) {
        console.log(e);
      },
    });

    if (uploadResult.type !== "success") {
      quill.off("text-change", textChangeHandler);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const range = quill.getSelection(true);
      quill.off("text-change", textChangeHandler);
      quill.updateContents(
        new Delta()
          .retain(dynamicRange.index)
          .delete(dynamicRange.length)
          .insert({ customImage: uploadResult.hostedFile.url })
      );
      quill.setSelection(range);
    };
    img.onerror = () => {
      quill.off("text-change", textChangeHandler);
      quill.updateContents(
        new Delta().retain(dynamicRange.index).delete(dynamicRange.length)
      );
    };
    img.src = uploadResult.hostedFile.url;
  };
  reader.readAsDataURL(file);
}
