import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";
import type { EntradaSkill, Nivel, Skill, SkillCatalogo } from "../types";
import { NIVEIS } from "../types";
import { SKILL_CATALOG } from "../data/skills";
import { obterCatalogo } from "../api/skills";
import { obterToken } from "../auth";
import { colors, font, radius } from "../theme";
import LevelBadge from "./LevelBadge";
import SkillIcon from "./SkillIcon";

type SkillModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: EntradaSkill) => Promise<void>;
  editSkill?: Skill | null;
};

export default function SkillModal({ open, onClose, onSave, editSkill }: SkillModalProps) {
  const [catalogo, setCatalogo] = useState<SkillCatalogo[]>(SKILL_CATALOG);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [tecnologiaSelecionada, setTecnologiaSelecionada] = useState<SkillCatalogo | null>(null);
  const [nivel, setNivel] = useState<Nivel>("Intermediário");
  const [descricao, setDescricao] = useState("");
  const [tecnologiaAberta, setTecnologiaAberta] = useState(false);
  const [nivelAberto, setNivelAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCatalogoLoading(true);
    obterCatalogo(obterToken())
      .then((lista) => {
        if (cancelled) return;
        setCatalogo(lista.length > 0 ? lista : SKILL_CATALOG);
      })
      .catch(() => {
        if (!cancelled) setCatalogo(SKILL_CATALOG);
      })
      .finally(() => {
        if (!cancelled) setCatalogoLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const doCatalogo = catalogo.find((tech) => tech.nome === editSkill?.nome) ?? null;
    setTecnologiaSelecionada(
      doCatalogo ??
        (editSkill
          ? {
              id: 0,
              nome: editSkill.nome,
              categoria: editSkill.categoria,
              imagemUrl: editSkill.imagemUrl,
              descricao: editSkill.descricaoSkill ?? "",
            }
          : null),
    );
    setNivel(editSkill?.nivel ?? "Intermediário");
    setDescricao(editSkill?.descricao ?? "");
    setErrors({});
    setTecnologiaAberta(false);
    setNivelAberto(false);
    setSalvando(false);
  }, [open, editSkill, catalogo]);

  const fecharModal = () => {
    if (!salvando) onClose();
  };

  const validar = () => {
    const next: Record<string, string> = {};
    if (!tecnologiaSelecionada) next.tecnologia = "Selecione uma tecnologia";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const salvar = async () => {
    if (salvando) return;
    if (!validar() || (!tecnologiaSelecionada && !editSkill)) return;
    setSalvando(true);
    try {
      await onSave({
        skillId: editSkill ? undefined : tecnologiaSelecionada?.id,
        nivel,
        descricao: descricao.trim(),
      });
      onClose();
    } catch {
      // mantém o modal aberto; o erro já foi exibido pelo chamador
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={fecharModal}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={fecharModal} />
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>
                {editSkill ? "Editar Skill" : "Adicionar Nova Skill"}
              </Text>
              <Text style={styles.cardSubtitle}>
                {editSkill
                  ? "Atualize os detalhes da sua skill"
                  : "Adicione uma tecnologia à sua stack"}
              </Text>
            </View>
            <Pressable
              onPress={fecharModal}
              disabled={salvando}
              hitSlop={8}
              style={styles.closeButton}
              accessibilityLabel="Fechar"
            >
              <X size={20} color={colors.muted} />
            </Pressable>
          </View>

          <View style={styles.cardBody}>
            <View>
              <Text style={styles.label}>Tecnologia</Text>
              <Pressable
                onPress={() => {
                  setTecnologiaAberta(!tecnologiaAberta);
                  setNivelAberto(false);
                }}
                disabled={salvando}
                style={[
                  styles.selectButton,
                  tecnologiaAberta && styles.selectButtonActive,
                  !!errors.tecnologia && !tecnologiaAberta && styles.selectButtonError,
                  salvando && styles.disabledField,
                ]}
              >
                {tecnologiaSelecionada ? (
                  <View style={styles.linhaTecnologiaSelecionada}>
                    <View style={styles.caixaIconeTecnologia}>
                      <SkillIcon
                        nome={tecnologiaSelecionada.nome}
                        imagemUrl={tecnologiaSelecionada.imagemUrl}
                        size={28}
                      />
                    </View>
                    <Text style={styles.nomeTecnologiaSelecionada} numberOfLines={1}>
                      {tecnologiaSelecionada.nome}
                    </Text>
                    <View style={styles.chipCategoria}>
                      <Text style={styles.chipCategoriaText}>{tecnologiaSelecionada.categoria}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.selectPlaceholder}>Selecione uma tecnologia.</Text>
                )}
                <ChevronDown
                  size={16}
                  color={colors.muted}
                  style={tecnologiaAberta ? styles.chevronOpen : undefined}
                />
              </Pressable>
              {!!errors.tecnologia && <Text style={styles.errorText}>{errors.tecnologia}</Text>}
              {tecnologiaAberta && (
                <ScrollView style={styles.dropdown} keyboardShouldPersistTaps="handled">
                  {catalogoLoading ? (
                    <View style={styles.dropdownLoading}>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={styles.dropdownLoadingText}>Carregando catálogo...</Text>
                    </View>
                  ) : (
                    catalogo.map((tecnologia) => (
                      <Pressable
                        key={tecnologia.id}
                        onPress={() => {
                          setTecnologiaSelecionada(tecnologia);
                          setTecnologiaAberta(false);
                        }}
                        style={styles.dropdownOption}
                      >
                        <View style={styles.caixaIconeTecnologiaPequena}>
                          <SkillIcon
                            nome={tecnologia.nome}
                            imagemUrl={tecnologia.imagemUrl}
                            size={28}
                          />
                        </View>
                        <Text style={styles.nomeOpcao} numberOfLines={1}>
                          {tecnologia.nome}
                        </Text>
                        <Text style={styles.categoriaOpcao}>{tecnologia.categoria}</Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              )}
            </View>

            <View>
              <Text style={styles.label}>Nível de Proficiência</Text>
              <Pressable
                onPress={() => {
                  setNivelAberto(!nivelAberto);
                  setTecnologiaAberta(false);
                }}
                disabled={salvando}
                style={[
                  styles.selectButton,
                  nivelAberto && styles.selectButtonActive,
                  salvando && styles.disabledField,
                ]}
              >
                <LevelBadge nivel={nivel} style={styles.nivelNoBotao} />
                <ChevronDown
                  size={16}
                  color={colors.muted}
                  style={nivelAberto ? styles.chevronOpen : undefined}
                />
              </Pressable>
              {nivelAberto && (
                <View style={styles.dropdown}>
                  {NIVEIS.map((opcao) => (
                    <Pressable
                      key={opcao}
                      onPress={() => {
                        setNivel(opcao);
                        setNivelAberto(false);
                      }}
                      style={[styles.dropdownOption, nivel === opcao && styles.dropdownOptionActive]}
                    >
                      <LevelBadge nivel={opcao} />
                      {nivel === opcao && <Check size={14} color={colors.primary} />}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.textarea, salvando && styles.disabledField]}
                value={descricao}
                onChangeText={setDescricao}
                editable={!salvando}
                multiline
                placeholder="Descreva sua experiência com esta tecnologia. (opcional)"
                placeholderTextColor={colors.muted}
                textAlignVertical="top"
                accessibilityLabel="Descrição"
              />
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Pressable
              onPress={fecharModal}
              disabled={salvando}
              style={[styles.footerButton, styles.cancelButton, salvando && styles.disabledField]}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={salvar}
              disabled={salvando}
              style={[styles.footerButton, styles.saveButton, salvando && styles.disabledField]}
            >
              {salvando ? (
                <>
                  <Text style={styles.saveText}>
                    {editSkill ? "Salvando..." : "Adicionando..."}
                  </Text>
                </>
              ) : (
                <Text style={styles.saveText}>
                  {editSkill ? "Salvar Alterações" : "Adicionar Skill"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(38, 50, 56, 0.4)",
  },
  card: {
    width: "100%",
    maxWidth: 512,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.foreground,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.muted,
  },
  closeButton: {
    padding: 8,
    borderRadius: radius.sm,
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: font.semibold,
    color: colors.foreground,
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectButtonActive: {
    borderColor: colors.primary,
  },
  selectButtonError: {
    borderColor: colors.danger,
  },
  linhaTecnologiaSelecionada: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nivelNoBotao: {
    alignSelf: "center",
  },
  caixaIconeTecnologia: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  caixaIconeTecnologiaPequena: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  nomeTecnologiaSelecionada: {
    fontSize: 15,
    fontFamily: font.medium,
    color: colors.foreground,
    flexShrink: 1,
  },
  chipCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  chipCategoriaText: {
    fontSize: 12,
    fontFamily: font.medium,
    color: colors.muted,
  },
  selectPlaceholder: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.muted,
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    maxHeight: 224,
  },
  dropdownLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 20,
  },
  dropdownLoadingText: {
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.muted,
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionActive: {
    backgroundColor: "rgba(10, 78, 119, 0.05)",
  },
  nomeOpcao: {
    flex: 1,
    fontSize: 14,
    fontFamily: font.medium,
    color: colors.foreground,
  },
  categoriaOpcao: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.muted,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: colors.danger,
    fontFamily: font.medium,
  },
  textarea: {
    minHeight: 92,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 16,
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.foreground,
    lineHeight: 20,
  },
  disabledField: {
    opacity: 0.6,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: font.semibold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveText: {
    fontSize: 16,
    fontFamily: font.semibold,
    color: colors.white,
  },
});
