# teamchat

Teams-style in-app chat + presence UI (React), backend-agnostic. The host app owns the
Convex backend (conversations/messages/presence) and passes its function references into
`<ChatProvider api={...}>`. Ships TS source — consumers add `transpilePackages: ["teamchat"]`.

Styling is self-contained (injected CSS using the host theme CSS variables `--primary`,
`--background`, `--border`, … so it matches the app + dark mode). No Tailwind dependency.

```tsx
import { ChatProvider, ChatLauncher } from "teamchat/react";
<ChatProvider api={chatApi} me={me}><ChatLauncher /></ChatProvider>
```
