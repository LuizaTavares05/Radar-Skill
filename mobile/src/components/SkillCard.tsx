import { Pressable, StyleSheet, Text, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import type { Skill } from "../types";
import { colors, font, radius } from "../theme";
import SkillIcon from "./SkillIcon";
import LevelBadge from "./LevelBadge";

type SkillCardProps = {
  skill: Skill;
  onOpen: (skill: Skill) => void;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
};

export default function SkillCard({ skill, onOpen, onEdit, onDelete }: SkillCardProps) {
  return (
    <Pressable
      onPress={() => onOpen(skill)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${skill.nome}`}
    >
      <View style={styles.iconWrap}>
        <SkillIcon nome={skill.nome} imagemUrl={skill.imagemUrl} size={40} />
      </View>

      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {skill.nome}
        </Text>
        <Text style={styles.categoria} numberOfLines={1}>
          {skill.categoria}
        </Text>
        <LevelBadge nivel={skill.nivel} />
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => onDelete(skill.id)}
          hitSlop={8}
          style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          accessibilityLabel={`Excluir ${skill.nome}`}
        >
          <Trash2 size={16} color={colors.danger} />
        </Pressable>
        <Pressable
          onPress={() => onEdit(skill)}
          hitSlop={8}
          style={({ pressed }) => [styles.actionButtonEdit, pressed && styles.actionPressedEdit]}
          accessibilityLabel={`Editar ${skill.nome}`}
        >
          <Pencil size={14} color={colors.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export function SkillCardSkeleton() {
  return (
    <View style={[styles.card, styles.skeletonCard]}>
      <View style={[styles.iconWrap, styles.skeletonBlock]} />
      <View style={styles.info}>
        <View style={[styles.skeletonBlock, styles.skeletonLineWide]} />
        <View style={[styles.skeletonBlock, styles.skeletonLineNarrow]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  pressed: {
    borderColor: colors.primary,
    opacity: 0.95,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: "rgba(10, 78, 119, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nome: {
    fontSize: 16,
    fontFamily: font.semibold,
    color: colors.foreground,
  },
  categoria: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.textSecondary,
  },
  actions: {
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(185, 74, 72, 0.08)",
  },
  actionPressed: {
    backgroundColor: "rgba(185, 74, 72, 0.18)",
  },
  actionButtonEdit: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 78, 119, 0.08)",
  },
  actionPressedEdit: {
    backgroundColor: "rgba(10, 78, 119, 0.18)",
  },
  skeletonCard: {
    opacity: 0.7,
  },
  skeletonBlock: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  skeletonLineWide: {
    height: 14,
    width: "65%",
  },
  skeletonLineNarrow: {
    height: 12,
    width: "40%",
  },
});
