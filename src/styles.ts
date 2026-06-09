// Self-contained stylesheet (injected once). Uses the HOST app's theme CSS variables (--primary,
// --background, --border, …) so the chat UI matches the app + dark mode without any Tailwind dep.
export const TEAMCHAT_CSS = `
.tc-fab{position:relative;display:inline-grid;place-items:center;width:30px;height:30px;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--muted-foreground);cursor:pointer;transition:color .12s}
.tc-fab:hover{color:var(--foreground)}
.tc-badge{position:absolute;top:-5px;right:-5px;min-width:16px;height:16px;padding:0 4px;border-radius:9999px;background:var(--destructive,#dc2626);color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1}
.tc-overlay{position:fixed;inset:0;z-index:200;display:flex;justify-content:flex-end}
.tc-overlay-bg{position:absolute;inset:0;background:rgba(0,0,0,.30)}
.tc-panel{position:relative;height:100%;width:min(720px,96vw);display:flex;background:var(--card,var(--background));color:var(--foreground);border-left:1px solid var(--border);box-shadow:0 0 40px rgba(0,0,0,.25)}
.tc-sidebar{width:240px;min-width:240px;border-right:1px solid var(--border);display:flex;flex-direction:column}
.tc-tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid var(--border)}
.tc-tab{flex:1;padding:5px 6px;border:none;border-radius:6px;background:transparent;color:var(--muted-foreground);font-size:12px;font-weight:500;cursor:pointer}
.tc-tab.active{background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary)}
.tc-list{flex:1;overflow:auto}
.tc-row{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;border-bottom:1px solid var(--border)}
.tc-row:hover{background:color-mix(in srgb,var(--foreground) 5%,transparent)}
.tc-row.active{background:color-mix(in srgb,var(--primary) 8%,transparent)}
.tc-row .tc-meta{min-width:0;flex:1}
.tc-row .tc-title{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tc-row.unread .tc-title{font-weight:700}
.tc-row .tc-prev{font-size:11px;color:var(--muted-foreground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tc-dot{width:8px;height:8px;border-radius:9999px;flex:0 0 auto}
.tc-unreaddot{width:8px;height:8px;border-radius:9999px;background:var(--primary);flex:0 0 auto}
.tc-av{position:relative;display:inline-grid;place-items:center;border-radius:9999px;color:#fff;font-weight:600;user-select:none;flex:0 0 auto}
.tc-av-status{position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:9999px;border:2px solid var(--card,var(--background))}
.tc-thread{flex:1;display:flex;flex-direction:column;min-width:0}
.tc-thead{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--border)}
.tc-thead .tc-h{font-weight:600;font-size:14px}
.tc-msgs{flex:1;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.tc-bubble{display:flex;gap:8px;align-items:flex-start}
.tc-bubble .tc-b{min-width:0;flex:1}
.tc-bubble .tc-bh{font-size:11px;color:var(--muted-foreground);margin-bottom:2px}
.tc-bubble .tc-bn{font-weight:600;color:var(--foreground)}
.tc-bubble .tc-bt{font-size:14px;white-space:pre-wrap;word-break:break-word;line-height:1.4}
.tc-bubble .tc-deleted{font-style:italic;color:var(--muted-foreground)}
.tc-pill{display:inline-block;border-radius:4px;background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);font-weight:500;padding:0 4px;line-height:1.3}
.tc-composer{border-top:1px solid var(--border);padding:8px;display:flex;gap:6px;align-items:flex-end}
.tc-input{flex:1;min-height:36px;max-height:140px;overflow:auto;border:1px solid var(--input,var(--border));border-radius:8px;padding:8px 10px;font-size:14px;outline:none;background:transparent;color:var(--foreground);white-space:pre-wrap;word-break:break-word}
.tc-input:empty:before{content:attr(data-ph);color:var(--muted-foreground)}
.tc-send{height:36px;padding:0 12px;border:none;border-radius:8px;background:var(--primary);color:#fff;font-weight:600;cursor:pointer;font-size:13px}
.tc-send:disabled{opacity:.5;cursor:default}
.tc-iconbtn{display:inline-grid;place-items:center;width:36px;height:36px;border:1px solid var(--border);border-radius:8px;background:transparent;color:var(--muted-foreground);cursor:pointer}
.tc-sug{position:absolute;left:0;right:0;z-index:40;max-height:180px;overflow:auto;border:1px solid var(--border);border-radius:8px;background:var(--popover,var(--card,var(--background)));box-shadow:0 6px 20px rgba(0,0,0,.18)}
.tc-sug button{display:block;width:100%;text-align:left;padding:6px 10px;font-size:13px;background:transparent;border:none;cursor:pointer;color:var(--foreground)}
.tc-sug button:hover{background:color-mix(in srgb,var(--foreground) 6%,transparent)}
.tc-empty{padding:24px;text-align:center;color:var(--muted-foreground);font-size:13px}
.tc-x{background:transparent;border:none;color:var(--muted-foreground);cursor:pointer;padding:2px}
.tc-newbtn{margin:8px;padding:6px;border:1px dashed var(--border);border-radius:8px;background:transparent;color:var(--primary);cursor:pointer;font-size:12px;font-weight:600}
.tc-support-entry{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:8px 10px;border:none;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--primary) 7%,transparent);color:var(--foreground);cursor:pointer}
.tc-support-entry:hover{background:color-mix(in srgb,var(--primary) 12%,transparent)}
.tc-support-entry.active{background:color-mix(in srgb,var(--primary) 16%,transparent)}
.tc-support-entry .tc-meta{min-width:0;flex:1}
.tc-support-entry .tc-title{font-size:13px;font-weight:700}
.tc-support-entry .tc-prev{font-size:11px;color:var(--muted-foreground)}
.tc-support-ic{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:9999px;background:var(--primary);color:#fff;flex:0 0 auto}
@media(max-width:680px){.tc-panel{width:100vw}.tc-sidebar{width:200px;min-width:200px}}
`;

let injected = false;
export function injectStyles(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const el = document.createElement("style");
  el.setAttribute("data-teamchat", "");
  el.textContent = TEAMCHAT_CSS;
  document.head.appendChild(el);
}
