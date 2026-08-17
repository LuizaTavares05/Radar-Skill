import { useMemo } from "react";
import { LogOut } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function primeiroNome(nome: string, email: string): string {
  const completo = nome.trim();
  if (completo) {
    const primeiro = completo.split(/\s+/)[0];
    if (primeiro) return primeiro.charAt(0).toUpperCase() + primeiro.slice(1);
  }
  const local = email.split("@")[0] ?? "";
  if (!local) return email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function Header() {
  const { email, nome, sair } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const showUserInfo = width >= 500;
  const showLogoutLabel = width >= 420;
  const display = primeiroNome(nome ?? "", email ?? "");

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.inner}>
        <Logo />
        <View style={styles.right}>
          <View style={styles.userChip}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{display.charAt(0)}</Text>
            </View>
            {showUserInfo && (
              <View style={styles.userInfo}>
                <Text style={styles.nome} numberOfLines={1}>
                  {display}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            )}
          </View>
          <ThemeToggle />
          <Pressable
            onPress={sair}
            style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
            accessibilityLabel="Sair"
          >
            <LogOut size={16} color={colors.muted} />
            {showLogoutLabel && <Text style={styles.logoutText}>Sair</Text>}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    header: {
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      paddingBottom: 12,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    userChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: radius.sm,
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.border,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: c.white,
      fontSize: 12,
      fontFamily: font.bold,
    },
    userInfo: {
      maxWidth: 160,
    },
    nome: {
      fontSize: 12,
      fontFamily: font.semibold,
      color: c.foreground,
    },
    email: {
      marginTop: 2,
      fontSize: 11,
      fontFamily: font.regular,
      color: c.muted,
    },
    logout: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radius.sm,
    },
    logoutPressed: {
      backgroundColor: c.surface,
    },
    logoutText: {
      fontSize: 14,
      fontFamily: font.medium,
      color: c.muted,
    },
  });
