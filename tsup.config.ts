import { defineConfig } from "tsup";

export default defineConfig([
  {
    entryPoints: ["./src/ImagePlusModule/index.ts"],
    dts: { only: true },
    outDir: ".dist",
    format: ["esm"],
    globalName: "ImagePlusModule",
  },
  {
    entryPoints: ["./src/ImagePlusModule/index.ts"],
    outDir: ".dist",
    format: ["esm", "cjs"],
    // outExtension: (context) => {
    //   return { dts: `.${context.format}.d.js` };
    // },
    // globalName: "ImagePlusModule",
  },
  /**
   * Browser
   */
  {
    entryPoints: ["./src/ImagePlusModule/index.ts"],
    outDir: ".dist",
    format: ["iife"],
    globalName: "ImagePlusModule",
  },
]);
