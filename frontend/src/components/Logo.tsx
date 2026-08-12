import { Code2 } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-md flex-shrink-0">
        <Code2 size={18} color="white" strokeWidth={2.2} />
      </div>
      <span
        className={`font-bold text-xl tracking-tight ${light ? "text-white" : "text-foreground"}`}
      >
        Radar<span className={light ? "text-primary-lightest" : "text-primary"}>Skill</span>
      </span>
    </div>
  );
}
