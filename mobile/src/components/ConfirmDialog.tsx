import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { colors, font, radius } from "../theme";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  skillName: string;
};

export default function ConfirmDialog({ open, onClose, onConfirm, skillName }: ConfirmDialogProps) {
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

const styles = StyleSheet.create({
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
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 28,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(185, 74, 72, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.foreground,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  strong: {
    fontFamily: font.semibold,
    color: colors.foreground,
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
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  deleteText: {
    fontSize: 15,
    fontFamily: font.semibold,
    color: colors.white,
  },
  disabled: {
    opacity: 0.6,
  },
});
