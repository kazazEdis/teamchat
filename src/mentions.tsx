import React from "react";

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Render message text with @-mentions shown as pills. `names` = known display names (from the roster).
export function renderMentions(text: string, names: string[]): React.ReactNode {
  const known = [...new Set(names.filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!known.length || !text) return text;
  const re = new RegExp(`@(${known.map(escapeRe).join("|")})`, "g");
  const out: React.ReactNode[] = [];
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(<React.Fragment key={k++}>{text.slice(last, m.index)}</React.Fragment>);
    out.push(<span key={k++} className="tc-pill">@{m[1]}</span>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<React.Fragment key={k++}>{text.slice(last)}</React.Fragment>);
  return out;
}
