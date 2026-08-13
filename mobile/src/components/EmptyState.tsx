import { useMemo } from "react";
import { Layers } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";

export default function EmptyState({ query }: { query: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Layers size={34} color={colors.primarySoft} />
      </View>
      <Text style={styles.title}>
        {query ? `Nenhum resultado para "${query}"` : "Nenhuma skill adicionada ainda"}
      </Text>
      <Text style={styles.subtitle}>
        {query
          ? "Tente outra palavra-chave ou limpe a pesquisa para ver todas as skills."
          : 'Comece a montar sua stack de tecnologia clicando em "Adicionar Skill" acima.'}
      </Text>
    </View>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 96,
      paddingHorizontal: 24,
    },
    iconBox: {
      width: 80,
      height: 80,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      backgroundColor: c.primaryTint,
    },
    title: {
      fontSize: 20,
      fontFamily: font.bold,
      color: c.textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: font.regular,
      color: c.muted,
      textAlign: "center",
      maxWidth: 280,
      lineHeight: 20,
    },
  });
