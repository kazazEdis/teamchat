import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useChatCtx } from "./context";
import { Avatar } from "./Avatar";
import { MentionInput } from "./MentionInput";
import { renderMentions } from "./mentions";
import type { ConversationRow, MessageRow, RosterUser } from "./types";

const IconChat = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const IconX = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);

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
  const [tab, setTab] = useState<"chats" | "people">("chats");
  return (
    <div className="tc-sidebar">
      <div className="tc-tabs">
        <button className={`tc-tab${tab === "chats" ? " active" : ""}`} onClick={() => setTab("chats")}>Chats</button>
        <button className={`tc-tab${tab === "people" ? " active" : ""}`} onClick={() => setTab("people")}>People</button>
      </div>
      {tab === "chats" ? <ConversationList /> : <PeopleRoster />}
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
  const sendMessage = useMutation(api.sendMessage as any);
  const markRead = useMutation(api.markRead as any);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const nameById = useMemo(() => Object.fromEntries((roster ?? []).map((r) => [r.userId, r.name])), [roster]);
  const names = useMemo(() => (roster ?? []).map((r) => r.name), [roster]);
  const users = useMemo(() => (roster ?? []).map((r) => ({ userId: r.userId, name: r.name })), [roster]);

  // Mark read when opening + when new messages arrive while open.
  useEffect(() => { markRead({ conversationId }).catch(() => {}); }, [conversationId, msgs?.length]); // eslint-disable-line
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs?.length]);

  const title = useMemo(() => {
    // DM title from the roster peer if we can infer it; otherwise generic.
    return "Conversation";
  }, []);

  return (
    <div className="tc-thread">
      <div className="tc-thead"><span className="tc-h">{title}</span><button className="tc-x" style={{ marginLeft: "auto" }} onClick={() => setOpen(false)}><IconX /></button></div>
      <div className="tc-msgs" ref={scrollRef}>
        {msgs === undefined ? <div className="tc-empty">…</div>
          : msgs.length === 0 ? <div className="tc-empty">No messages yet — say hi 👋</div>
          : msgs.map((m) => <MessageBubble key={m._id} m={m} mine={m.senderId === me.userId} senderName={nameById[m.senderId] || "User"} names={names} />)}
      </div>
      <div className="tc-composer">
        <MentionInput users={users} placeholder="Message…" onSubmit={(text, mentions) => { sendMessage({ conversationId, text, mentions }).catch(() => {}); }} />
      </div>
    </div>
  );
}

function MessageBubble({ m, mine, senderName, names }: { m: MessageRow; mine: boolean; senderName: string; names: string[] }) {
  return (
    <div className="tc-bubble">
      <Avatar name={senderName} size={28} />
      <div className="tc-b">
        <div className="tc-bh"><span className="tc-bn">{mine ? "You" : senderName}</span> · {fmtTime(m.createdAt)}{m.editedAt ? " · (edited)" : ""}</div>
        {m.deleted ? <div className="tc-bt tc-deleted">message deleted</div> : <div className="tc-bt">{renderMentions(m.text, names)}</div>}
      </div>
    </div>
  );
}
