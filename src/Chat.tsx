import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useChatCtx } from "./context";
import { Avatar } from "./Avatar";
import { MentionInput } from "./MentionInput";
import { renderMentions } from "./mentions";
import type { ConversationRow, MessageRow, RosterUser } from "./types";

const IconChat = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const IconX = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);
const IconClip = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>);
const EMOJIS = ["👍", "❤️", "😂", "🎉", "🙏", "👀"];

const fmtTime = (ms: number) => {
  const d = new Date(ms); const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}. ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// Header launcher button + unread badge.
export function ChatLauncher() {
  const { api, setOpen } = useChatCtx();
  const unread = useQuery(api.unreadCount as any, {}) as number | undefined;
  return (
    <button className="tc-fab" title="Chat" aria-label="Chat" onClick={() => setOpen(true)}>
      <IconChat />
      {!!unread && unread > 0 && <span className="tc-badge">{unread > 9 ? "9+" : unread}</span>}
    </button>
  );
}

// The slide-in panel: sidebar (conversations + people) on the left, active thread on the right.
export function ChatPanel() {
  const { open, setOpen, active } = useChatCtx();
  if (!open) return null;
  return (
    <div className="tc-overlay">
      <div className="tc-overlay-bg" onClick={() => setOpen(false)} />
      <div className="tc-panel" onClick={(e) => e.stopPropagation()}>
        <ChatSidebar />
        {active ? <ChatThread conversationId={active} /> : (
          <div className="tc-thread">
            <div className="tc-thead"><span className="tc-h">Chat</span><button className="tc-x" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}><IconX /></button></div>
            <div className="tc-empty">Select a conversation or a colleague to start.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSidebar() {
  const [tab, setTab] = useState<"chats" | "channels" | "people">("chats");
  return (
    <div className="tc-sidebar">
      <div className="tc-tabs">
        <button className={`tc-tab${tab === "chats" ? " active" : ""}`} onClick={() => setTab("chats")}>Chats</button>
        <button className={`tc-tab${tab === "channels" ? " active" : ""}`} onClick={() => setTab("channels")}>Channels</button>
        <button className={`tc-tab${tab === "people" ? " active" : ""}`} onClick={() => setTab("people")}>People</button>
      </div>
      <NewConversationMenu />
      {tab === "chats" ? <ConversationList /> : tab === "channels" ? <ChannelList /> : <PeopleRoster />}
    </div>
  );
}

// Create a new group or channel (compact inline forms).
function NewConversationMenu() {
  const { api, me, openConversation } = useChatCtx();
  const [mode, setMode] = useState<null | "group" | "channel">(null);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const roster = useQuery(api.roster as any, mode === "group" ? {} : "skip") as RosterUser[] | undefined;
  const createGroup = useMutation((api.createGroup ?? api.getOrCreateDm) as any);
  const createChannel = useMutation((api.createChannel ?? api.getOrCreateDm) as any);
  const reset = () => { setMode(null); setTitle(""); setPicked([]); };
  if (!api.createGroup && !api.createChannel) return null;
  if (!mode) {
    return (
      <div style={{ display: "flex", gap: 6, margin: "8px 8px 0" }}>
        {api.createGroup && <button className="tc-newbtn" style={{ margin: 0, flex: 1 }} onClick={() => setMode("group")}>+ Group</button>}
        {api.createChannel && <button className="tc-newbtn" style={{ margin: 0, flex: 1 }} onClick={() => setMode("channel")}>+ Channel</button>}
      </div>
    );
  }
  const submit = async () => {
    const name = title.trim();
    if (!name) return;
    if (mode === "group") { if (!picked.length) return; const id = await createGroup({ title: name, memberUserIds: picked }); reset(); openConversation(id as string); }
    else { const id = await createChannel({ title: name }); reset(); openConversation(id as string); }
  };
  return (
    <div style={{ margin: 8, padding: 8, border: "1px solid var(--border)", borderRadius: 8 }}>
      <input className="tc-input" style={{ minHeight: 0, padding: "6px 8px", marginBottom: 6 }} placeholder={mode === "group" ? "Group name" : "Channel name"} value={title} onChange={(e) => setTitle(e.target.value)} />
      {mode === "group" && (
        <div style={{ maxHeight: 140, overflow: "auto", marginBottom: 6 }}>
          {(roster ?? []).filter((u) => u.userId !== me.userId).map((u) => (
            <label key={u.userId} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, padding: "2px 0", cursor: "pointer" }}>
              <input type="checkbox" checked={picked.includes(u.userId)} onChange={() => setPicked((p) => p.includes(u.userId) ? p.filter((x) => x !== u.userId) : [...p, u.userId])} />
              {u.name}
            </label>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <button className="tc-send" style={{ flex: 1, height: 30 }} onClick={submit}>Create</button>
        <button className="tc-iconbtn" style={{ width: "auto", padding: "0 10px", height: 30 }} onClick={reset}>Cancel</button>
      </div>
    </div>
  );
}

function ChannelList() {
  const { api, openConversation } = useChatCtx();
  const channels = useQuery((api.listChannels ?? api.listMine) as any, {}) as { _id: string; title: string; description: string; joined: boolean }[] | undefined;
  const join = useMutation((api.joinChannel ?? api.getOrCreateDm) as any);
  if (!api.listChannels) return <div className="tc-empty">Channels are not enabled.</div>;
  if (channels === undefined) return <div className="tc-empty">…</div>;
  if (channels.length === 0) return <div className="tc-empty">No channels yet. Create one above.</div>;
  return (
    <div className="tc-list">
      {channels.map((c) => (
        <div key={c._id} className="tc-row" onClick={async () => { if (!c.joined) await join({ conversationId: c._id }); openConversation(c._id); }}>
          <span style={{ fontWeight: 700, color: "var(--muted-foreground)", width: 30, textAlign: "center" }}>#</span>
          <div className="tc-meta"><div className="tc-title">{c.title}</div><div className="tc-prev">{c.joined ? "Joined" : (c.description || "Tap to join")}</div></div>
        </div>
      ))}
    </div>
  );
}

function ConversationList() {
  const { api, active, setActive } = useChatCtx();
  const rows = useQuery(api.listMine as any, {}) as ConversationRow[] | undefined;
  if (rows === undefined) return <div className="tc-empty">…</div>;
  if (rows.length === 0) return <div className="tc-empty">No conversations yet. Open People to start a chat.</div>;
  return (
    <div className="tc-list">
      {rows.map((c) => (
        <div key={c._id} className={`tc-row${c.unread ? " unread" : ""}${active === c._id ? " active" : ""}`} onClick={() => setActive(c._id)}>
          <Avatar name={c.title || "?"} size={30} />
          <div className="tc-meta">
            <div className="tc-title">{c.title || "Conversation"}</div>
            <div className="tc-prev">{c.lastPreview}</div>
          </div>
          {c.unread && <span className="tc-unreaddot" />}
        </div>
      ))}
    </div>
  );
}

function PeopleRoster() {
  const { api, me, openConversation } = useChatCtx();
  const roster = useQuery(api.roster as any, {}) as RosterUser[] | undefined;
  const getOrCreateDm = useMutation(api.getOrCreateDm as any);
  if (roster === undefined) return <div className="tc-empty">…</div>;
  const others = roster.filter((u) => u.userId !== me.userId);
  return (
    <div className="tc-list">
      {others.map((u) => (
        <div key={u.userId} className="tc-row" onClick={async () => { const id = await getOrCreateDm({ otherUserId: u.userId }); openConversation(id as string); }}>
          <Avatar name={u.name} size={30} online={u.online} />
          <div className="tc-meta"><div className="tc-title">{u.name}</div><div className="tc-prev">{u.online ? "Online" : "Offline"}</div></div>
        </div>
      ))}
      {others.length === 0 && <div className="tc-empty">No colleagues yet.</div>}
    </div>
  );
}

function ChatThread({ conversationId }: { conversationId: string }) {
  const { api, me, setOpen } = useChatCtx();
  const msgs = useQuery(api.messages as any, { conversationId }) as MessageRow[] | undefined;
  const roster = useQuery(api.roster as any, {}) as RosterUser[] | undefined;
  const convos = useQuery(api.listMine as any, {}) as ConversationRow[] | undefined;
  const markRead = useMutation(api.markRead as any);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const nameById = useMemo(() => Object.fromEntries((roster ?? []).map((r) => [r.userId, r.name])), [roster]);
  const names = useMemo(() => (roster ?? []).map((r) => r.name), [roster]);
  const users = useMemo(() => (roster ?? []).map((r) => ({ userId: r.userId, name: r.name })), [roster]);

  // Mark read when opening + when new messages arrive while open.
  useEffect(() => { markRead({ conversationId }).catch(() => {}); }, [conversationId, msgs?.length]); // eslint-disable-line
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs?.length]);

  const title = useMemo(() => convos?.find((c) => c._id === conversationId)?.title || "Conversation", [convos, conversationId]);

  return (
    <div className="tc-thread">
      <div className="tc-thead"><span className="tc-h">{title}</span><button className="tc-x" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}><IconX /></button></div>
      <div className="tc-msgs" ref={scrollRef}>
        {msgs === undefined ? <div className="tc-empty">…</div>
          : msgs.length === 0 ? <div className="tc-empty">No messages yet — say hi 👋</div>
          : msgs.map((m) => <MessageBubble key={m._id} conversationId={conversationId} m={m} mine={m.senderId === me.userId} senderName={nameById[m.senderId] || "User"} names={names} />)}
      </div>
      <Composer conversationId={conversationId} users={users} />
    </div>
  );
}

function Composer({ conversationId, users }: { conversationId: string; users: { userId: string; name: string }[] }) {
  const { api } = useChatCtx();
  const sendMessage = useMutation(api.sendMessage as any);
  const uploadUrl = useMutation((api.uploadUrl ?? api.sendMessage) as any);
  const [pending, setPending] = useState<{ storageId: string; name: string; contentType?: string; size?: number }[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const onFiles = async (files: FileList | null) => {
    if (!files || !api.uploadUrl) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const url = await uploadUrl({});
        const res = await fetch(url as string, { method: "POST", headers: { "Content-Type": f.type || "application/octet-stream" }, body: f });
        const { storageId } = await res.json();
        setPending((p) => [...p, { storageId, name: f.name, contentType: f.type, size: f.size }]);
      }
    } catch { /* ignore */ } finally { setBusy(false); }
  };
  const submit = (text: string, mentions: string[]) => {
    const atts = pending;
    sendMessage({ conversationId, text, mentions, attachments: atts.length ? atts : undefined }).catch(() => {});
    setPending([]);
  };
  return (
    <div>
      {pending.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "6px 8px 0" }}>
          {pending.map((a, i) => <span key={i} className="tc-pill">📎 {a.name} <span className="tc-x" style={{ padding: 0 }} onClick={() => setPending((p) => p.filter((_, j) => j !== i))}>×</span></span>)}
        </div>
      )}
      <div className="tc-composer">
        {api.uploadUrl && (
          <>
            <button className="tc-iconbtn" disabled={busy} title="Attach" onClick={() => fileRef.current?.click()}><IconClip /></button>
            <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
          </>
        )}
        <MentionInput users={users} placeholder="Message…" allowEmpty={pending.length > 0} onSubmit={submit} />
      </div>
    </div>
  );
}

