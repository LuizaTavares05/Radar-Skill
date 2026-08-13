import { useMemo } from "react";
import { Code2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";

export default function Logo({ light = false }: { light?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.row}>
      <LinearGradient colors={[colors.primary, colors.primaryHover]} style={styles.box}>
        <Code2 size={18} color={colors.white} strokeWidth={2.2} />
      </LinearGradient>
      <Text style={[styles.text, light ? styles.textLight : styles.textDark]}>
        Radar<Text style={{ color: light ? colors.primaryLightest : colors.primary }}>Skill</Text>
      </Text>
    </View>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    box: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 20,
      fontFamily: font.bold,
      letterSpacing: -0.5,
    },
    textLight: {
      color: c.white,
    },
    textDark: {
      color: c.foreground,
    },
  });
