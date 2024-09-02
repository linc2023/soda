import * as vite from "vite";
import { resolvePackageJson } from "./utils";
import { basename, resolve } from "path";
import { createDTSBuidler } from "./ts/dtsBuilder";
import { getComponentDescriptors } from "./ts/parser";
import { Package, formatDate, getLibName, getMainVersion, packageNameToCamelCase } from "@soda/utils";
import replace from "@rollup/plugin-replace";

type BuildOption = {
  outDir?: string;
  minify?: boolean;
};

let libName = "";
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
    mobx: "window.mobx",
    "mobx-react": "window.mobxReact",
    "@soda/core": "window.sodaCore",
    antd: "window.antd",
    classnames: "window.classNames",
    axios: "axios",
    "react-is": "window.ReactIs",
  };
  libName = pkg.name === "@soda/core" ? "sodaCore" : `${getLibName(pkg.library, pkg.name)}${getMainVersion(pkg.version)}`;
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
        name: libName,
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
    generateBundle(_, bundle) {
      const { code, entryFile, program } = createDTSBuidler(root, bundleName).build(resolve(root, types));
      this.emitFile({
        fileName: `${basename(bundleName)}.d.ts`,
        source: code,
        type: "asset",
      });
      for (const key in bundle) {
        const chunk = bundle[key] as {
          code: string;
          modules: Record<string, any>;
          exports: any[];
        };
        if (key.endsWith(".js")) {
          const code = `arguments[0]["${libName}"] = ${JSON.stringify({ version: pkg.version })}; `;
          const index = chunk.code.indexOf("{");
          chunk.code = chunk.code.substring(0, index + 1) + code + chunk.code.substring(index + 1);
        }
        // if (hasCSS(chunk.modules)) {
        //   const cssPath = `./${bundleName}.css`;
        //   chunk.code = `const __link = document.head.appendChild(document.createElement("link"));
        //       __link.rel = "stylesheet";
        //       __link.href = new URL(${JSON.stringify(cssPath)},import.meta.url).href;
        //   ${chunk.code}
        //   `.replace(/\n/g, "");
        // }
      }
      const { componentDescriptor: components = [], propsDescriptor: propsMap = {} } = entryFile ? getComponentDescriptors(entryFile, program.getTypeChecker()) : {};
      const pkgJson = generatePackageJson(pkg, bundleName);
      this.emitFile({ fileName: "package.json", type: "asset", source: JSON.stringify(pkgJson, null, 2) });
      this.emitFile({ fileName: `manifest.json`, source: JSON.stringify({ name: name, library: libName ?? packageNameToCamelCase(pkg.name), displayName: pkgJson.displayName, version: pkgJson.version, components }, null, 2), type: "asset" });
      this.emitFile({
        fileName: "prop-meta.json",
        type: "asset",
        source: JSON.stringify(
          propsMap,
          (_, value) => {
            if (typeof value === "bigint") {
              return value.toString() + "n"; // 转换为字符串
            }
            return value;
          },
          2
        ),
      });
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
