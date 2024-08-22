/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import { urlToHttpOptions } from "url";
/**
 * 代理转发
 * @param basUrl 代理路径
 * @returns
 */
export default function httpProxyPlugin(basUrl: string) {
  return {
    name: "http-proxy-plugin",
    configureServer(server: any) {
      server.middlewares.use((request: any, response: any, next: any) => {
        if (!request.url.startsWith(basUrl)) {
          return next();
        }
        const originUrl = request.headers["origin-url"];
        const referer = request.headers["referer"];
        const url = originUrl.startsWith("http://") || originUrl.startsWith("https://") ? originUrl : referer.substring(0, referer.length - 1) + originUrl;
        const httpOptions = {
          ...urlToHttpOptions(new URL(url)),
          method: request.method,
          headers: request.headers,
        };
        const req = http.request(httpOptions, (res) => {
          res.setEncoding("utf8");
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            const result = JSON.stringify({
              code: 200,
              data: JSON.parse(data),
            });
            response.writeHead(200, { "content-type": "application/json;charset=utf-8" });
            response.end(result);
          });
        });
        req.on("error", (e) => {
          console.error(`problem with request: ${e.message}`);
        });
        req.end();
      });
    },
  };
}
