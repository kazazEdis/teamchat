// Pure serializers for copying SELECTED chat messages to the clipboard — the "forward this feedback out
// of TeamChat" path. DOM/React-free so they're unit-testable (like mentionText.ts).

export interface ExportMsg {
  senderId: string;
  text: string;
  createdAt: number;
  attachments?: { name: string }[];
  deleted?: boolean;
}

// "YYYY-MM-DD HH:mm" from a message's stored timestamp (a real createdAt — never Date.now()).
export function formatTs(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

// One message → "**Sender** (ts): text" (+ an "[attachment: name]" line each). Deleted → a placeholder.
// Uses the raw text, which already carries "@Name" mention text from send-time serialization.
export function serializeMessage(m: ExportMsg, senderName: string): string {
  const head = `**${senderName}** (${formatTs(m.createdAt)}): `;
  if (m.deleted) return head + "[message deleted]";
  const atts = (m.attachments ?? []).map((a) => `\n[attachment: ${a.name}]`).join("");
  return head + (m.text || "") + atts;
}

// A selection (one message or a picked subset) → blank-line-separated blocks in the given order.
// Sender names resolved from the roster map so forwarded text stays attributable (real names, not "You").
export function serializeSelection(msgs: ExportMsg[], nameById: Record<string, string>): string {
  return msgs.map((m) => serializeMessage(m, nameById[m.senderId] || "User")).join("\n\n");
}
