import { onDeviceStatus, type DeviceInfo } from "./device";
import { format } from "./text.utils";

const footer = document.createElement("footer");

footer.innerHTML = `
  <p class="clock"><span id="clock">--:--:--</span></p>
  <p>Powered by <b>GG-Software</b></p>
  <p class="version">
    <span><b id="name">...</b></span>
    <span><b id="desc">...</b></span>
    <span>v<b id="version">...</b></span>
  </p>
  <p class="disk">
    <span>Total: <b id="total">...</b> B</span>
    <span>Used: <b id="used">...</b> B</span>
    <span><b id="occupied">...</b></span>
  </p>
`;

document.body.appendChild(footer);

const $ = <T extends HTMLElement>(id: string) =>
  footer.querySelector(id) as T;

const name = $<HTMLSpanElement>("#name");
const desc = $<HTMLSpanElement>("#desc");
const version = $<HTMLSpanElement>("#version");
const total = $<HTMLSpanElement>("#total");
const used = $<HTMLSpanElement>("#used");
const occupied = $<HTMLSpanElement>("#occupied");
const clock = $<HTMLSpanElement>("#clock");

const setMeta = (text: string) => {
  desc.innerHTML = text;
  name.innerHTML = text;
  version.innerHTML = text;
  used.innerHTML = text;
  total.innerHTML = text;
  occupied.innerHTML = text;
};

/* --- Live digital clock, anchored to the device's server time --- */
const pad = (n: number) => String(n).padStart(2, "0");
const formatClock = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

let clockTimer: ReturnType<typeof setInterval> | null = null;

const stopClock = () => {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = null;
  clock.textContent = "--:--:--";
};

const startClock = (serverTimeMs: number) => {
  if (clockTimer) clearInterval(clockTimer);

  // Track the gap between the device and the browser once, then advance off
  // the live browser clock so the display ticks (and survives drift).
  const offset = serverTimeMs - Date.now();
  const tick = () => (clock.textContent = formatClock(Date.now() + offset));
  tick();
  clockTimer = setInterval(tick, 1000);
};

const populate = (info: DeviceInfo) => {
  name.innerText = info.code || "N/A";
  desc.innerText = info.current?.name || "N/A";
  version.innerText = info.version || "N/A";
  occupied.innerText = info.disk?.occupied || "N/A";
  used.innerText = format(info.disk?.used?.toString() || "N/A");
  total.innerText = format(info.disk?.total?.toString() || "N/A");
};

onDeviceStatus((state) => {
  if (state.online && state.info) {
    populate(state.info);
    startClock(new Date(state.info.time.iso).getTime());
  } else {
    setMeta(`<span style="color: #c90400">ERR</span>`);
    stopClock();
  }
});
