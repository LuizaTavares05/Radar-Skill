import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { CheckCircle2, Eye, EyeOff, ShieldCheck, User, XCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import BrandPanel from "../components/BrandPanel";
import { toast } from "../components/Toast";
import { cadastrar } from "../api/auth";
import { ApiError } from "../api/client";

type RegisterProps = {
  onRegistered: () => void;
  onGoLogin: () => void;
};

function forcaDaSenha(senha: string): { score: number; label: string; color: string } {
  let score = 0;
  if (senha.length >= 8) score++;
  if (senha.length >= 12) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^A-Za-z0-9]/.test(senha)) score++;
  if (score <= 1) return { score, label: "Fraca", color: "#B94A48" };
  if (score <= 2) return { score, label: "Regular", color: "#B7791F" };
  if (score <= 3) return { score, label: "Boa", color: "#505D61" };
  if (score <= 4) return { score, label: "Forte", color: "#2E7D5B" };
  return { score: 5, label: "Muito forte", color: "#2E7D5B" };
}

function parseFieldErrors(message: string): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const part of message.split(",")) {
    const match = part.trim().match(/^([A-Za-z]+):\s*(.+)$/);
    if (!match) continue;
    const [, field, text] = match;
    if (field === "nome") errors.nome = text;
    else if (field === "email") errors.email = text;
    else if (field === "senha") errors.senha = text;
    else if (field === "confirmacaoSenha") errors.confirmacaoSenha = text;
  }
  return errors;
}

