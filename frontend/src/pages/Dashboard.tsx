import { useEffect, useMemo, useState } from "react";
import { BarChart3, Layers, Plus, Zap } from "lucide-react";
import type { EntradaSkill, FiltroNivel, Skill } from "../types";
import { NIVEIS } from "../types";
import { adicionarSkill, atualizarSkill, excluirSkill, obterMinhasSkills } from "../api/skills";
import { ApiError } from "../api/client";
import { obterToken } from "../auth";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import SkillCard, { SkillCardSkeleton } from "../components/SkillCard";
import EmptyState from "../components/EmptyState";
import SkillModal from "../components/SkillModal";
import SkillDetailModal from "../components/SkillDetailModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../components/Toast";

type DashboardProps = {
  onLogout: () => void;
};

export default function Dashboard({ onLogout }: DashboardProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroNivel, setFiltroNivel] = useState<FiltroNivel>("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; nome: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCarregando(true);
      try {
        const data = await obterMinhasSkills(obterToken());
        if (!cancelled) setSkills(data);
      } catch (error) {
        if (!cancelled) tratarErroApi(error, "Erro ao carregar suas skills");
      } finally {
        if (!cancelled) setCarregando(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tratarErroApi = (error: unknown, title: string) => {
    if (error instanceof ApiError && error.status === 401) {
      toast.error("Sessão expirada", "Faça login novamente.");
      onLogout();
      return;
    }
    toast.error(title, error instanceof ApiError ? error.message : undefined);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((s) => {
      const matchSearch =
        !q ||
        s.nome.toLowerCase().includes(q) ||
        s.descricao.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q);
      const matchLevel = filtroNivel === "Todos" || s.nivel === filtroNivel;
      return matchSearch && matchLevel;
    });
  }, [skills, search, filtroNivel]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: skills.length };
    for (const nivel of NIVEIS) {
      c[nivel] = skills.filter((s) => s.nivel === nivel).length;
    }
    return c;
  }, [skills]);

  const adicionar = async (data: EntradaSkill): Promise<void> => {
    if (data.skillId == null) return;
    try {
      const created = await adicionarSkill(
        data.skillId,
        data.nivel,
        data.descricao.trim(),
        obterToken(),
      );
      setSkills((prev) => [created, ...prev]);
      toast.success(`${created.nome} adicionada!`, "Skill adicionada à sua stack.");
    } catch (error) {
      tratarErroApi(error, "Não foi possível adicionar a skill");
      throw error;
    }
  };

  const editar = async (data: EntradaSkill): Promise<void> => {
    if (!editSkill) return;
    try {
      const updated = await atualizarSkill(
        editSkill.id,
        data.nivel,
        data.descricao.trim(),
        obterToken(),
      );
      setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast.success("Skill atualizada!", `${updated.nome} foi atualizada.`);
    } catch (error) {
      tratarErroApi(error, "Não foi possível atualizar a skill");
      throw error;
    }
  };

  const excluir = async (): Promise<void> => {
    if (!deleteTarget) return;
    try {
      await excluirSkill(deleteTarget.id, obterToken());
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Skill removida", `${deleteTarget.nome} foi excluída.`);
      setDeleteTarget(null);
    } catch (error) {
      tratarErroApi(error, "Não foi possível excluir a skill");
      throw error;
    }
  };

  const stats = [
    {
      label: "Total de Skills",
      value: skills.length,
      Icon: Layers,
      box: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Avançadas",
      value: counts.Avançado,
      Icon: Zap,
      box: "from-secondary/10 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      label: "Em desenvolvimento",
      value: counts.Iniciante + counts.Intermediário,
      Icon: BarChart3,
      box: "from-success/10 to-success/5",
      iconColor: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Minhas Skills</h1>
            <p className="text-text-secondary">Gerencie sua stack de tecnologia</p>
          </div>
          <button
            onClick={() => {
              setEditSkill(null);
              setModalAberto(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-[0_4px_14px_rgba(10,78,119,0.32)] hover:shadow-[0_6px_22px_rgba(10,78,119,0.48)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus size={18} strokeWidth={2.5} />
            Adicionar Skill
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.box} flex items-center justify-center flex-shrink-0`}
              >
                <stat.Icon size={20} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">
                  {carregando ? "-" : stat.value}
                </p>
                <p className="text-xs text-muted font-medium mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            filtroNivel={filtroNivel}
            aoMudarFiltro={setFiltroNivel}
            counts={counts}
          />
        </div>

        {!carregando && (
          <div className="flex items-center gap-2 mb-5">
            <span className="text-sm text-text-secondary font-medium">
              {filtered.length} {filtered.length === 1 ? "skill" : "skills"}
              {search && <span className="text-muted"> para "{search}"</span>}
              {filtroNivel !== "Todos" && <span className="text-muted"> • {filtroNivel}</span>}
            </span>
          </div>
        )}

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={search} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onOpen={setDetailSkill}
                onEdit={(s) => {
                  setEditSkill(s);
                  setModalAberto(true);
                }}
                onDelete={(id) =>
                  setDeleteTarget({ id, nome: skills.find((s) => s.id === id)?.nome ?? "" })
                }
              />
            ))}
          </div>
        )}
      </main>

      <SkillModal
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setEditSkill(null);
        }}
        onSave={editSkill ? editar : adicionar}
        editSkill={editSkill}
      />

      <SkillDetailModal
        skill={detailSkill}
        onClose={() => setDetailSkill(null)}
        onEdit={(s) => {
          setDetailSkill(null);
          setEditSkill(s);
          setModalAberto(true);
        }}
        onDelete={(id) => {
          setDetailSkill(null);
          setDeleteTarget({ id, nome: skills.find((s) => s.id === id)?.nome ?? "" });
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={excluir}
        skillName={deleteTarget?.nome ?? ""}
      />
    </div>
  );
}
