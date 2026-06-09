import { useEffect } from "react";
import { useMutation } from "convex/react";
import type { ChatApi } from "./types";

// Keep the caller marked online: a heartbeat every ~45s while the tab is visible. Call once in the
// authed shell (inside the Convex provider).
export function usePresenceHeartbeat(api: ChatApi, enabled = true): void {
  const heartbeat = useMutation(api.heartbeat as any);
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;
    const beat = () => { if (document.visibilityState === "visible") (heartbeat as any)({}).catch(() => {}); };
    beat();
    const iv = setInterval(beat, 45_000);
    const vis = () => { if (document.visibilityState === "visible") beat(); };
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", vis); };
  }, [enabled, heartbeat]);
}
