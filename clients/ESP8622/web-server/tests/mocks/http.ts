export { Server, Request } from "./moddable";
export type HTTPServerCallback = (...args: unknown[]) => void;
export type ServerMessages = Record<string, number>;
