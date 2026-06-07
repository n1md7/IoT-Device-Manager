/**
 * Connection bar rendered under the header on every page.
 * Lets the user point the UI at any device address and persists it.
 * Imported as a side effect from `nav.ts`, so it appears app-wide.
 */
import {
  DEFAULT_DEVICE_URL,
  getDeviceUrl,
  hasCustomDeviceUrl,
  resetDeviceUrl,
  setDeviceUrl,
} from "./device";

const header = document.querySelector("header");

if (header) {
  const bar = document.createElement("div");
  bar.className = "device-bar";
  bar.innerHTML = `
    <form class="device-bar__form" id="device-form" autocomplete="off">
      <label for="device-url">Device</label>
      <input type="url" id="device-url" name="device-url"
             placeholder="${DEFAULT_DEVICE_URL || "http://192.168.1.20"}" required />
      <button type="submit">Connect</button>
      <button type="button" id="device-reset" class="secondary-button">Reset</button>
    </form>
  `;
  header.insertAdjacentElement("afterend", bar);

  const form = bar.querySelector("#device-form") as HTMLFormElement;
  const input = bar.querySelector("#device-url") as HTMLInputElement;
  const reset = bar.querySelector("#device-reset") as HTMLButtonElement;

  input.value = getDeviceUrl();
  reset.hidden = !hasCustomDeviceUrl();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = input.value.trim();
    if (!url) return;
    setDeviceUrl(url);
    location.reload();
  });

  reset.addEventListener("click", () => {
    resetDeviceUrl();
    location.reload();
  });
}