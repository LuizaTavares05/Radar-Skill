import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import type { Skill } from "../types";
import LevelBadge from "./LevelBadge";

type SkillDetailModalProps = {
  skill: Skill | null;
  onClose: () => void;
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

export default function SkillDetailModal({ skill, onClose, onEdit, onDelete }: SkillDetailModalProps) {
  if (!skill) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${skill.nome}`}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-[fadeInScale_0.18s_ease-out]">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
              <SkillIcon nome={skill.nome} imagemUrl={skill.imagemUrl} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-foreground truncate">{skill.nome}</h2>
              <span className="text-sm text-muted font-medium">{skill.categoria}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-all duration-150"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">
              Nível de proficiência
            </span>
            <div className="mt-2">
              <LevelBadge nivel={skill.nivel} />
            </div>
          </div>

          {skill.descricaoSkill && (
            <div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wide">Sobre</span>
              <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                {skill.descricaoSkill}
              </p>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wide">
              Sua descrição
            </span>
            <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
              {skill.descricao || "Nenhuma descrição adicionada."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => onDelete(skill.id)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-danger/30 text-danger font-semibold hover:bg-danger/5 active:bg-danger/10 transition-all duration-200"
          >
            <Trash2 size={16} />
            Excluir
          </button>
          <button
            onClick={() => onEdit(skill)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-[0_4px_14px_rgba(10,78,119,0.32)] hover:shadow-[0_6px_20px_rgba(10,78,119,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Pencil size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
