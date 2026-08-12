import { Code2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";

export default function Logo({ light = false }: { light?: boolean }) {
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

const styles = StyleSheet.create({
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
    color: colors.white,
  },
  textDark: {
    color: colors.foreground,
  },
});
