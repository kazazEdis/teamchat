import { describe, it, expect } from "vitest";
import { formatTs, serializeMessage, serializeSelection } from "./chatExport";

// Local-time construction + local-time formatting → no timezone flakiness.
const t = (h: number, min: number) => new Date(2026, 6, 2, h, min).getTime(); // 2026-07-02

describe("formatTs", () => {
  it("formats YYYY-MM-DD HH:mm with zero-padding", () => {
    expect(formatTs(t(9, 5))).toBe("2026-07-02 09:05");
    expect(formatTs(t(14, 30))).toBe("2026-07-02 14:30");
  });
});

describe("serializeMessage", () => {
  it("renders **sender** (ts): text", () => {
    expect(serializeMessage({ senderId: "u1", text: "hi there", createdAt: t(14, 30) }, "Ana"))
      .toBe("**Ana** (2026-07-02 14:30): hi there");
  });
  it("appends an [attachment: name] line per attachment (no URL resolved)", () => {
    expect(serializeMessage({ senderId: "u1", text: "see this", createdAt: t(14, 30), attachments: [{ storageId: "s1", name: "a.png" }, { storageId: "s2", name: "b.pdf" }] }, "Ana"))
      .toBe("**Ana** (2026-07-02 14:30): see this\n[attachment: a.png]\n[attachment: b.pdf]");
  });
  it("renders attachments as markdown links when a URL is resolved", () => {
    const urls = { s1: "https://x.convex.cloud/api/storage/abc" };
    expect(serializeMessage({ senderId: "u1", text: "pic", createdAt: t(14, 30), attachments: [{ storageId: "s1", name: "a.png" }, { storageId: "s2", name: "b.pdf" }] }, "Ana", urls))
      .toBe("**Ana** (2026-07-02 14:30): pic\n[attachment: a.png](https://x.convex.cloud/api/storage/abc)\n[attachment: b.pdf]");
  });
  it("shows a placeholder for a deleted message", () => {
    expect(serializeMessage({ senderId: "u1", text: "", createdAt: t(14, 30), deleted: true }, "Ana"))
      .toBe("**Ana** (2026-07-02 14:30): [message deleted]");
  });
  it("keeps @mention text verbatim", () => {
    expect(serializeMessage({ senderId: "u1", text: "cc @Bob please", createdAt: t(14, 30) }, "Ana"))
      .toBe("**Ana** (2026-07-02 14:30): cc @Bob please");
  });
});

describe("serializeSelection", () => {
  const names = { u1: "Ana", u2: "Bob" };
  it("joins the selection in order, blank-line separated, with real names", () => {
    expect(serializeSelection([
      { senderId: "u1", text: "first", createdAt: t(9, 0) },
      { senderId: "u2", text: "second", createdAt: t(9, 1) },
    ], names)).toBe("**Ana** (2026-07-02 09:00): first\n\n**Bob** (2026-07-02 09:01): second");
  });
  it("handles a single message (single-copy path)", () => {
    expect(serializeSelection([{ senderId: "u2", text: "solo", createdAt: t(9, 0) }], names))
      .toBe("**Bob** (2026-07-02 09:00): solo");
  });
  it("falls back to 'User' for an unknown sender", () => {
    expect(serializeSelection([{ senderId: "u9", text: "x", createdAt: t(9, 0) }], names))
      .toContain("**User** (");
  });
});
