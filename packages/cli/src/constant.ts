import * as ts from "typescript";

/**
 * 默认编译器选项
 */
export const defaultCompilerOptions: ts.CompilerOptions = {
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ES2020,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  experimentalDecorators: true,
  allowJs: true,
  useDefineForClassFields: false,
  allowSyntheticDefaultImports: true,
  newLine: ts.NewLineKind.LineFeed,
  preserveConstEnums: true,
  target: ts.ScriptTarget.ES2022,
  moduleDetection: ts.ModuleDetectionKind.Force,
  lib: [
    "lib.es2022.d.ts",
    "lib.dom.d.ts",
    "lib.dom.iterable.d.ts",
    "lib.vis.d.ts",
  ],
  baseUrl: ".",
  locale: "zh-cn",
  suppressOutputPathCheck: true,
};
