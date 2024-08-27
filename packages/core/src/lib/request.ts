import request, { AxiosRequestConfig, AxiosResponse } from "axios";

async function handler(res: AxiosResponse): Promise<object> {
  if (res.status === 200) {
    return res.data.code === 200 ? res.data.data : res.data;
  }
  return res;
}

class Http {
  constructor(private baseUrl: string = "", private responseHandler: (res: AxiosResponse) => Promise<object> = handler, private useProxy = true) {}
  async request<T>(url: string, args: object): Promise<T> {
    if (!args["headers"]) {
      args["headers"] = {};
    }
    args["headers"]["origin-url"] = url;
    const res = this.useProxy ? await request("/soda-app", args) : await request(url, args);
    return this.responseHandler(res) as Promise<T>;
  }
  get<T>(url: string, params: object = {}, config: AxiosRequestConfig<object> = {}): Promise<T> {
    return this.request<T>(`${this.baseUrl}${url}`, { method: "GET", ...config, params });
  }
  delete<T>(url: string, data: object = {}, config: AxiosRequestConfig<object> = {}): Promise<T> {
    return this.request(`${this.baseUrl}${url}`, { method: "DELETE", ...config, data });
  }
  post<T>(url: string, data: object = {}, config: AxiosRequestConfig<object> = {}): Promise<T> {
    return this.request<T>(`${this.baseUrl}${url}`, { method: "POST", ...config, data });
  }
  put<T>(url: string, data: object = {}, config: AxiosRequestConfig<object> = {}): Promise<T> {
    return this.request(`${this.baseUrl}${url}`, { method: "PUT", ...config, data });
  }
  upload(url: string, formData: object = {}, config: AxiosRequestConfig<object> = {}) {
    const contentType = { "Content-Type": "multipart/form-data" };
    return this.request(`${this.baseUrl}${url}`, {
      method: "POST",
      ...config,
      data: formData,
      headers: contentType,
    });
  }
}
/**
 * 创建 http 请求
 * @param baseUrl   根路径
 * @param responseHandler   异常处理
 * @returns
 */
export function createRequest(baseUrl?: string, { responseHandler, useProxy }: { responseHandler?: (res: AxiosResponse) => Promise<object>; useProxy?: boolean } = {}) {
  return new Http(baseUrl, responseHandler, useProxy);
}
/**
 * axios
 */
export const axios = request;