function AttachmentChip({ conversationId, a }: { conversationId: string; a: { storageId: string; name: string } }) {
  const { api } = useChatCtx();
  const url = useQuery((api.attachmentUrl ?? api.roster) as any, api.attachmentUrl ? { conversationId, storageId: a.storageId } : "skip") as string | null | undefined;
  return (
    <a href={url || undefined} target="_blank" rel="noreferrer" className="tc-pill" style={{ textDecoration: "none" }} onClick={(e) => { if (!url) e.preventDefault(); }}>📎 {a.name}</a>
  );
}

function MessageBubble({ conversationId, m, mine, senderName, names }: { conversationId: string; m: MessageRow; mine: boolean; senderName: string; names: string[] }) {
  const { api, me } = useChatCtx();
  const toggleReaction = useMutation((api.toggleReaction ?? api.sendMessage) as any);
  const editMessage = useMutation((api.editMessage ?? api.sendMessage) as any);
  const deleteMessage = useMutation((api.deleteMessage ?? api.sendMessage) as any);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(m.text);
  const [picker, setPicker] = useState(false);

  const react = (emoji: string) => { if (api.toggleReaction) toggleReaction({ messageId: m._id, emoji }).catch(() => {}); setPicker(false); };
  const saveEdit = () => { if (api.editMessage && draft.trim()) editMessage({ messageId: m._id, text: draft.trim() }).catch(() => {}); setEditing(false); };

  return (
    <div className="tc-bubble">
      <Avatar name={senderName} size={28} />
      <div className="tc-b">
        <div className="tc-bh">
          <span className="tc-bn">{mine ? "You" : senderName}</span> · {fmtTime(m.createdAt)}{m.editedAt ? " · (edited)" : ""}
          {!m.deleted && (
            <span style={{ float: "right", display: "inline-flex", gap: 6 }}>
              {api.toggleReaction && <button className="tc-x" title="React" onClick={() => setPicker((p) => !p)}>＋</button>}
              {mine && api.editMessage && <button className="tc-x" title="Edit" onClick={() => { setDraft(m.text); setEditing(true); }}>✎</button>}
              {mine && api.deleteMessage && <button className="tc-x" title="Delete" onClick={() => deleteMessage({ messageId: m._id }).catch(() => {})}>🗑</button>}
            </span>
          )}
        </div>
        {picker && (
          <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>{EMOJIS.map((e) => <button key={e} className="tc-x" style={{ fontSize: 16 }} onClick={() => react(e)}>{e}</button>)}</div>
        )}
        {m.deleted ? <div className="tc-bt tc-deleted">message deleted</div>
          : editing ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input className="tc-input" style={{ minHeight: 0, padding: "4px 8px" }} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(false); }} autoFocus />
              <button className="tc-send" style={{ height: 30 }} onClick={saveEdit}>Save</button>
            </div>
          ) : (
            <>
              {m.text && <div className="tc-bt">{renderMentions(m.text, names)}</div>}
              {m.attachments.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>{m.attachments.map((a, i) => <AttachmentChip key={i} conversationId={conversationId} a={a} />)}</div>}
              {m.reactions.length > 0 && (
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  {m.reactions.map((r) => (
                    <button key={r.emoji} className="tc-pill" style={{ cursor: "pointer", borderColor: r.userIds.includes(me.userId) ? "var(--primary)" : "transparent" }} onClick={() => react(r.emoji)}>{r.emoji} {r.userIds.length}</button>
                  ))}
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
