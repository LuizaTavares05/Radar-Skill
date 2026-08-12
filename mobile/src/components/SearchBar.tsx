import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ChevronDown, Filter, Search, X } from "lucide-react-native";
import type { FiltroNivel } from "../types";
import { NIVEIS } from "../types";
import { colors, font, radius } from "../theme";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filtroNivel: FiltroNivel;
  aoMudarFiltro: (nivel: FiltroNivel) => void;
  counts: Record<string, number>;
};

const OPCOES_FILTRO: FiltroNivel[] = ["Todos", ...NIVEIS];

export default function SearchBar({
  search,
  onSearchChange,
  filtroNivel,
  aoMudarFiltro,
  counts,
}: SearchBarProps) {
  const [filtroAberto, setFiltroAberto] = useState(false);
  const estaFiltrado = filtroNivel !== "Todos";

  return (
    <View style={styles.row}>
      <View style={styles.searchWrap}>
        <Search size={18} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={onSearchChange}
          placeholder="Pesquisar skills, tecnologias, categorias."
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          accessibilityLabel="Pesquisar skills"
        />
        {search.length > 0 && (
          <Pressable
            onPress={() => onSearchChange("")}
            hitSlop={8}
            style={styles.clearButton}
            accessibilityLabel="Limpar pesquisa"
          >
            <X size={16} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <View style={styles.filterWrap}>
        <Pressable
          onPress={() => setFiltroAberto((aberto) => !aberto)}
          style={[styles.filterButton, estaFiltrado && styles.filterButtonActive]}
          accessibilityLabel="Filtrar por nível"
        >
          <Filter size={16} color={estaFiltrado ? colors.primary : colors.textSecondary} />
          <Text style={[styles.filterLabel, estaFiltrado && styles.filterLabelActive]}>
            {estaFiltrado ? filtroNivel : "Todos os níveis"}
          </Text>
          <ChevronDown
            size={14}
            color={estaFiltrado ? colors.primary : colors.textSecondary}
            style={filtroAberto ? styles.chevronOpen : undefined}
          />
        </Pressable>

        {filtroAberto && (
          <View style={styles.panel}>
            {OPCOES_FILTRO.map((nivel) => {
              const selecionado = filtroNivel === nivel;
              return (
                <Pressable
                  key={nivel}
                  onPress={() => {
                    aoMudarFiltro(nivel);
                    setFiltroAberto(false);
                  }}
                  style={[styles.option, selecionado && styles.optionActive]}
                >
                  <Text style={[styles.optionLabel, selecionado && styles.optionLabelActive]}>
                    {nivel === "Todos" ? "Todos os níveis" : nivel}
                  </Text>
                  <View style={[styles.countBadge, selecionado && styles.countBadgeActive]}>
                    <Text style={[styles.countText, selecionado && styles.countTextActive]}>
                      {counts[nivel] ?? 0}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: font.regular,
    color: colors.foreground,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 2,
    marginLeft: 6,
  },
  filterWrap: {
    position: "relative",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: "rgba(10, 78, 119, 0.05)",
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.textSecondary,
  },
  filterLabelActive: {
    color: colors.primary,
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  panel: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: 8,
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 4,
    zIndex: 30,
    shadowColor: colors.foreground,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionActive: {
    backgroundColor: "rgba(10, 78, 119, 0.05)",
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: font.medium,
    color: colors.textSecondary,
  },
  optionLabelActive: {
    color: colors.primary,
    fontFamily: font.semibold,
  },
  countBadge: {
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  countBadgeActive: {
    backgroundColor: "rgba(10, 78, 119, 0.10)",
  },
  countText: {
    fontSize: 12,
    fontFamily: font.medium,
    color: colors.muted,
  },
  countTextActive: {
    color: colors.primary,
  },
});
