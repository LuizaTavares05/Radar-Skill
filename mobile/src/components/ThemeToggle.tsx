import { Moon, Sun } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../theme";

type ThemeToggleProps = {
  style?: StyleProp<ViewStyle>;
};

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { tema, alternarTema, colors } = useTheme();
  const escuro = tema === "dark";
  const Icone = escuro ? Sun : Moon;

  return (
    <Pressable
      onPress={alternarTema}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icone size={16} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
