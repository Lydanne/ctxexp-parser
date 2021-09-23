export default {
  input: "src/index.js",
  output: [
    {
      file: "libs/ctxexp-parser.esm.js",
      format: "esm",
    },
    {
      file: "libs/ctxexp-parser.cjs.js",
      format: "cjs",
    },
  ],
};
