import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  skillName: string;
};

export default function ConfirmDialog({ open, onClose, onConfirm, skillName }: ConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [deleting, setDeleting] = useState(false);

  const closeDialog = () => {
    if (!deleting) onClose();
  };

  const handleConfirm = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // mantém o diálogo aberto; o erro já foi exibido pelo chamador
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={closeDialog}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeDialog} />
        <View style={styles.card}>
          <View style={styles.iconBox}>
            <AlertTriangle size={22} color={colors.danger} />
          </View>
          <Text style={styles.title}>Excluir Skill</Text>
          <Text style={styles.message}>
            Tem certeza que deseja remover{" "}
            <Text style={styles.strong}>{skillName}</Text> das suas skills? Esta ação não pode ser
            desfeita.
          </Text>
          <View style={styles.footer}>
            <Pressable
              onPress={closeDialog}
              disabled={deleting}
              style={[styles.button, styles.cancelButton, deleting && styles.disabled]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              disabled={deleting}
              style={[styles.button, styles.deleteButton, deleting && styles.disabled]}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.deleteText}>Excluir</Text>
              )}
            </Pressable>
          </View>
        </View>
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
      maxWidth: 384,
      backgroundColor: c.card,
      borderRadius: radius.md,
      padding: 28,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: c.dangerTint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontFamily: font.bold,
      color: c.foreground,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      fontFamily: font.regular,
      color: c.textSecondary,
      lineHeight: 21,
      marginBottom: 24,
    },
    strong: {
      fontFamily: font.semibold,
      color: c.foreground,
    },
    footer: {
      flexDirection: "row",
      gap: 12,
    },
    button: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButton: {
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    cancelText: {
      fontSize: 15,
      fontFamily: font.semibold,
      color: c.textSecondary,
    },
    deleteButton: {
      backgroundColor: c.danger,
    },
    deleteText: {
      fontSize: 15,
      fontFamily: font.semibold,
      color: c.white,
    },
    disabled: {
      opacity: 0.6,
    },
  });
