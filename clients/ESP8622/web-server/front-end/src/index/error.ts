import { errorText } from "@src/index/elements.ts";

export default (e: any) => {
  if ('message' in e) return errorText.innerText = e.message;

  errorText.innerText = JSON.stringify(e);
};
