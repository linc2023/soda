import * as vite from "vite";
import { resolvePackageJson } from "./utils";
import { basename, resolve } from "path";
import { createDTSBuidler } from "./ts/dtsBuilder";
import { getComponentDescriptors } from "./ts/parser";
import { Package, formatDate, packageNameToCamelCase } from "@soda/utils";
import replace from "@rollup/plugin-replace";

type BuildOption = {
  outDir?: string;
  minify?: boolean;
};

/**
 *
 * @param root 根路径
 * @param options 打包配置
 */
export const build = (root: string, options: BuildOption) => {
  const pkg = resolvePackageJson(root);
  const outDir = options.outDir ? formatPath(options.outDir) : options.outDir;
  const bundleName = basename(pkg.name);
  const globals = {
    react: "window.React",
    "react-dom": "window.ReactDOM",
    // "react/jsx-runtime": "react/jsx-runtime",
    mobx: "window.mobx",
    "mobx-react": "window.mobxReact",
    "@soda/core": "window.sodaCore",
    antd: "window.antd",
    classnames: "window.classNames",
    axios: "axios",
    "react-is": "window.ReactIs",
  };
  const external = getExternal();
  vite.build({
    root,
    build: {
      outDir,
      emptyOutDir: true,
      lib: {
        entry: pkg.main,
        fileName: `${bundleName}`,
        formats: ["umd"],
        name: packageNameToCamelCase(pkg.name),
      },
      minify: options.minify,
      rollupOptions: {
        external,
        output: {
          extend: true,
          globals,
          assetFileNames: (chunkInfo) => (chunkInfo.name === "style.css" ? `${bundleName}[extname]` : "assets/[name]-[hash][extname]"),
        },
      },
    },
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      generateDTS(root, pkg),
    ],
  });
  function formatPath(path: string) {
    return path.replace("{name}", pkg.name).replace("{version}", pkg.version);
  }
  function getExternal() {
    const peerDependencies = Object.keys(pkg.peerDependencies);
    peerDependencies.forEach((dependency) => {
      if (!globals[dependency]) {
        globals[dependency] = packageNameToCamelCase(dependency);
      }
    });
    return [...Object.keys(globals), "antd", ...peerDependencies];
  }
};
// cssLinkPlugin("");
/**
 * 引入 css 文件
 * @param bundleName 包名
 * @returns
 */
// function cssLinkPlugin(bundleName: string): vite.Plugin {
//   return {
//     name: cssLinkPlugin.name,
//     generateBundle(_, bundle) {
//       for (const key in bundle) {
//         const chunk = bundle[key] as {
//           code: string;
//           modules: Record<string, any>;
//         };
//         if (hasCSS(chunk.modules)) {
//           const cssPath = `./${bundleName}.css`;
//           chunk.code = `const __link = document.head.appendChild(document.createElement("link"));
//               __link.rel = "stylesheet";
//               __link.href = new URL(${JSON.stringify(cssPath)},import.meta.url).href;
//           ${chunk.code}
//           `.replace(/\n/g, "");
//         }
//       }
//     },
//   };
//   function hasCSS(modules: Record<string, any>) {
//     for (const key in modules) {
//       if (/\.(?:css|scss|sass|less|styl)$/i.test(key)) {
//         return true;
//       }
//     }
//     return false;
//   }
// }
/**
 * 生成 .d.ts
 * @param root 目录
 * @param types 入口文件
 * @param bundleName 包名
 * @returns
 */
function generateDTS(root: string, pkg: Package): vite.Plugin {
  const { types, name } = pkg;
  const bundleName = basename(name);
  return {
    name: generateDTS.name,
    generateBundle() {
      const { code, entryFile, program } = createDTSBuidler(root, bundleName).build(resolve(root, types));
      this.emitFile({
        fileName: `${basename(bundleName)}.d.ts`,
        source: code,
        type: "asset",
      });
      const components = entryFile ? getComponentDescriptors(entryFile, program.getTypeChecker()) : { files: [] };
      const pkgJson = generatePackageJson(pkg, bundleName);
      this.emitFile({ fileName: "package.json", type: "asset", source: JSON.stringify(pkgJson, null, 2) });
      this.emitFile({ fileName: `manifest.json`, source: JSON.stringify({ name: name, displayName: pkgJson.displayName, version: pkgJson.version, components }, null, 2), type: "asset" });
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
