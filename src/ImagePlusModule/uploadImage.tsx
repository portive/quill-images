import { Client, uploadFile } from "@portive/client";
import { render } from "preact";
import Quill from "quill";
import { ProgressBar } from "./ProgressBar";
import { getImagePlusOptions } from ".";

const Delta = Quill.import("delta");

const AUTH_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InB1UFoyZTdlN0tUVzh0MjQifQ.eyJpYXQiOjE2OTY1NzU0OTUsImV4cCI6MTcyODEzMzA5NX0.vbtOx4mtGFWRkY4QORoAK00ISBFwBUe7TuKFAeYB2X8`;

const portiveClient = new Client({ authToken: AUTH_TOKEN });

async function getDataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) return;
      resolve(e.target.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getImageSizeFromUrl(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = function () {
      reject(new Error("Failed to load image"));
    };

    image.src = src;
  });
}

export async function insertImage(quill: Quill, file: File) {
  if (!file) return;

  const options = getImagePlusOptions(quill);

  const range = quill.getSelection(true);

  const dataURL = await getDataUrlFromFile(file);
  const imageSize = await getImageSizeFromUrl(dataURL);
  const width = Math.min(imageSize.width, options.maxWidth);
  // console.log({ width });

  /**
   * Insert the image as a custom blot
   */
  let delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert({ customImage: dataURL });

  quill.updateContents(delta);

  const blot = quill.getLeaf(range.index + 1)[0];
  const image = blot.getImage();
  image.setAttribute("width", `${width}`);

  /**
   * Create a reference to a dynamic range that will be updated as the user
   * types.
   */
  // let dynamicRange = { index: range.index + 1, length: 1 };
  // const textChangeHandler = (changeDelta: Delta) => {
  //   dynamicRange = calculateNewRange(changeDelta, dynamicRange);
  // };
  // quill.on("text-change", textChangeHandler);

  quill.setSelection(range.index + 1, 0);

  render(
    <ProgressBar sentBytes={0} totalBytes={1} width={160} height={16} />,
    blot.domNode
  );

  const uploadResult = await uploadFile({
    client: portiveClient,
    file,
    onProgress(e) {
      render(
        <ProgressBar
          sentBytes={e.sentBytes}
          totalBytes={e.totalBytes}
          width={160}
          height={16}
        />,
        blot.domNode
      );
    },
  });

  if (uploadResult.type !== "success") {
    // quill.off("text-change", textChangeHandler);
    return;
  }

  const img = new Image();
  img.onload = () => {
    render(null, blot.domNode);
    image.setAttribute("src", uploadResult.hostedFile.url);
  };
  img.onerror = () => {
    /**
     * TODO: If the update fails, we should do something to let the user know.
     * Maybe write "Upload failed" on it or something?
     */
    // quill.off("text-change", textChangeHandler);
    // quill.updateContents(
    //   new Delta().retain(dynamicRange.index).delete(dynamicRange.length)
    // );
  };
  img.src = uploadResult.hostedFile.url;
}
