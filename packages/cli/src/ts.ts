import * as ts from "typescript";
import * as fs from "node:fs";

import { defaultCompilerOptions } from "./constant";
export class TSLanguageServiceHost implements ts.LanguageServiceHost {
  // #region 实现 LanguageServiceHost 接口
  private __files: Map<
    string,
    { version: string; content: ts.IScriptSnapshot }
  > = new Map();
  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return options.lib?.[0] ?? "esnext";
  }
  getCompilationSettings(): ts.CompilerOptions {
    return defaultCompilerOptions;
  }
  getNewLine?(): string {
    throw new Error("Method not implemented.");
  }
  getScriptFileNames(): string[] {
    return Array.from(this.__files.keys());
  }
  getScriptKind?(fileName: string): ts.ScriptKind {
    const postfix = fileName
      .substring(fileName.lastIndexOf(".") + 1)
      .toLowerCase();
    const postfixMapper = {
      ts: ts.ScriptKind.TS,
      tsx: ts.ScriptKind.TSX,
      js: ts.ScriptKind.JS,
      jsx: ts.ScriptKind.JSX,
    };
    return postfixMapper[postfix] ?? ts.ScriptKind.TSX;
  }
  getScriptVersion(fileName: string): string {
    return this.__files.get(fileName)?.version ?? "0";
  }
  getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
    if (!this.__files.has(fileName)) {
      const fileContent = fs.readFileSync(fileName, { encoding: "utf-8" });
      this.__files.set(fileName, {
        version: "0",
        content: ts.ScriptSnapshot.fromString(fileContent),
      });
    }
    return this.__files.get(fileName)?.content;
  }
  getCurrentDirectory(): string {
    return process.cwd();
  }
  readDirectory?(
    path: string,
    extensions?: readonly string[] | undefined,
    exclude?: readonly string[] | undefined,
    include?: readonly string[] | undefined,
    depth?: number | undefined
  ): string[] {
    return ts.sys.readDirectory(path, extensions, exclude, include, depth);
  }
  readFile(path: string, encoding?: string | undefined): string | undefined {
    return ts.sys.readFile(path, encoding);
  }
  fileExists(path: string): boolean {
    return fs.existsSync(path);
  }
  directoryExists?(directoryName: string): boolean {
    return ts.sys.directoryExists(directoryName);
  }

  // #endregion 实现 LanguageServiceHost 接口
}
