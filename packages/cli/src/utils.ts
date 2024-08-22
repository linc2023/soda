import { Package } from "@soda/utils";
import { readFileSync } from "fs";
import { EOL } from "os";
import { join } from "path";

/**
 * 转换 node 命令参数
 * @param argvs
 * @param startIndex
 */
export const parseCommandArgv = (argvs: string[] = process.argv) => {
  const result: Record<string, string> = {};
  let start = 0;
  for (let i = 0; i < argvs.length; i++) {
    const argv = argvs[i];
    if (argv.startsWith("--")) {
      result[argv] = argvs[++i];
    } else {
      result[start++] = argv;
    }
  }
  return result;
};

/**
 * 解析 package.json
 * @param pkgPath
 * @returns
 */
export const resolvePackageJson = (pkgPath: string): Package => {
  const text = readFileSync(join(pkgPath, "./package.json"), "utf-8");
  let json: Package;
  try {
    json = JSON.parse(text);
  } catch (error) {
    json = {} as Package;
  }
  json.peerDependencies = json.peerDependencies ?? {};
  json.types ??= json.main ?? `index.tsx`;
  return json;
};

/**
 * 文本写入器
 */
export class TextWriter {
  /** 缩进符 */
  private indentChar;
  /** 当前总缩进符 */
  private indentConunt = 0;
  /** 内容 */
  private content = "";

  constructor(indentChar = "\t") {
    this.indentChar = indentChar;
  }
  /** 获取内容 */
  toString() {
    return this.content;
  }
  /** 增加缩进 */
  indent() {
    this.indentConunt++;
  }
  /** 减少缩进 */
  unindent() {
    this.indentConunt--;
  }
  eol() {
    return EOL;
  }
  /** 换行写入 */
  writeLine(content: string) {
    this.content = this.content + this.eol();
    this.write(content);
  }
  /** 写入内容 */
  write(content: string) {
    let indentChar = "";
    for (let i = 0; i < this.indentConunt; i++) {
      indentChar += this.indentChar;
    }
    content = indentChar + content;
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      if (char === "\n" && i !== content.length - 1) {
        content = content.substring(0, i + 1) + indentChar + content.substring(i + 1);
        i++;
      }
    }
    this.content += content;
  }
}
