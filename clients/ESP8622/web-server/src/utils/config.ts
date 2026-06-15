import config from "mc/config";

const portOverride = config["port"];
export const port: number = portOverride ? parseInt(portOverride, 10) : 80;
export const name: string = config["name"];
export const code: string = config["code"];
export const version: string = config["version"];
export const description: string = config["description"];
