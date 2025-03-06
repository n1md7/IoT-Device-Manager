import { find } from "../dom.utils.ts";

export const [
  on,
  off,
  status,
  time,
  errorText,
  previewTime,
  selectTime,
  minutes,
  seconds,
] = [
  "#on",
  "#off",
  "#status",
  "#time",
  "#error-text",
  "#preview-time",
  "#select-time",
  "#minutes",
  "#seconds",
].map((id) => find(id));
