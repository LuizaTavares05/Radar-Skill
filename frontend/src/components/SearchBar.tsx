import { useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import type { FiltroNivel } from "../types";
import { NIVEIS } from "../types";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filtroNivel: FiltroNivel;
  aoMudarFiltro: (nivel: FiltroNivel) => void;
  counts: Record<string, number>;
};

const FILTER_OPTIONS: FiltroNivel[] = ["Todos", ...NIVEIS];

export default function SearchBar({
  search,
  onSearchChange,
  filtroNivel,
  aoMudarFiltro,
  counts,
}: SearchBarProps) {
  const [filtroAberto, setFiltroAberto] = useState(false);

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar skills, nível ou categorias."
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-border bg-card text-foreground placeholder-muted outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(10,78,119,0.12)] hover:border-muted/50 transition-all duration-200 text-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            aria-label="Limpar pesquisa"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setFiltroAberto(!filtroAberto)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 bg-card font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            filtroNivel !== "Todos"
              ? "border-primary text-primary bg-primary/5"
              : "border-border text-text-secondary hover:border-muted/50"
          }`}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">
            {filtroNivel === "Todos" ? "Todos os níveis" : filtroNivel}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${filtroAberto ? "rotate-180" : ""}`}
          />
        </button>
        {filtroAberto && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-2xl border border-border shadow-xl z-20 overflow-hidden py-1">
            {FILTER_OPTIONS.map((nivel) => (
              <button
                key={nivel}
                onClick={() => {
                  aoMudarFiltro(nivel);
                  setFiltroAberto(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  filtroNivel === nivel
                    ? "bg-primary/5 text-primary font-semibold"
                    : "text-text-secondary hover:bg-surface font-medium"
                }`}
              >
                <span>{nivel === "Todos" ? "Todos os níveis" : nivel}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    filtroNivel === nivel ? "bg-primary/10 text-primary" : "bg-surface text-muted"
                  }`}
                >
                  {counts[nivel] ?? 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
