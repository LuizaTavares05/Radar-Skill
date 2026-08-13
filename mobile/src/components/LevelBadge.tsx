import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import type { Nivel } from "../types";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";

function config(c: Paleta): Record<Nivel, { bg: string; text: string; dot: string }> {
  return {
    Iniciante: { bg: c.surface, text: c.textSecondary, dot: c.muted },
    Intermediário: { bg: "rgba(46, 125, 91, 0.10)", text: c.success, dot: c.success },
    Avançado: { bg: c.primaryTintStrong, text: c.primary, dot: c.primary },
  };
}

export default function LevelBadge({
  nivel,
  style,
}: {
  nivel: Nivel;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const c = config(colors)[nivel];

  return (
    <View style={[styles.badge, style, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[styles.text, { color: c.text }]}>{nivel}</Text>
    </View>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.full,
      alignSelf: "flex-start",
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: radius.full,
    },
    text: {
      fontSize: 12,
      fontFamily: font.semibold,
    },
  });
