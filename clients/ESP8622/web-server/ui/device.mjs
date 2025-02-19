const [desc, name, version, used, total, occupied] = [
  "desc",
  "name",
  "version",
  "used",
  "total",
  "occupied",
].map((id) => document.getElementById(id));

const f = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const u = (message) => {
  desc.innerHTML = message;
  name.innerHTML = message;
  version.innerHTML = message;
  used.innerHTML = message;
  total.innerHTML = message;
  occupied.innerHTML = message;
};

u("wait...");

fetch("/api/info")
  .then((res) => res.json())
  .then((info) => {
    desc.innerText = info.description || "N/A";
    name.innerText = info.name || "N/A";
    version.innerText = info.version || "N/A";
    used.innerText = f(info.disk?.used || "N/A");
    total.innerText = f(info.disk?.total || "N/A");
    occupied.innerText = info.disk?.occupied || "N/A";
  })
  .catch((e) => {
    console.error(e);

    u(`<span style="color: red">ERR</span>`);
  });
