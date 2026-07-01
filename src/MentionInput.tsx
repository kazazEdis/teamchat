import React, { useRef, useState } from "react";

const PILL_CLASS = "tc-pill";

// A contentEditable message composer: @-mentions render as inline non-editable pills as you type.
// Enter sends; Shift+Enter inserts a newline. Serializes to "@Name" text + the mentioned userIds.
export function MentionInput({ users, placeholder, onSubmit, allowEmpty, onFiles }: {
  users: { userId: string; name: string }[];
  placeholder?: string;
  onSubmit: (text: string, mentionIds: string[]) => void;
  allowEmpty?: boolean;   // permit a send with no text (e.g. attachment-only)
  onFiles?: (files: File[]) => void;   // pasted/dropped files (images from Ctrl+V) → host upload path
}) {
  const edRef = useRef<HTMLDivElement | null>(null);
  const [mq, setMq] = useState<string | null>(null);
  const [empty, setEmpty] = useState(true);

  const caretContext = (): { node: Text; atIdx: number; end: number; query: string } | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const r = sel.getRangeAt(0);
    if (!r.collapsed || r.startContainer.nodeType !== 3 || !edRef.current?.contains(r.startContainer)) return null;
    const node = r.startContainer as Text;
    const before = (node.textContent || "").slice(0, r.startOffset);
    const m = before.match(/(?:^|[\s ])@([^@\s ]{0,30})$/);
    if (!m) return null;
    return { node, atIdx: r.startOffset - 1 - m[1].length, end: r.startOffset, query: m[1] };
  };
  const refresh = () => { setEmpty(!edRef.current?.textContent?.trim()); const c = caretContext(); setMq(c ? c.query.toLowerCase() : null); };
  const suggestions = mq === null ? [] : users.filter((u) => u.name.toLowerCase().includes(mq)).slice(0, 6);

  const pick = (u: { userId: string; name: string }) => {
    const c = caretContext();
    if (!c) { setMq(null); return; }
    const range = document.createRange();
    range.setStart(c.node, c.atIdx); range.setEnd(c.node, c.end); range.deleteContents();
    const pill = document.createElement("span");
    pill.contentEditable = "false"; pill.className = PILL_CLASS;
    pill.dataset.mentionId = u.userId; pill.dataset.mentionName = u.name; pill.textContent = "@" + u.name;
    const space = document.createTextNode(" ");
    range.insertNode(space); range.insertNode(pill);
    const sel = window.getSelection(); const after = document.createRange();
    after.setStartAfter(space); after.collapse(true); sel?.removeAllRanges(); sel?.addRange(after);
    edRef.current?.focus(); setMq(null); setEmpty(false);
  };

  const serialize = (): { text: string; ids: string[] } => {
    const el = edRef.current;
    if (!el) return { text: "", ids: [] };
    const walk = (n: Node): string => {
      if (n.nodeType === 3) return n.textContent || "";
      const e = n as HTMLElement;
      if (e.dataset?.mentionName) return "@" + e.dataset.mentionName;
      if (e.tagName === "BR") return "\n";
      let s = ""; e.childNodes.forEach((c) => { s += walk(c); });
      return e.tagName === "DIV" ? "\n" + s : s;
    };
    let text = ""; el.childNodes.forEach((n) => { text += walk(n); });
    const ids = new Set<string>();
    el.querySelectorAll<HTMLElement>("[data-mention-id]").forEach((s) => { if (s.dataset.mentionId) ids.add(s.dataset.mentionId); });
    for (const u of users) if (u.name && text.includes(`@${u.name}`)) ids.add(u.userId);
    return { text: text.trim(), ids: [...ids] };
  };

  const send = () => {
    const { text, ids } = serialize();
    if (!text && !allowEmpty) return;
    onSubmit(text, ids);
    if (edRef.current) edRef.current.innerHTML = "";
    setEmpty(true); setMq(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length && (e.key === "Enter" || e.key === "Tab")) { e.preventDefault(); pick(suggestions[0]); return; }
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Ctrl/Cmd+V. Two cases: (1) clipboard carries files (e.g. a pasted image/screenshot) → hand them
  // to the host upload path, never into the contentEditable. (2) plain text → insert as TEXT, stripping
  // the rich HTML the browser would otherwise drop in (which breaks the plain-text/mention serializer).
  const onPaste = (e: React.ClipboardEvent) => {
    const dt = e.clipboardData;
    if (!dt) return;
    const files = Array.from(dt.files || []);
    if (files.length && onFiles) { e.preventDefault(); onFiles(files); return; }
    const text = dt.getData("text/plain");
    if (text) {
      e.preventDefault();
      document.execCommand("insertText", false, text); // keeps caret/undo; newlines handled by serialize()
      refresh();
    }
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div
        ref={edRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-ph={empty ? (placeholder ?? "") : ""}
        className="tc-input"
        onInput={refresh}
        onKeyUp={refresh}
        onClick={refresh}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />
      {suggestions.length > 0 && (
        <div className="tc-sug" style={{ bottom: "100%", marginBottom: 4 }}>
          {suggestions.map((u) => (
            <button key={u.userId} type="button" onMouseDown={(e) => { e.preventDefault(); pick(u); }}>@{u.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}
