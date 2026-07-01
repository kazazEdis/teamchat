import { describe, it, expect } from "vitest";
import { mentionQuery, serializeRoot } from "./mentionText";

describe("mentionQuery", () => {
  it("returns the query after a lone or space-preceded @", () => {
    expect(mentionQuery("@")).toBe("");
    expect(mentionQuery("@jo")).toBe("jo");
    expect(mentionQuery("hi @jo")).toBe("jo");
    expect(mentionQuery("hi @")).toBe("");
  });
  it("is null when @ is not mention-anchored or absent", () => {
    expect(mentionQuery("email@x")).toBeNull();     // @ mid-word is an address, not a mention
    expect(mentionQuery("plain text")).toBeNull();
    expect(mentionQuery("@jo more")).toBeNull();     // caret past the mention (trailing space + word)
  });
  it("rejects a non-anchored trailing @ and caps the query length", () => {
    expect(mentionQuery("@a@b")).toBeNull();               // 2nd @ follows "a" (not space/start) → no match
    expect(mentionQuery("@" + "x".repeat(40))).toBeNull(); // >30 chars → no match
  });
});

// Build a composer tree by hand (jsdom) and assert the sendable serialization. This is the logic a
// paste/typing regression would silently break, tested without simulating contentEditable editing.
function pill(id: string, name: string): HTMLElement {
  const s = document.createElement("span");
  s.dataset.mentionId = id;
  s.dataset.mentionName = name;
  s.textContent = "@" + name;
  return s;
}

describe("serializeRoot", () => {
  const users = [{ userId: "u1", name: "Ana" }, { userId: "u2", name: "Bob" }];

  it("renders mention pills as @Name and collects their ids", () => {
    const root = document.createElement("div");
    root.append(document.createTextNode("hi "), pill("u1", "Ana"), document.createTextNode(" there"));
    const { text, ids } = serializeRoot(root, users);
    expect(text).toBe("hi @Ana there");
    expect(ids).toEqual(["u1"]);
  });

  it("turns <br> and block <div> boundaries into newlines", () => {
    const root = document.createElement("div");
    root.append(document.createTextNode("line1"), document.createElement("br"));
    const d = document.createElement("div");
    d.textContent = "line2";
    root.append(d);
    // <br> → "\n" and the block <div> prepends its own "\n" → the two stack.
    expect(serializeRoot(root, users).text).toBe("line1\n\nline2");
  });

  it("also matches a bare (un-pilled) @Name typed for a known user", () => {
    const root = document.createElement("div");
    root.textContent = "cc @Bob";
    const { text, ids } = serializeRoot(root, users);
    expect(text).toBe("cc @Bob");
    expect(ids).toEqual(["u2"]);
  });

  it("trims and returns no ids for plain text", () => {
    const root = document.createElement("div");
    root.textContent = "  just text  ";
    const { text, ids } = serializeRoot(root, users);
    expect(text).toBe("just text");
    expect(ids).toEqual([]);
  });
});
