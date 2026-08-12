import { Layers } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";

export default function EmptyState({ query }: { query: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Layers size={34} color="rgba(10, 78, 119, 0.4)" />
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

const styles = StyleSheet.create({
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
    backgroundColor: "rgba(10, 78, 119, 0.05)",
  },
  title: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },
});
