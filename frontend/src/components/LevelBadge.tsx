import type { Nivel } from "../types";

const CONFIG: Record<Nivel, { bg: string; text: string; ring: string }> = {
  Iniciante: { bg: "bg-surface", text: "text-text-secondary", ring: "bg-muted" },
  Intermediário: { bg: "bg-success/10", text: "text-success", ring: "bg-success" },
  Avançado: { bg: "bg-primary/10", text: "text-primary", ring: "bg-primary" },
};

export default function LevelBadge({ nivel }: { nivel: Nivel }) {
  const c = CONFIG[nivel];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.ring}`} />
      {nivel}
    </span>
  );
}
