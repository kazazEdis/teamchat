// Self-contained stylesheet (injected once). Uses the HOST app's theme CSS variables (--primary,
// --background, --border, …) so the chat UI matches the app + dark mode without any Tailwind dep.
export const TEAMCHAT_CSS = `
.tc-fab{position:fixed;bottom:24px;right:24px;z-index:190;display:inline-grid;place-items:center;width:56px;height:56px;border:none;border-radius:9999px;background:var(--primary);color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:transform .12s,box-shadow .12s;animation:tcFabIn .25s ease}
.tc-fab:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,0,0,.32)}
.tc-fab:active{transform:scale(.92)}
.tc-fab svg{width:24px;height:24px;transition:transform .2s ease}
.tc-fab:hover svg{transform:rotate(-8deg)}
.tc-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:9999px;background:var(--destructive,#dc2626);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;border:2px solid var(--card,var(--background))}
@media(max-width:680px){.tc-fab{bottom:16px;right:16px;width:52px;height:52px}}
.tc-overlay{position:fixed;inset:0;z-index:200}
.tc-overlay-bg{position:absolute;inset:0;background:transparent}
.tc-panel{position:fixed;right:24px;bottom:92px;width:384px;max-width:calc(100vw - 32px);height:min(640px,calc(100vh - 116px));display:flex;flex-direction:column;overflow:hidden;background:var(--card,var(--background));color:var(--foreground);border:1px solid var(--border);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);transform-origin:bottom right;animation:tcPop .22s cubic-bezier(.16,1,.3,1)}
.tc-home{flex:1;min-height:0;display:flex;flex-direction:column}
.tc-tabs{display:flex;gap:4px;padding:8px;border-bottom:1px solid var(--border)}
.tc-tab{flex:1;padding:5px 6px;border:none;border-radius:6px;background:transparent;color:var(--muted-foreground);font-size:12px;font-weight:500;cursor:pointer}
.tc-tab.active{background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary)}
.tc-list{flex:1;overflow:auto}
.tc-row{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .12s ease}
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
.tc-thread{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}
.tc-thead{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--border)}
.tc-thead .tc-h{font-weight:600;font-size:14px}
.tc-thead-sub{font-size:11px;color:var(--muted-foreground);line-height:1.1}
.tc-msgs{flex:1;overflow:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.tc-bubble{display:flex;gap:8px;align-items:flex-start;animation:tcRise .24s ease both}
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
.tc-newbtn-primary{border:none;background:var(--primary);color:#fff}
.tc-support-entry{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:8px 10px;border:none;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--primary) 7%,transparent);color:var(--foreground);cursor:pointer}
.tc-support-entry:hover{background:color-mix(in srgb,var(--primary) 12%,transparent)}
.tc-support-entry.active{background:color-mix(in srgb,var(--primary) 16%,transparent)}
.tc-support-entry .tc-meta{min-width:0;flex:1}
.tc-support-entry .tc-title{font-size:13px;font-weight:700}
.tc-support-entry .tc-prev{font-size:11px;color:var(--muted-foreground)}
.tc-support-ic{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:9999px;background:var(--primary);color:#fff;flex:0 0 auto}
.tc-x{transition:color .12s ease,background .12s ease,transform .12s ease}
.tc-x:hover{color:var(--foreground)}
.tc-x:active{transform:scale(.88)}
.tc-danger:hover{color:var(--destructive,#dc2626)}
.tc-tab{transition:background .12s ease,color .12s ease}
.tc-send,.tc-newbtn,.tc-support-entry{transition:opacity .12s ease,transform .12s ease,background .12s ease}
.tc-send:active,.tc-newbtn:active{transform:scale(.97)}
.tc-pill{transition:border-color .12s ease,background .12s ease}
/* message hover-actions + selection (copy to clipboard) */
.tc-bubble{position:relative}
.tc-selbox{align-self:center;flex:0 0 auto;width:15px;height:15px;accent-color:var(--primary);cursor:pointer;margin:0;opacity:0;transition:opacity .12s ease}
.tc-bubble:hover .tc-selbox,.tc-msgs.tc-selecting .tc-selbox,.tc-selbox:checked{opacity:1}
.tc-acts{position:absolute;top:-11px;right:6px;display:inline-flex;gap:1px;padding:2px;background:var(--popover,var(--card,var(--background)));border:1px solid var(--border);border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.14);opacity:0;transform:translateY(3px);transition:opacity .12s ease,transform .12s ease;pointer-events:none;z-index:6}
.tc-bubble:hover .tc-acts,.tc-acts:focus-within{opacity:1;transform:translateY(0);pointer-events:auto}
.tc-actbtn{display:inline-grid;place-items:center;width:28px;height:28px;border:none;border-radius:6px;background:transparent;color:var(--muted-foreground);cursor:pointer;transition:background .12s ease,color .12s ease,transform .12s ease}
.tc-actbtn:hover{background:color-mix(in srgb,var(--foreground) 8%,transparent);color:var(--foreground)}
.tc-actbtn:active{transform:scale(.86)}
.tc-actbtn.ok{color:var(--primary)}
.tc-actbtn.danger:hover{color:var(--destructive,#dc2626)}
.tc-selbar{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--primary) 7%,transparent);font-size:13px;animation:tcRise .18s ease both}
.tc-selcount{color:var(--muted-foreground)}
.tc-selcopy{margin-left:auto;height:30px;padding:0 14px;border:none;border-radius:7px;background:var(--primary);color:#fff;font-weight:600;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .12s ease,transform .12s ease}
.tc-selcopy:active{transform:scale(.96)}
.tc-selclear{background:transparent;border:none;color:var(--muted-foreground);font-size:12px;cursor:pointer;padding:4px 6px;border-radius:6px;transition:color .12s ease}
.tc-selclear:hover{color:var(--foreground)}
@keyframes tcPop{from{opacity:0;transform:translateY(12px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes tcRise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes tcFabIn{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@media(max-width:680px){.tc-panel{right:0;bottom:0;width:100vw;max-width:100vw;height:100dvh;border-radius:0;border:none}}
@media(prefers-reduced-motion:reduce){.tc-panel,.tc-bubble,.tc-fab{animation:none}.tc-fab:hover svg{transform:none}}
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
