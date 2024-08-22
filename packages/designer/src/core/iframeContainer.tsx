export class IFrameContainer {
  iframeStatus: "LOADED" | "INIT" | "FAILED";
  iframe: HTMLIFrameElement;

  readyQueue: (() => void)[] = [];
  errorQueue: ((e: Error) => void)[] = [];
  error!: Error;

  constructor() {
    this.iframeStatus = "INIT";
    this.iframe = this.createIframe();
  }
  private createIframe(): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "border:none;width:100%;height:100%;";
    return iframe;
  }
  /**
   * 获取 contentDocument
   */
  get document() {
    return this.iframe.contentDocument!;
  }
  /**
   * 获取 contentWindow
   */
  get window() {
    return this.iframe.contentWindow!;
  }

  private _load(containerDom: HTMLElement) {
    containerDom.appendChild(this.iframe);
    const document = this.document!;
    const promise = new Promise<void>((resolve) => {
      const loaded = () => {
        this.readyQueue.forEach((cb) => cb());
        this.readyQueue = [];
        this.iframeStatus = "LOADED";
        resolve();
      };
      this.iframe.addEventListener("load", loaded);
    });
    // 需要在 load 之后
    document.open();
    document.write(`
            <!doctype html>
            <html class="engine-design-mode">
              <head>
                <meta charset="utf-8"/>
                <style>
                    html,body,#app,.default-page{
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        width: 100%;
                        height: 100%;
                    }
                    .default-page {
                        position: relative;
                        overflow: hidden;
                        width: 100%;
                        height: 100%;
                    }
                    .default-page .default-page-containerEmpty {
                        width: 100%;
                        height: 100%;
                        background-color: var(--container-emptyBackgroundColor, #ffffff);
                        font-size: var(--container-emptyFontSize, 14px);
                    }

                    .default-page .default-page-containerEmpty .default-page-containerPlaceholder {
                        margin: var(--container-emptyPlaceholderMargin, 12px);
                        background-color: var(--container-emptyPlaceholderBackgroundColor, #f0f0f0);
                        color: var(--container-emptyPlaceholderColor, #011833);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-sizing: border-box;
                        height: calc(100% - 24px);
                        width: calc(100% - 24px);
                        border: 1px solid #DEE1E4;
                        border-radius: 2px;
                    }
                </style>
              </head>
              <body>
                <div id="app"></div>
              </body>
            </html>`);
    document.close();
    return promise;
  }
  /**
   * 将 iframe 添加到父节点
   * @param containerDom
   */
  async append(containerDom: HTMLElement) {
    try {
      await this._load(containerDom);
    } catch (error) {
      this.error = error as Error;
      this.errorQueue.forEach((cb) => cb(error as Error));
      this.errorQueue = [];
      this.iframeStatus = "FAILED";
    }
  }

  /**
   * iframe 加载完成回调
   * @param cb
   * @returns
   */
  onReady(cb: () => void) {
    if (this.iframeStatus === "LOADED") {
      cb();
      return;
    }
    if (this.iframeStatus === "INIT") {
      this.readyQueue.push(cb);
    }
  }
  /**
   * 加载失败回调
   * @param cb
   * @returns
   */
  onError(cb: (e: Error) => void) {
    if (this.iframeStatus === "FAILED") {
      cb(this.error);
      return;
    }
    if (this.iframeStatus === "INIT") {
      this.errorQueue.push(cb);
    }
  }
  /**
   * 往 iframe 中插入远程 js
   * @param url
   * @returns
   */
  insertJS(url: string) {
    const document = this.document!;
    const script = document.createElement("script");
    script.src = url;
    document.head.append(script);
    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
  }
  /**
   * 往 iframe 中插入 js 文本
   * @param text
   */
  insertJSText(text: string) {
    const document = this.document!;
    const script = document.createElement("script");
    script.textContent = text;
    document.head.append(script);
  }
  /**
   * 往 iframe 中插入 css 文本
   * @param text
   */
  insertStyle(url: string) {
    const document = this.document!;
    const style = document.createElement("link");
    style.href = url;
    document.head.append(style);
    return new Promise((resolve, reject) => {
      style.onload = resolve;
      style.onerror = reject;
    });
  }
  /**
   * 往 iframe 中插入 css 文本
   * @param text
   */
  insertStyleText(text: string) {
    const document = this.document!;
    const style = document.createElement("style");
    style.textContent = text;
    document.head.append(style);
  }
}
