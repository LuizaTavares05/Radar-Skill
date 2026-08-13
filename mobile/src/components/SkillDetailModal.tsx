import { useMemo } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Pencil, Trash2, X } from "lucide-react-native";
import type { Skill } from "../types";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import LevelBadge from "./LevelBadge";
import SkillIcon from "./SkillIcon";

type SkillDetailModalProps = {
  skill: Skill | null;
  onClose: () => void;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
};

export default function SkillDetailModal({
  skill,
  onClose,
  onEdit,
  onDelete,
}: SkillDetailModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={!!skill} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        {skill && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconBox}>
                  <SkillIcon nome={skill.nome} imagemUrl={skill.imagemUrl} size={32} />
                </View>
                <View style={styles.titleBlock}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {skill.nome}
                  </Text>
                  <Text style={styles.cardSubtitle}>{skill.categoria}</Text>
                </View>
              </View>
              <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton} accessibilityLabel="Fechar">
                <X size={20} color={colors.muted} />
              </Pressable>
            </View>

            <ScrollView style={styles.cardBody} contentContainerStyle={styles.cardBodyContent}>
              <View>
                <Text style={styles.sectionLabel}>Nível de proficiência</Text>
                <View style={styles.levelWrap}>
                  <LevelBadge nivel={skill.nivel} />
                </View>
              </View>

              {!!skill.descricaoSkill && (
                <View>
                  <Text style={styles.sectionLabel}>Sobre</Text>
                  <Text style={styles.bodyText}>{skill.descricaoSkill}</Text>
                </View>
              )}

              <View>
                <Text style={styles.sectionLabel}>Sua descrição</Text>
                <Text style={styles.bodyText}>
                  {skill.descricao || "Nenhuma descrição adicionada."}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.cardFooter}>
              <Pressable
                onPress={() => onDelete(skill.id)}
                style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
                accessibilityLabel={`Excluir ${skill.nome}`}
              >
                <Trash2 size={16} color={colors.danger} />
                <Text style={styles.deleteText}>Excluir</Text>
              </Pressable>
              <Pressable
                onPress={() => onEdit(skill)}
                style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
                accessibilityLabel={`Editar ${skill.nome}`}
              >
                <Pencil size={16} color={colors.white} />
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(38, 50, 56, 0.4)",
    },
    card: {
      width: "100%",
      maxWidth: 512,
      maxHeight: "80%",
      backgroundColor: c.card,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
      minWidth: 0,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: c.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
    },
    cardTitle: {
      fontSize: 20,
      fontFamily: font.bold,
      color: c.foreground,
    },
    cardSubtitle: {
      marginTop: 2,
      fontSize: 14,
      fontFamily: font.regular,
      color: c.muted,
    },
    closeButton: {
      padding: 8,
      borderRadius: radius.sm,
    },
    cardBody: {
      flexGrow: 0,
    },
    cardBodyContent: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      gap: 20,
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: font.semibold,
      color: c.muted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    levelWrap: {
      alignSelf: "flex-start",
    },
    bodyText: {
      fontSize: 14,
      fontFamily: font.regular,
      color: c.textSecondary,
      lineHeight: 21,
    },
    cardFooter: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 54,
      paddingHorizontal: 18,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: "rgba(185, 74, 72, 0.3)",
      backgroundColor: c.card,
    },
    deleteButtonPressed: {
      backgroundColor: c.dangerTint,
    },
    deleteText: {
      fontSize: 16,
      fontFamily: font.semibold,
      color: c.danger,
    },
    editButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minHeight: 54,
      borderRadius: radius.md,
      backgroundColor: c.primary,
    },
    editButtonPressed: {
      opacity: 0.9,
    },
    editText: {
      fontSize: 16,
      fontFamily: font.semibold,
      color: c.white,
    },
  });
