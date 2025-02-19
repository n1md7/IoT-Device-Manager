const [code, name, version, free, total, occupied] = [
  "code",
  "name",
  "version",
  "free",
  "total",
  "occupied",
].map(document.getElementById);

const update = (message) => {
  code.innerHTML = message;
  name.innerHTML = message;
  version.innerHTML = message;
  free.innerHTML = message;
  total.innerHTML = message;
  occupied.innerHTML = message;
};

update("wait...");

fetch("/api/info")
  .then((res) => res.json())
  .then((info) => {
    code.innerText = info.code || "N/A";
    name.innerText = info.name || "N/A";
    version.innerText = info.version || "N/A";
    free.innerText = info.disk?.free || "N/A";
    total.innerText = info.disk?.total || "N/A";
    occupied.innerText = info.disk?.occupied || "N/A";
  })
  .catch((e) => {
    console.error(e);

    update(`<span style="color: red">ERR</span>`);
  });
