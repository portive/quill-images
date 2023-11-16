const Quill = window.Quill;

if (typeof Quill === "undefined") {
  throw new Error("Could not find Quill in global namespace");
}

export default Quill;
