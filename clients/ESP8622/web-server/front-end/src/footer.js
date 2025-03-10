const footer = document.createElement("footer");
footer.innerHTML = `
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
const name = footer.querySelector("#name");
const desc = footer.querySelector("#desc");
const version = footer.querySelector("#version");
const total = footer.querySelector("#total");
const used = footer.querySelector("#used");
const occupied = footer.querySelector("#occupied");
const err = (message) => {
    desc.innerHTML = message;
    name.innerHTML = message;
    version.innerHTML = message;
    used.innerHTML = message;
    total.innerHTML = message;
    occupied.innerHTML = message;
};
fetch("/api/info")
    .then((res) => res.json())
    .then(async (info) => {
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
export {};
