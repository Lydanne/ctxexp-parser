import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default defineConfig([
  {
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
    ],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        outDir: "libs",
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "libs/ctxexp-parser.esm.min.js",
        format: "esm",
      },
      {
        file: "libs/ctxexp-parser.cjs.min.js",
        format: "cjs",
        exports: "auto",
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        outDir: "libs",
      }),
      terser(),
    ],
  },
]);
