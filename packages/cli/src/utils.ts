import { Package, formatDate, getLibName, getMainVersion, packageNameToCamelCase } from "@soda/utils";
import { existsSync, readFileSync } from "fs";
import { EOL } from "os";
import { basename, join, resolve } from "path";
import { createDTSBuidler } from "./ts/dtsBuilder";
import { getComponentDescriptors } from "./ts/parser";
import * as vite from "vite";

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
      if (i < argvs.length - 1 && !argvs[i + 1].startsWith("--")) {
        result[argv] = argvs[++i];
      } else {
        result[argv] = "true";
      }
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
/**
 * 生成 npm 包元数据
 * @param root
 * @param pkg
 * @param libName
 * @param bundle
 * @returns
 */
export function generateNodePackageMeta(root: string, pkg: Package, libName: string) {
  const { types, name } = pkg;
  const bundleName = basename(name);
  const { code, entryFile, program } = createDTSBuidler(root, bundleName).build(resolve(root, types));
  const { componentDescriptor: components = [], propsDescriptor: propsMap = {} } = entryFile ? getComponentDescriptors(entryFile, program.getTypeChecker()) : {};
  const pkgJson = generatePackageJson(pkg, bundleName);
  const manifestSring = JSON.stringify({ name: name, library: libName ?? packageNameToCamelCase(pkg.name), displayName: pkgJson.displayName, version: pkgJson.version, components }, null, 2);
  return {
    code,
    pkgString: JSON.stringify(pkgJson, null, 2),
    bundleName,
    propsMapString: JSON.stringify(propsMap, (_, value) => (typeof value === "bigint" ? value.toString() + "n" : value), 2),
    manifestSring,
  };
}

/**
 * 生成 .d.ts
 * @param root 目录
 * @param types 入口文件
 * @param bundleName 包名
 * @returns
 */
export function buildPackage(root: string, pkg: Package, libName: string): vite.Plugin {
  return {
    name: buildPackage.name,
    generateBundle(_, bundle) {
      for (const key in bundle) {
        const chunk = bundle[key] as { code: string; modules: Record<string, any>; exports: any[] };
        if (key.endsWith(".js")) {
          const code = `arguments[0]["${libName}"] = ${JSON.stringify({ version: pkg.version })}; `;
          const index = chunk.code.indexOf("{");
          chunk.code = chunk.code.substring(0, index + 1) + code + chunk.code.substring(index + 1);
        }
      }
      const { bundleName, code, pkgString, propsMapString, manifestSring } = generateNodePackageMeta(root, pkg, libName);
      this.emitFile({ fileName: `${basename(bundleName)}.d.ts`, source: code, type: "asset" });
      this.emitFile({ fileName: "package.json", type: "asset", source: pkgString });
      this.emitFile({ fileName: `manifest.json`, source: manifestSring, type: "asset" });
      this.emitFile({ fileName: "prop-meta.json", type: "asset", source: propsMapString });
    },
  };
}

/**
 * 生成 package.json
 * @param pkg 原始 package.json
 * @param bundleName 包名
 * @returns
 */
function generatePackageJson(pkg: Package, bundleName: string) {
  const { name, version, contributors, homepage, description, peerDependencies, keywords, author, license, displayName } = pkg;
  const json = {
    name,
    displayName: displayName ?? name,
    main: `${bundleName}.js`,
    module: `${bundleName}.js`,
    types: `${bundleName}.d.ts`,
    version,
    author,
    description,
    license,
    keywords,
    homepage,
    contributors,
    dependencies: peerDependencies,
    createTime: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
  };
  return json;
}
/**
 * 获取打包变量
 * @param pkg
 * @returns
 */
export function getLibrary(pkg: Package) {
  const map = {
    "@soda/core": "sodaCore",
    "@soda/designer": "sodaDesigner",
    "@soda/common": "sodaCommon",
  };
  return map[pkg.name] ? map[pkg.name] : `${getLibName(pkg.library, pkg.name)}${getMainVersion(pkg.version)}`;
}
/**
 * 获取需要排除的模块
 * @param pkg
 * @param excluded
 * @returns
 */
export function getExternal(pkg: Package, excluded: { [key: string]: string } = globals) {
  const peerDependencies = Object.keys(pkg.peerDependencies);
  peerDependencies.forEach((dependency) => {
    if (!excluded[dependency]) {
      excluded[dependency] = packageNameToCamelCase(dependency);
    }
  });
  return [...Object.keys(excluded), ...peerDependencies];
}
/**
 * 打包全局变量
 */
export const globals = {
  react: "window.React",
  "react-dom": "window.ReactDOM",
  mobx: "window.mobx",
  "mobx-react": "window.mobxReact",
  "@soda/common": "window.sodaCommon",
  "@soda/core": "window.sodaCore",
  "@soda/designer": "window.sodaDesigner",
  classnames: "window.classNames",
  axios: "axios",
  "react-is": "window.ReactIs",
};

/**
 * 合并 vite 配置文件
 * @param root
 * @param defaultConfig
 * @returns
 */
export async function mergeViteConfig(root: string, defaultConfig: vite.InlineConfig) {
  let filePath = resolve(root, "vite.config.ts");
  let configPath = "";
  if (existsSync(filePath)) {
    configPath = filePath;
  } else {
    filePath = resolve(root, "vite.config.js");
    if (existsSync(filePath)) {
      configPath = filePath;
    }
  }
  if (configPath.length === 0) {
    return defaultConfig;
  }
  const userConfig: vite.InlineConfig = (await import(configPath)).default;
  return vite.mergeConfig(defaultConfig, userConfig);
}