export default function Register({ onRegistered, onGoLogin }: RegisterProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const forca = forcaDaSenha(senha);
  const validations = [
    { label: "Pelo menos 6 caracteres", ok: senha.length >= 6 },
    { label: "Uma letra maiúscula", ok: /[A-Z]/.test(senha) },
    { label: "Um número", ok: /[0-9]/.test(senha) },
    { label: "Um caractere especial", ok: /[^A-Za-z0-9]/.test(senha) },
  ];

  const validar = () => {
    const next: Record<string, string> = {};
    if (!nome) next.nome = "O nome é obrigatório";
    else if (nome.trim().length < 3) next.nome = "O nome deve ter pelo menos 3 caracteres";
    if (!email) next.email = "O e-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Digite um e-mail válido";
    if (!senha) next.senha = "A senha é obrigatória";
    else if (senha.length < 6) next.senha = "A senha deve ter pelo menos 6 caracteres";
    else if (senha.length > 255) next.senha = "A senha deve ter no máximo 255 caracteres";
    if (!confirmacaoSenha) next.confirmacaoSenha = "Confirme sua senha";
    else if (senha !== confirmacaoSenha) next.confirmacaoSenha = "As senhas não coincidem";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const fazerCadastro = async () => {
    if (!validar()) return;
    setCarregando(true);
    try {
      await cadastrar({ nome: nome.trim(), email, senha, confirmacaoSenha });
      toast.success("Conta criada!", "Sua conta foi criada com sucesso.");
      onRegistered();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          toast.error("E-mail em uso", error.message);
        } else if (error.status === 400) {
          const fieldErrors = parseFieldErrors(error.message);
          if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
          else toast.error("Não foi possível criar a conta", error.message);
        } else {
          toast.error("Não foi possível criar a conta", error.message);
        }
      } else {
        toast.error("Erro de conexão", "Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const form = (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.heading}>Criar conta</Text>
        <Text style={styles.subheading}>Junte-se ao Radar Skill hoje</Text>
      </View>

      <View style={styles.formFields}>
        <Input
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          icon={User}
          autoComplete="name"
          error={errors.nome}
        />
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          icon={User}
          keyboardType="email-address"
          autoComplete="email"
          error={errors.email}
        />
        <Input
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          icon={ShieldCheck}
          secureTextEntry={!mostrarSenha}
          autoComplete="new-password"
          rightIcon={
            mostrarSenha ? <EyeOff size={18} color={colors.muted} /> : <Eye size={18} color={colors.muted} />
          }
          onRightIconPress={() => setMostrarSenha((v) => !v)}
          error={errors.senha}
        />
        <Input
          label="Confirmar senha"
          value={confirmacaoSenha}
          onChangeText={setConfirmacaoSenha}
          icon={ShieldCheck}
          secureTextEntry={!mostrarConfirmacao}
          autoComplete="new-password"
          rightIcon={
            mostrarConfirmacao ? <EyeOff size={18} color={colors.muted} /> : <Eye size={18} color={colors.muted} />
          }
          onRightIconPress={() => setMostrarConfirmacao((v) => !v)}
          error={errors.confirmacaoSenha}
        />

        {senha.length > 0 && (
          <View style={styles.strengthCard}>
            <View style={styles.strengthHeader}>
              <Text style={styles.strengthTitle}>Força da senha</Text>
              <Text style={[styles.strengthLabel, { color: forca.color }]}>{forca.label}</Text>
            </View>
            <View style={styles.strengthBars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.strengthBar,
                    { backgroundColor: i <= forca.score ? forca.color : colors.border },
                  ]}
                />
              ))}
            </View>
            <View style={styles.checklist}>
              {validations.map((item) => (
                <View key={item.label} style={styles.checkItem}>
                  {item.ok ? (
                    <CheckCircle2 size={12} color={colors.success} />
                  ) : (
                    <XCircle size={12} color={colors.muted} />
                  )}
                  <Text
                    style={[
                      styles.checkText,
                      item.ok ? styles.checkTextOk : styles.checkTextMuted,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Button
          title={carregando ? "Criando conta..." : "Criar conta"}
          loading={carregando}
          onPress={fazerCadastro}
          disabled={carregando}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>já tem uma conta?</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button variant="outline" title="Voltar para o login" onPress={onGoLogin} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {isWide ? (
        <View style={styles.split}>
          <BrandPanel
            title={"Junte-se a milhares de\ndesenvolvedores hoje."}
            subtitle={
              "Crie sua conta e comece a gerenciar sua stack de tecnologia profissional em minutos."
            }
          />
          <ScrollView
            style={styles.formPanel}
            contentContainerStyle={styles.formPanelContent}
            keyboardShouldPersistTaps="handled"
          >
            {form}
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          style={styles.mobileScreen}
          contentContainerStyle={styles.mobileContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mobileLogo}>
            <Logo />
          </View>
          {form}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const createStyles = (c: Paleta) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    split: {
      flex: 1,
      flexDirection: "row",
    },
    formPanel: {
      flex: 1,
      maxWidth: 500,
      backgroundColor: c.background,
    },
    formPanelContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 48,
    },
    mobileScreen: {
      flex: 1,
      backgroundColor: c.background,
    },
    mobileContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingVertical: 40,
    },
    mobileLogo: {
      marginBottom: 32,
    },
    formContainer: {
      width: "100%",
      maxWidth: 384,
      alignSelf: "center",
    },
    formHeader: {
      marginBottom: 32,
    },
    heading: {
      fontSize: 28,
      fontFamily: font.bold,
      color: c.foreground,
      marginBottom: 4,
    },
    subheading: {
      fontSize: 16,
      fontFamily: font.regular,
      color: c.textSecondary,
    },
    formFields: {
      gap: 16,
    },
    strengthCard: {
      backgroundColor: c.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      padding: 16,
      gap: 12,
    },
    strengthHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    strengthTitle: {
      fontSize: 12,
      fontFamily: font.semibold,
      color: c.textSecondary,
    },
    strengthLabel: {
      fontSize: 12,
      fontFamily: font.bold,
    },
    strengthBars: {
      flexDirection: "row",
      gap: 4,
    },
    strengthBar: {
      flex: 1,
      height: 6,
      borderRadius: radius.full,
    },
    checklist: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 6,
      columnGap: 12,
    },
    checkItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      width: "47%",
    },
    checkText: {
      fontSize: 12,
      fontFamily: font.regular,
    },
    checkTextOk: {
      color: c.success,
    },
    checkTextMuted: {
      color: c.muted,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 4,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.border,
    },
    dividerText: {
      fontSize: 12,
      fontFamily: font.medium,
      color: c.muted,
    },
  });
