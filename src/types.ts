import type { FunctionReference } from "convex/server";

// The host app passes its Convex function references in (so this package never imports the app's
// generated `api`). Args/returns are intentionally loose — the host owns the real shapes.
export interface ChatApi {
  listMine: FunctionReference<"query">;
  unreadCount: FunctionReference<"query">;
  messages: FunctionReference<"query">;
  roster: FunctionReference<"query">;
  getOrCreateDm: FunctionReference<"mutation">;
  sendMessage: FunctionReference<"mutation">;
  markRead: FunctionReference<"mutation">;
  heartbeat: FunctionReference<"mutation">;
  // Phase 2+ (optional — features degrade gracefully when absent):
  createGroup?: FunctionReference<"mutation">;
  listChannels?: FunctionReference<"query">;
  createChannel?: FunctionReference<"mutation">;
  joinChannel?: FunctionReference<"mutation">;
  leaveChannel?: FunctionReference<"mutation">;
  removeConversation?: FunctionReference<"mutation">; // delete (admin/DM) or leave (member)
  // Phase 3 (optional):
  editMessage?: FunctionReference<"mutation">;
  deleteMessage?: FunctionReference<"mutation">;
  toggleReaction?: FunctionReference<"mutation">;
  uploadUrl?: FunctionReference<"mutation">;
  attachmentUrl?: FunctionReference<"query">;
  // Support chat (optional — a pinned conversation with the platform's App Admins, bridged to the
  // control plane host-side). When absent or `enabled` resolves false, the Support entry is hidden.
  support?: {
    enabled: FunctionReference<"query">;
    thread: FunctionReference<"query">;
    send: FunctionReference<"mutation">;
  };
}

export interface SupportMessageRow {
  _id: string;
  senderKind: "user" | "admin";
  senderName: string;
  text: string;
  createdAt: number;
}

export interface ChatMe { userId: string; name?: string }

export interface ConversationRow {
  _id: string;
  kind: "dm" | "group" | "channel";
  title: string;
  peerId?: string | null;
  lastPreview: string;
  lastMessageAt: number;
  unread: boolean;
  muted: boolean;
  isAdmin?: boolean; // caller is a conversation admin → Delete (else Leave) for groups/channels
}

export interface MessageRow {
  _id: string;
  senderId: string;
  text: string;
  mentions: string[];
  attachments: { storageId: string; name: string; contentType?: string; size?: number }[];
  reactions: { emoji: string; userIds: string[] }[];
  createdAt: number;
  editedAt: number | null;
  deleted: boolean;
}

export interface RosterUser { userId: string; name: string; role: string; online: boolean; status: string }
