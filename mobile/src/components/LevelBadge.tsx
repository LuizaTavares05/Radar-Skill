import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import type { Nivel } from "../types";
import { colors, font, radius } from "../theme";

const CONFIG: Record<Nivel, { bg: string; text: string; dot: string }> = {
  Iniciante: { bg: colors.surface, text: colors.textSecondary, dot: colors.muted },
  Intermediário: { bg: "rgba(46, 125, 91, 0.10)", text: colors.success, dot: colors.success },
  Avançado: { bg: "rgba(10, 78, 119, 0.10)", text: colors.primary, dot: colors.primary },
};

export default function LevelBadge({
  nivel,
  style,
}: {
  nivel: Nivel;
  style?: StyleProp<ViewStyle>;
}) {
  const config = CONFIG[nivel];
  return (
    <View style={[styles.badge, style, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.text, { color: config.text }]}>{nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
