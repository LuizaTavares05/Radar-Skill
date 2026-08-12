import { useEffect, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import type { EntradaSkill, Nivel, Skill, SkillCatalogo } from "../types";
import { NIVEIS } from "../types";
import { SKILL_CATALOG } from "../data/skills";
import { obterCatalogo } from "../api/skills";
import { obterToken } from "../auth";
import LevelBadge from "./LevelBadge";

type SkillModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: EntradaSkill) => Promise<void>;
  editSkill?: Skill | null;
};

export default function SkillModal({ open, onClose, onSave, editSkill }: SkillModalProps) {
  const [catalogo, setCatalogo] = useState<SkillCatalogo[]>(SKILL_CATALOG);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [tecnologiaSelecionada, setTecnologiaSelecionada] = useState<SkillCatalogo | null>(null);
  const [nivel, setNivel] = useState<Nivel>("Intermediário");
  const [descricao, setDescricao] = useState("");
  const [tecnologiaAberta, setTecnologiaAberta] = useState(false);
  const [nivelAberto, setNivelAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCatalogoLoading(true);
    obterCatalogo(obterToken())
      .then((lista) => {
        if (cancelled) return;
        setCatalogo(lista.length > 0 ? lista : SKILL_CATALOG);
      })
      .catch(() => {
        if (!cancelled) setCatalogo(SKILL_CATALOG);
      })
      .finally(() => {
        if (!cancelled) setCatalogoLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const doCatalogo = catalogo.find((t) => t.nome === editSkill?.nome) ?? null;
    setTecnologiaSelecionada(
      doCatalogo ??
        (editSkill
          ? {
              id: 0,
              nome: editSkill.nome,
              categoria: editSkill.categoria,
              imagemUrl: editSkill.imagemUrl,
              descricao: editSkill.descricaoSkill ?? "",
            }
          : null),
    );
    setNivel(editSkill?.nivel ?? "Intermediário");
    setDescricao(editSkill?.descricao ?? "");
    setErrors({});
    setTecnologiaAberta(false);
    setNivelAberto(false);
    setSalvando(false);
  }, [open, editSkill, catalogo]);

  if (!open) return null;

  const fecharModal = () => {
    if (!salvando) onClose();
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!tecnologiaSelecionada) e.tecnologia = "Selecione uma tecnologia";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const salvar = async () => {
    if (salvando) return;
    if (!validar() || (!tecnologiaSelecionada && !editSkill)) return;
    setSalvando(true);
    try {
      await onSave({
        skillId: editSkill ? undefined : tecnologiaSelecionada?.id,
        nivel,
        descricao: descricao.trim(),
      });
      onClose();
    } catch {
      // mantém o modal aberto; o erro já foi exibido pelo chamador
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={editSkill ? "Editar Skill" : "Adicionar Skill"}
    >
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={fecharModal} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden animate-[fadeInScale_0.18s_ease-out]">
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {editSkill ? "Editar Skill" : "Adicionar Nova Skill"}
            </h2>
            <p className="text-sm text-muted mt-0.5">
              {editSkill ? "Atualize os detalhes da sua skill" : "Adicione uma tecnologia à sua stack"}
            </p>
          </div>
          <button
            onClick={fecharModal}
            disabled={salvando}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-all duration-150 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">Tecnologia</label>
            <button
              type="button"
              disabled={salvando}
              onClick={() => {
                setTecnologiaAberta(!tecnologiaAberta);
                setNivelAberto(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 bg-card transition-all duration-200 text-left ${
                tecnologiaAberta
                  ? "border-primary shadow-[0_0_0_3px_rgba(10,78,119,0.12)]"
                  : errors.tecnologia
                    ? "border-danger"
                    : "border-border hover:border-muted/50"
              } ${salvando ? "opacity-60" : ""}`}
            >
              {tecnologiaSelecionada ? (
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                    {tecnologiaSelecionada.imagemUrl ? (
                      <img
                        src={tecnologiaSelecionada.imagemUrl}
                        alt={tecnologiaSelecionada.nome}
                        className="w-full h-full object-contain p-0.5"
                      />
                    ) : (
                      <span className="text-primary font-bold text-xs">
                        {tecnologiaSelecionada.nome.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-foreground truncate">
                    {tecnologiaSelecionada.nome}
                  </span>
                  <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-full flex-shrink-0">
                    {tecnologiaSelecionada.categoria}
                  </span>
                </span>
              ) : (
                <span className="text-muted font-normal text-sm">Selecione uma tecnologia.</span>
              )}
              <ChevronDown
                size={16}
                className={`text-muted transition-transform duration-200 flex-shrink-0 ${tecnologiaAberta ? "rotate-180" : ""}`}
              />
            </button>
            {errors.tecnologia && (
              <p className="mt-1.5 text-xs text-danger pl-1 font-medium">{errors.tecnologia}</p>
            )}
            {tecnologiaAberta && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-xl z-20 overflow-hidden max-h-56 overflow-y-auto">
                {catalogoLoading ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-5 text-sm text-muted">
                    <span className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
                    Carregando catálogo...
                  </div>
                ) : (
                  catalogo.map((tecnologia) => (
                    <button
                      key={tecnologia.id}
                      onClick={() => {
                        setTecnologiaSelecionada(tecnologia);
                        setTecnologiaAberta(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left"
                    >
                      <span className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tecnologia.imagemUrl ? (
                          <img
                            src={tecnologia.imagemUrl}
                            alt={tecnologia.nome}
                            className="w-full h-full object-contain p-0.5"
                          />
                        ) : (
                          <span className="text-primary font-bold text-xs">
                            {tecnologia.nome.charAt(0)}
                          </span>
                        )}
                      </span>
                      <span className="font-medium text-foreground flex-1 text-sm">
                        {tecnologia.nome}
                      </span>
                      <span className="text-xs text-muted">{tecnologia.categoria}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nível de Proficiência
            </label>
            <button
              type="button"
              disabled={salvando}
              onClick={() => {
                setNivelAberto(!nivelAberto);
                setTecnologiaAberta(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 bg-card transition-all duration-200 ${
                nivelAberto
                  ? "border-primary shadow-[0_0_0_3px_rgba(10,78,119,0.12)]"
                  : "border-border hover:border-muted/50"
              } ${salvando ? "opacity-60" : ""}`}
            >
              <LevelBadge nivel={nivel} />
              <ChevronDown
                size={16}
                className={`text-muted transition-transform duration-200 flex-shrink-0 ${nivelAberto ? "rotate-180" : ""}`}
              />
            </button>
            {nivelAberto && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border shadow-xl z-20 overflow-hidden">
                {NIVEIS.map((opcao) => (
                  <button
                    key={opcao}
                    onClick={() => {
                      setNivel(opcao);
                      setNivelAberto(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      nivel === opcao ? "bg-primary/5" : "hover:bg-surface"
                    }`}
                  >
                    <LevelBadge nivel={opcao} />
                    {nivel === opcao && <Check size={14} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={salvando}
              placeholder="Descreva sua experiência com esta tecnologia. (opcional)"
              rows={3}
              className={`w-full px-4 py-3.5 rounded-2xl border-2 text-foreground placeholder-muted outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(10,78,119,0.12)] resize-none text-sm leading-relaxed ${
                errors.descricao ? "border-danger" : "border-border hover:border-muted/50"
              } ${salvando ? "opacity-60" : ""}`}
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={fecharModal}
            disabled={salvando}
            className="flex-1 py-3.5 rounded-2xl border-2 border-border text-text-secondary font-semibold hover:bg-surface hover:border-muted/50 active:bg-border/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-[0_4px_14px_rgba(10,78,119,0.32)] hover:shadow-[0_6px_20px_rgba(10,78,119,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2.5"
          >
            {salvando && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {salvando
              ? editSkill
                ? "Salvando..."
                : "Adicionando..."
              : editSkill
                ? "Salvar Alterações"
                : "Adicionar Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}
