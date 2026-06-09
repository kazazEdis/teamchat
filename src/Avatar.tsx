// (react-jsx transform — no React import needed)

function hslFor(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return `hsl(${h}, 52%, 45%)`;
}
function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const i = ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  return i || (name.trim()[0] || "?").toUpperCase();
}

// Initials avatar with a deterministic color, plus an optional online/offline status dot.
export function Avatar({ name, size = 28, online }: { name: string; size?: number; online?: boolean }) {
  return (
    <span className="tc-av" style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: hslFor(name) }}>
      {initialsFor(name)}
      {online !== undefined && <span className="tc-av-status" style={{ background: online ? "#22c55e" : "#9ca3af" }} />}
    </span>
  );
}
