import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BarChart3, Layers, Plus, Zap } from "lucide-react-native";
import type { EntradaSkill, FiltroNivel, Skill } from "../types";
import { NIVEIS } from "../types";
import { adicionarSkill, atualizarSkill, excluirSkill, obterMinhasSkills } from "../api/skills";
import { ApiError } from "../api/client";
import { obterToken } from "../auth";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import SkillCard, { SkillCardSkeleton } from "../components/SkillCard";
import EmptyState from "../components/EmptyState";
import SkillModal from "../components/SkillModal";
import SkillDetailModal from "../components/SkillDetailModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../components/Toast";

type DashboardProps = {
  email: string;
  nome: string;
  onLogout: () => void;
};

export default function Dashboard({ email, nome, onLogout }: DashboardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroNivel, setFiltroNivel] = useState<FiltroNivel>("Todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; nome: string } | null>(null);

  const tratarErroApi = useCallback(
    (error: unknown, title: string) => {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Sessão expirada", "Faça login novamente.");
        onLogout();
        return;
      }
      toast.error(title, error instanceof ApiError ? error.message : undefined);
    },
    [onLogout],
  );

  const carregarSkills = useCallback(async () => {
    setFalhaCarregamento(false);
    try {
      const data = await obterMinhasSkills(obterToken());
      setSkills(data);
    } catch (error) {
      setFalhaCarregamento(true);
      tratarErroApi(error, "Erro ao carregar suas skills");
    } finally {
      setCarregando(false);
    }
  }, [tratarErroApi]);

  useEffect(() => {
    carregarSkills();
  }, [carregarSkills]);

  const aoAtualizar = useCallback(async () => {
    setAtualizando(true);
    await carregarSkills();
    setAtualizando(false);
  }, [carregarSkills]);

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
      const created = await adicionarSkill(data.skillId, data.nivel, data.descricao.trim(), obterToken());
      setSkills((prev) => [created, ...prev]);
      toast.success("Skill adicionada!", `${created.nome} foi adicionada à sua stack.`);
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
      toast.success("Skill atualizada!", `${updated.nome} foi atualizada com sucesso.`);
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
      bg: "rgba(10, 78, 119, 0.08)",
      color: colors.primary,
    },
    {
      label: "Avançadas",
      value: counts.Avançado,
      Icon: Zap,
      bg: "rgba(80, 93, 97, 0.08)",
      color: colors.secondary,
    },
    {
      label: "Em desenvolvimento",
      value: counts.Iniciante + counts.Intermediário,
      Icon: BarChart3,
      bg: "rgba(46, 125, 91, 0.08)",
      color: colors.success,
    },
  ];

  const gridColumns = width >= 1200 ? 4 : width >= 900 ? 3 : width >= 640 ? 2 : 1;
  const itemWidthPct = 100 / gridColumns;
  const statColumns = width >= 1024 ? 4 : width >= 640 ? 2 : 1;
  const statWidthPct = 100 / statColumns;

  return (
    <View style={styles.screen}>
      <Header email={email} nome={nome} onLogout={onLogout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} tintColor={colors.primary} />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Minhas Skills</Text>
            <Text style={styles.subtitle}>Gerencie sua stack de tecnologia</Text>
          </View>
          <Pressable
            onPress={() => {
              setEditSkill(null);
              setModalAberto(true);
            }}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Adicionar Skill"
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryHover]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonFill}
            >
              <Plus size={18} color={colors.white} strokeWidth={2.5} />
              <Text style={styles.addButtonText}>Adicionar Skill</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => {
            const Icon = stat.Icon;
            return (
              <View key={stat.label} style={{ width: `${statWidthPct}%`, padding: 8 }}>
                <View style={styles.statCard}>
                  <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}>
                    <Icon size={20} color={stat.color} />
                  </View>
                  <View style={styles.statInfo}>
                    <Text style={styles.statValue}>{carregando ? "-" : stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.searchWrap}>
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            filtroNivel={filtroNivel}
            aoMudarFiltro={setFiltroNivel}
            counts={counts}
          />
        </View>

        {!carregando && !falhaCarregamento && (
          <View style={styles.resultRow}>
            <Text style={styles.resultText}>
              {filtered.length} {filtered.length === 1 ? "skill" : "skills"}
              {search !== "" && <Text style={styles.resultMuted}> para "{search}"</Text>}
              {filtroNivel !== "Todos" && (
                <Text style={styles.resultMuted}> • {filtroNivel}</Text>
              )}
            </Text>
          </View>
        )}

        {carregando ? (
          <View style={styles.grid}>
            {Array.from({ length: Math.min(6, gridColumns * 2) }).map((_, i) => (
              <View key={i} style={{ width: `${itemWidthPct}%`, padding: 10 }}>
                <SkillCardSkeleton />
              </View>
            ))}
          </View>
        ) : falhaCarregamento ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Não foi possível carregar suas skills</Text>
            <Pressable
              onPress={carregarSkills}
              style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            >
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState query={search} />
        ) : (
          <View style={styles.grid}>
            {filtered.map((skill) => (
              <View key={skill.id} style={{ width: `${itemWidthPct}%`, padding: 10 }}>
                <SkillCard
                  skill={skill}
                  onOpen={setDetailSkill}
                  onEdit={(s) => {
                    setEditSkill(s);
                    setModalAberto(true);
                  }}
                  onDelete={(id) =>
                    setDeleteTarget({
                      id,
                      nome: skills.find((s) => s.id === id)?.nome ?? "",
                    })
                  }
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <SkillModal
        open={modalAberto && !editSkill}
        onClose={() => setModalAberto(false)}
        onSave={adicionar}
        editSkill={null}
      />
      <SkillModal
        open={!!editSkill}
        onClose={() => setEditSkill(null)}
        onSave={editar}
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
    </View>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      maxWidth: 1280,
      width: "100%",
      alignSelf: "center",
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 48,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 32,
    },
    titleBlock: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontFamily: font.bold,
      color: c.foreground,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: font.regular,
      color: c.textSecondary,
    },
    addButton: {
      borderRadius: radius.md,
      overflow: "hidden",
    },
    addButtonPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.95,
    },
    addButtonFill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 18,
      paddingVertical: 13,
    },
    addButtonText: {
      fontSize: 15,
      fontFamily: font.semibold,
      color: c.white,
    },
    statsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -8,
      marginBottom: 24,
    },
    statCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: c.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
    },
    statIconBox: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    statInfo: {
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontFamily: font.bold,
      color: c.foreground,
      lineHeight: 28,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 12,
      fontFamily: font.medium,
      color: c.muted,
    },
    searchWrap: {
      marginBottom: 20,
    },
    resultRow: {
      marginBottom: 8,
      marginLeft: 10,
    },
    resultText: {
      fontSize: 13,
      fontFamily: font.medium,
      color: c.textSecondary,
    },
    resultMuted: {
      color: c.muted,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -10,
    },
    errorBox: {
      alignItems: "center",
      paddingVertical: 64,
      gap: 16,
    },
    errorTitle: {
      fontSize: 16,
      fontFamily: font.medium,
      color: c.textSecondary,
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: c.primary,
      backgroundColor: c.card,
    },
    retryButtonPressed: {
      backgroundColor: c.primaryTint,
    },
    retryText: {
      fontSize: 14,
      fontFamily: font.semibold,
      color: c.primary,
    },
  });
