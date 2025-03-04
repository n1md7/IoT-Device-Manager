const [desc, name, version, used, total, occupied] = [
  "desc",
  "name",
  "version",
  "used",
  "total",
  "occupied",
].map((id) => document.getElementById(id)!);

const u = (message: string) => {
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
  .then(async (info) => {
    name.innerText = info.code || "N/A";
    desc.innerText = info.current?.name || "N/A";
    version.innerText = info.version || "N/A";
    occupied.innerText = info.disk?.occupied || "N/A";

    const textUtils = await import("./text.utils");
    used.innerText = textUtils.format(info.disk?.used || "N/A");
    total.innerText = textUtils.format(info.disk?.total || "N/A");
  })
  .catch((e) => {
    console.error(e);

    u(`<span style="color: red">ERR</span>`);
  });
