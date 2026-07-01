// Pure text helpers for the @-mention composer — DOM-node/string in, string/ids out, NO React state.
// Kept separate from MentionInput so the parsing + serialization (the parts a paste/typing regression
// would silently break) are unit-testable without simulating contentEditable editing.

// The active @-mention query at a caret: the text immediately BEFORE the caret, or null when the caret
// isn't in a mention. A "@" only starts a mention at the start or after whitespace — so "email@x" is not
// a mention, but "hi @jo" is (query "jo"). Query caps at 30 chars (matches the pill/suggestion limit).
export function mentionQuery(before: string): string | null {
  const m = before.match(/(?:^|[\s ])@([^@\s ]{0,30})$/);
  return m ? m[1] : null;
}

// Serialize the composer's contentEditable tree to sendable text + the mentioned userIds. Mention pills
// (span[data-mention-name]) become "@Name"; <br> and block <div> boundaries become newlines. IDs come
// from the pills' data-mention-id, plus any bare "@Name" text that matches a known user (typed, un-pilled).
export function serializeRoot(
  root: HTMLElement,
  users: { userId: string; name: string }[],
): { text: string; ids: string[] } {
  const walk = (n: Node): string => {
    if (n.nodeType === 3) return n.textContent || "";
    const e = n as HTMLElement;
    if (e.dataset?.mentionName) return "@" + e.dataset.mentionName;
    if (e.tagName === "BR") return "\n";
    let s = "";
    e.childNodes.forEach((c) => { s += walk(c); });
    return e.tagName === "DIV" ? "\n" + s : s;
  };
  let text = "";
  root.childNodes.forEach((n) => { text += walk(n); });
  const ids = new Set<string>();
  root.querySelectorAll<HTMLElement>("[data-mention-id]").forEach((s) => {
    if (s.dataset.mentionId) ids.add(s.dataset.mentionId);
  });
  for (const u of users) if (u.name && text.includes(`@${u.name}`)) ids.add(u.userId);
  return { text: text.trim(), ids: [...ids] };
}
