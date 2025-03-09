type InfoResponse = {
  code: string;
  version: string;
  current: {
    name: string;
    description: string;
    startTime: number;
    managerUrl: string;
  };
  defaults: {
    name: string;
    description: string;
    startTime: number;
    managerUrl: string;
  };
  disk: {
    used: number;
    total: number;
    occupied: string;
  };
  time: {
    now: number;
    str: string;
    iso: string;
  };
};

const footer = document.createElement("footer");

footer.innerHTML = `
  <footer>
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
  </footer>
`;

document.body.appendChild(footer);

const name = footer.querySelector("#name") as HTMLSpanElement;
const desc = footer.querySelector("#desc") as HTMLSpanElement;
const version = footer.querySelector("#version") as HTMLSpanElement;
const total = footer.querySelector("#total") as HTMLSpanElement;
const used = footer.querySelector("#used") as HTMLSpanElement;
const occupied = footer.querySelector("#occupied") as HTMLSpanElement;

const err = (message: string) => {
  desc.innerHTML = message;
  name.innerHTML = message;
  version.innerHTML = message;
  used.innerHTML = message;
  total.innerHTML = message;
  occupied.innerHTML = message;
};

fetch("/api/info")
  .then((res) => res.json())
  .then(async (info: InfoResponse) => {
    name.innerText = info.code || "N/A";
    desc.innerText = info.current?.name || "N/A";
    version.innerText = info.version || "N/A";
    occupied.innerText = info.disk?.occupied || "N/A";

    const textUtils = await import("./text.utils.ts");
    used.innerText = textUtils.format(info.disk?.used?.toString() || "N/A");
    total.innerText = textUtils.format(info.disk?.total?.toString() || "N/A");
  })
  .catch((e) => {
    console.error(e);

    err(`<span style="color: #c90400">ERR</span>`);
  });
