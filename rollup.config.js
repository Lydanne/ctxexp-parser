import { defineConfig } from "rollup";
import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";

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
  ],
  plugins: [
    nodeResolve(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
});
