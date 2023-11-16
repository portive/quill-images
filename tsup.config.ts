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
    // target: ["es2020"],
    platform: "browser",
    external: ["quill"],
    globalName: "ImagePlusModule",
    esbuildOptions: (options) => {
      if (!options.alias) options.alias = {};
      options.alias.quill = "./src/ImagePlusModule/quill-shim.js";
    }, //{
    // alias: {
    //   quill: "./src/ImagePlusModule/quill-shim.ts",
    // },
    // },
  },
]);
