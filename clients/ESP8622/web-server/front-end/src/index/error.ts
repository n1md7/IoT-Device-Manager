import { errorText } from "@src/index/elements.ts";

export default (e: any) => {
  if (e instanceof Error) errorText.innerText = e.message;
  errorText.innerText = e.toString();
};
