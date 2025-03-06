import { minutes, previewTime, seconds, selectTime } from "./elements";

export const getStatusText = (s: boolean) => (s ? "ON" : "OFF");
export const getFormattedTime = (value: number) =>
  new Date(value * 1000).toISOString().slice(11, 19);
export const addQueryString = (url: string) => {
  if (!url.startsWith("/api/on")) return url;

  return `${url}?min=${(minutes as HTMLInputElement).value}&sec=${(seconds as HTMLInputElement).value}`;
};
export const showSelect = () => {
  previewTime.style.display = "none";
  selectTime.style.display = "block";
};
export const hideSelect = () => {
  previewTime.style.display = "block";
  selectTime.style.display = "none";
};
