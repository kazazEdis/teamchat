import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ChatApi, ChatMe } from "./types";
import { injectStyles } from "./styles";

interface Ctx {
  api: ChatApi;
  me: ChatMe;
  open: boolean;
  setOpen: (b: boolean) => void;
  active: string | null;
  setActive: (id: string | null) => void;
  openConversation: (id: string) => void;
}
const ChatCtx = createContext<Ctx | null>(null);

export function useChatCtx(): Ctx {
  const c = useContext(ChatCtx);
  if (!c) throw new Error("teamchat: wrap your app in <ChatProvider>");
  return c;
}

// Host wires the chat backend in here. To open chat to a conversation from outside (e.g. a bell
// notification), dispatch: window.dispatchEvent(new CustomEvent("teamchat:open",{detail:{conversationId}})).
export function ChatProvider({ api, me, children }: { api: ChatApi; me: ChatMe; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { injectStyles(); }, []);
  const openConversation = useCallback((id: string) => { setActive(id); setOpen(true); }, []);
  useEffect(() => {
    const h = (e: Event) => { const id = (e as CustomEvent)?.detail?.conversationId; setOpen(true); if (id) setActive(id); };
    window.addEventListener("teamchat:open", h);
    return () => window.removeEventListener("teamchat:open", h);
  }, []);
  return <ChatCtx.Provider value={{ api, me, open, setOpen, active, setActive, openConversation }}>{children}</ChatCtx.Provider>;
}
