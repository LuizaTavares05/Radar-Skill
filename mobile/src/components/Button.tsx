import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isPrimary = variant === "primary";

  const inner = (
    <View style={styles.content}>
      {loading && (
        <ActivityIndicator size="small" color={isPrimary ? colors.white : colors.primary} />
      )}
      <Text style={[styles.title, isPrimary ? styles.titlePrimary : styles.titleOutline]}>
        {title}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? null : styles.outlineBorder,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryHover]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          {inner}
        </LinearGradient>
      ) : (
        inner
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    overflow: "hidden",
    minHeight: 54,
  },
  fill: {
    flex: 1,
  },
  outlineBorder: {
    borderWidth: 2,
    borderColor: "rgba(10, 78, 119, 0.25)",
    backgroundColor: colors.card,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: font.semibold,
  },
  titlePrimary: {
    color: colors.white,
  },
  titleOutline: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
