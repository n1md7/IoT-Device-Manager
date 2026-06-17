import { useEffect } from "preact/hooks";
import { device } from "@src/store/device";

/** Device identity — name (also the document title) and description. */
export function Header() {
  const info = device.value;
  const name = info?.name || "ESP Device";

  useEffect(() => {
    document.title = name;
  }, [name]);

  return (
    <header>
      <h1>{name}</h1>
      <p class="subtitle">{info?.description || ""}</p>
    </header>
  );
}
