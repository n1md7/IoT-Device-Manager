export const find = <Type = HTMLElement>(selector: string) =>
  document.querySelector(selector) as Type;
