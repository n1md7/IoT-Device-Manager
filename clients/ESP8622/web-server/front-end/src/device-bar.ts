/**
 * Connection bar rendered under the header on every page.
 * Lets the user point the UI at any device address, validates it against the
 * config endpoint, and broadcasts the result so each page can react.
 * Imported as a side effect from `nav.ts`, so it appears app-wide.
 */
import {
  DEFAULT_DEVICE_URL,
  getDeviceUrl,
  hasCustomDeviceUrl,
  onDeviceStatus,
  pingDevice,
  refreshConnection,
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
      <button type="submit" id="device-connect">Connect</button>
      <button type="button" id="device-reset" class="secondary-button">Reset</button>
      <span class="device-bar__status" id="device-status" role="status"></span>
    </form>
  `;
  header.insertAdjacentElement("afterend", bar);

  const form = bar.querySelector("#device-form") as HTMLFormElement;
  const input = bar.querySelector("#device-url") as HTMLInputElement;
  const connect = bar.querySelector("#device-connect") as HTMLButtonElement;
  const reset = bar.querySelector("#device-reset") as HTMLButtonElement;
  const statusEl = bar.querySelector("#device-status") as HTMLSpanElement;

  input.value = getDeviceUrl();
  reset.hidden = !hasCustomDeviceUrl();

  const setStatus = (text: string, kind: "ok" | "error" | "info"): void => {
    statusEl.textContent = text;
    statusEl.className = `device-bar__status device-bar__status--${kind}`;
  };

  // Reflect the global connection state (load-time check, resets, etc.).
  onDeviceStatus((status) => {
    if (status.online) {
      setStatus(`Connected to ${status.info?.current?.name ?? "device"}`, "ok");
    } else {
      setStatus(status.error ?? "Device unreachable", "error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const url = input.value.trim();
    if (!url) return;

    connect.disabled = true;
    setStatus("Checking…", "info");

    try {
      // Validate the entered address before persisting it.
      await pingDevice(url);
      setDeviceUrl(url);
      reset.hidden = false;
      await refreshConnection(); // broadcasts "connected" to every page
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Device unreachable",
        "error",
      );
    } finally {
      connect.disabled = false;
    }
  });

  reset.addEventListener("click", async () => {
    resetDeviceUrl();
    input.value = getDeviceUrl();
    reset.hidden = true;
    setStatus("Checking…", "info");
    await refreshConnection();
  });

  // Initial connectivity check against the configured (default) device.
  setStatus("Checking…", "info");
  void refreshConnection();
}
