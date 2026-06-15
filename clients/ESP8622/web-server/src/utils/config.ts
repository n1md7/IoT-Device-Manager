import config from "mc/config";

const portOverride = config["port"];
export const port: number = portOverride ? parseInt(portOverride, 10) : 80;
export const domain: string = config["domain"] || "node-mcu";
export const code: string = config["code"] || "D0001";
export const version: string = config["version"] || "1.0.0";
export const description: string =
  config["description"] ||
  "A web server running on NodeMCU with scheduler and manual controller";
