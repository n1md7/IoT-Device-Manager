export type Extensions =
  | "json"
  | "html"
  | "text"
  | "css"
  | "js"
  | "ico"
  | "png"
  | "jpg"
  | "jpeg";

export class Extension {
  private readonly extension: Map<Extensions, string>;

  constructor() {
    this.extension = new Map([
      ["json", "application/json"],
      ["html", "text/html"],
      ["text", "text/plain"],
      ["css", "text/css"],
      ["js", "application/javascript"],
      ["ico", "image/x-icon"],
      ["png", "image/png"],
      ["jpg", "image/jpeg"],
      ["jpeg", "image/jpeg"],
    ]);
  }

  isValid(extension: string): extension is Extensions {
    return this.extension.has(extension as Extensions);
  }

  getContentTypeBy(extension: Extensions) {
    return this.extension.get(extension) as string;
  }
}