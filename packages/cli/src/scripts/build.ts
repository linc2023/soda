import * as vite from "vite";
import { buildPackage, getExternal, getLibrary, globals, mergeViteConfig, resolvePackageJson } from "../utils";
import { basename } from "path";
import replace from "@rollup/plugin-replace";

type BuildOption = {
  outDir?: string;
  minify?: boolean;
  logLevel?: vite.LogLevel;
  platform?: string;
};

/**
 *
 * @param root 根路径
 * @param options 打包配置
 */
export const build = async (root: string, options: BuildOption) => {
  const config = await mergeViteConfig(root, getDefaultConfig(root, options));
  vite.build(config);
};
/**
 * 获取默认配置
 * @param root
 * @param options
 * @returns
 */
function getDefaultConfig(root: string, options: BuildOption): vite.InlineConfig {
  const pkg = resolvePackageJson(root);
  const outDir = options.outDir ? formatPath(options.outDir) : options.outDir;
  const bundleName = basename(pkg.name);
  const libName = getLibrary(pkg);
  const external = getExternal(pkg, globals);
  const config: vite.InlineConfig = {
    root,
    build: {
      outDir,
      emptyOutDir: true,
      minify: options.minify,
      rollupOptions: {
        external,
        output: pkg.private
          ? {
              format: "umd",
              globals: globals,
            }
          : {
              extend: true,
              globals: globals,
              assetFileNames: (chunkInfo) => (chunkInfo.name === "style.css" ? `${bundleName}[extname]` : "assets/[name]-[hash][extname]"),
            },
      },
    },
    logLevel: options.logLevel,
    plugins: [
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("production"),
        "process.env.platform": options.platform === "true",
      }),
    ],
  };
  if (!pkg.private) {
    config.build!.lib = {
      entry: pkg.main,
      fileName: `${bundleName}`,
      formats: ["umd"],
      name: libName,
    };
  }
  if (!pkg.private && !pkg.noMeta) {
    config.plugins?.push(buildPackage(root, pkg, libName));
  }
  return config;
  function formatPath(path: string) {
    return path.replace("{name}", pkg.name).replace("{version}", pkg.version);
  }
}
