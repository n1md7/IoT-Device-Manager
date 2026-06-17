import type { SaveStatus } from "@src/hooks/useSaveStatus";

/** Title-area badge for unsaved/saved edits — same pill style as ON/OFF. */
export function SaveStatusBadge({ status }: { status: SaveStatus }) {
  // "Saving…" lives on the button; idle shows nothing.
  if (status === "unsaved")
    return <span class="badge badge-unsaved">Unsaved</span>;
  if (status === "saved") return <span class="badge badge-saved">Saved</span>;
  return null;
}
