// React UI entry. Import components from "teamchat/react".
export { ChatProvider, useChatCtx } from "./context";
export { ChatLauncher, ChatPanel } from "./Chat";
export { Avatar } from "./Avatar";
export { MentionInput } from "./MentionInput";
export { renderMentions } from "./mentions";
export { usePresenceHeartbeat } from "./hooks";
export type { ChatApi, ChatMe, ConversationRow, MessageRow, RosterUser, SupportMessageRow } from "./types";
