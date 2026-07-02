// Pure serializers for copying SELECTED chat messages to the clipboard — the "forward this feedback out
// of TeamChat" path. DOM/React-free so they're unit-testable (like mentionText.ts).

export interface ExportMsg {
  senderId: string;
  text: string;
  createdAt: number;
  attachments?: { storageId: string; name: string }[];
  deleted?: boolean;
}

// "YYYY-MM-DD HH:mm" from a message's stored timestamp (a real createdAt — never Date.now()).
export function formatTs(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// One message → "**Sender** (ts): text" (+ one attachment line each). Deleted → a placeholder.
// Attachments become a markdown LINK "[attachment: name](url)" when a resolved download URL is supplied
// (via `urls[storageId]`) — so an image/file can be fetched + parsed by whatever it's pasted into. Falls
// back to a bare "[attachment: name]" when the URL couldn't be resolved. Raw text carries "@Name" mentions.
export function serializeMessage(m: ExportMsg, senderName: string, urls?: Record<string, string>): string {
  const head = `**${senderName}** (${formatTs(m.createdAt)}): `;
  if (m.deleted) return head + "[message deleted]";
  const atts = (m.attachments ?? []).map((a) => {
    const u = urls?.[a.storageId];
    return u ? `\n[attachment: ${a.name}](${u})` : `\n[attachment: ${a.name}]`;
  }).join("");
  return head + (m.text || "") + atts;
}

// A selection (one message or a picked subset) → blank-line-separated blocks in the given order.
// Sender names resolved from the roster map so forwarded text stays attributable (real names, not "You").
export function serializeSelection(msgs: ExportMsg[], nameById: Record<string, string>, urls?: Record<string, string>): string {
  return msgs.map((m) => serializeMessage(m, nameById[m.senderId] || "User", urls)).join("\n\n");
}
