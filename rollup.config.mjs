import { dts } from "rollup-plugin-dts";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies)
  .concat(["net", "dgram", "events"]);

export default [
  {
    input,
    plugins: [
      typescript({
        check: true,
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "ES2015",
            removeComments: true,
          }
        }
      }),
    ],
    external,
    output: [
      {
        banner,
        file: pkg.main,
        format: "cjs",
      },
      {
        banner,
        file: pkg.module,
        format: "es",
      }
    ]
  },
  // types
  {
    input,
    plugins: [
      dts(),
    ],
    external,
    output: [
      {
        banner,
        file: pkg.types,
        format: "es",
      }
    ]
  },
];