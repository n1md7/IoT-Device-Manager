import { minutes, previewTime, seconds, selectTime } from "./elements";
export const getStatusText = (s) => (s ? "ON" : "OFF");
export const getFormattedTime = (value) => new Date(value * 1000).toISOString().slice(11, 19);
export const addQueryString = (url) => {
    if (!url.startsWith("/api/on"))
        return url;
    return `${url}?min=${minutes.value}&sec=${seconds.value}`;
};
export const showSelect = () => {
    previewTime.classList.add("hidden");
    selectTime.classList.remove("hidden");
};
export const hideSelect = () => {
    previewTime.classList.remove("hidden");
    selectTime.classList.add("hidden");
};
