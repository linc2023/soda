import * as vite from "vite";
import { basename, extname, join, resolve } from "path";
import replace from "@rollup/plugin-replace";
import httpProxyPlugin from "../http-proxy";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "fs";
import { Package, getMimeType } from "@soda/utils";
import { build } from "./build";
import { resolvePackageJson } from "../utils";

type DevOption = {
  host?: string;
  open?: boolean;
  port?: number;
};

/**
 *
 * @param root 根路径
 * @param options 打包配置
 */
export const dev = async (root: string, { port, host, open }: DevOption) => {
  const outDir = resolve(`${root}/node_modules/.soda-cli`);
  const pkg = resolvePackageJson(root);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  await build(root, { outDir, logLevel: "error", minify: true });
  const server = await vite.createServer({
    root,
    server: {
      port,
      host,
      open,
    },
    plugins: [
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),

      httpProxyPlugin("/soda-app"),
      devServerPlugin(root, outDir, pkg),
    ],
  });
  await server.listen();
  server.printUrls();
};

/**
 * 接口转发
 * @param root
 * @param pkg
 * @param libName
 * @returns
 */
function devServerPlugin(root: string, outDir: string, pkg: Package): vite.Plugin {
  return {
    name: devServerPlugin.name,
    async configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pkgName = pkg.name;
        if (req.url === "/") {
          const indexHtml = readFileSync(resolve(__dirname, "../../view/index.html"), "utf-8");
          const fileName = basename(pkg.name);
          const script = `<script src="${pkg.name}/${fileName}.umd.js"></script>`;
          const style = `<link href="${pkg.name}/${fileName}.css" ref="stylesheet" type="text/css"></script>`;
          const registerScript = `<script>
            sodaDesigner.globalState.package.register(["${pkg.name}"])
          </script>`;
          res.writeHead(200, "OK", {
            "Content-type": "text/html",
          });
          res.end(indexHtml.replace(/<\/head>/, `${script} ${style} ${registerScript} <head/>`));
        } else if (req.url?.startsWith("/packages/@soda")) {
          readFile(resolve(__dirname, "../../view/", req.url.substring(1)), res);
        } else if (req.url?.startsWith("/assets")) {
          readFile(resolve(__dirname, "../../view/", req.url.substring(1)), res);
        } else if (req.url?.startsWith("/" + pkgName)) {
          readFile(join(outDir, req.url.replace("/" + pkgName, "")), res);
        } else {
          next();
        }
      });
      await build(root, { outDir, logLevel: "error", minify: true });
    },
    async handleHotUpdate(ctx) {
      const path = ctx.file;
      if (/\.[ts]sx?/i.test(path)) {
        await build(root, { outDir, logLevel: "error", minify: true });
      }
    },
  };
}
/**
 * 读取文件
 * @param path
 * @param res
 */
export function readFile(path: string, res: import("http").ServerResponse) {
  const stream = createReadStream(path);
  stream.on("error", () => {
    res.writeHead(404);
    res.end();
  });
  stream.on("open", () => {
    res.writeHead(200, "OK", {
      "Content-Type": getMimeType(extname(path)),
    });
  });
  stream.pipe(res);
}
