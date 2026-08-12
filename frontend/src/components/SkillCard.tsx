import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Skill } from "../types";
import LevelBadge from "./LevelBadge";

type SkillCardProps = {
  skill: Skill;
  onOpen: (skill: Skill) => void;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
};

function SkillIcon({ nome, imagemUrl }: { nome: string; imagemUrl: string }) {
  const [failed, setFailed] = useState(!imagemUrl);
  if (failed) {
    return <span className="text-primary font-bold text-lg select-none">{nome.charAt(0)}</span>;
  }
  return (
    <img
      src={imagemUrl}
      alt={nome}
      className="w-full h-full object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function SkillCard({ skill, onOpen, onEdit, onDelete }: SkillCardProps) {
  return (
    <article
      onClick={() => onOpen(skill)}
      className="group bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
            <SkillIcon nome={skill.nome} imagemUrl={skill.imagemUrl} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-base leading-tight truncate">
              {skill.nome}
            </h3>
            <span className="text-xs text-muted font-medium">{skill.categoria}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(skill);
            }}
            className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-all duration-150"
            aria-label={`Editar ${skill.nome}`}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(skill.id);
            }}
            className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-all duration-150"
            aria-label={`Excluir ${skill.nome}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <LevelBadge nivel={skill.nivel} />

      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">
        {skill.descricao}
      </p>
    </article>
  );
}

export function SkillCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface animate-pulse flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-surface rounded-lg animate-pulse mb-2 w-28" />
          <div className="h-3 bg-surface rounded-lg animate-pulse w-16" />
        </div>
      </div>
      <div className="h-5 bg-surface rounded-full animate-pulse w-24 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-surface rounded-lg animate-pulse w-full" />
        <div className="h-3 bg-surface rounded-lg animate-pulse w-4/5" />
      </div>
    </div>
  );
}
