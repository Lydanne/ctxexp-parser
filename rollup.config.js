import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { uglify } from "rollup-plugin-uglify";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "libs/ctxexp-parser.esm.js",
      format: "esm",
    },
    {
      file: "libs/ctxexp-parser.cjs.js",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "libs/ctxexp-parser.esm.min.js",
      format: "esm",
      plugins: [uglify()],
    },
    {
      file: "libs/ctxexp-parser.cjs.min.js",
      format: "cjs",
      exports: "auto",
      plugins: [uglify()],
    },
  ],
  plugins: [
    nodeResolve(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
});
