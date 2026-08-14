import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Check, Eye, EyeOff, ShieldCheck, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { font, radius } from "../theme";
import type { Paleta } from "../theme";
import { useTheme } from "../context/ThemeContext";
import Input from "../components/Input";
import Button from "../components/Button";
import BrandPanel from "../components/BrandPanel";
import { toast } from "../components/Toast";
import { entrar } from "../api/auth";
import { ApiError } from "../api/client";
import {
  limparEmailUsuario,
  limparLembrar,
  limparSenha,
  obterEmailUsuario,
  obterLembrar,
  obterSenha,
  salvarEmailUsuario,
  salvarLembrar,
  salvarNomeUsuario,
  salvarSenha,
  salvarToken,
} from "../auth";

type LoginProps = {
  onLogin: (email: string, nome: string) => void;
  onGoRegister: () => void;
};

function StatsCards() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.stats}>
      {[
        { v: "150+", l: "Tecnologias" },
        { v: "12K+", l: "Desenvolvedores" },
        { v: "98K+", l: "Skills Rastreadas" },
      ].map((stat) => (
        <View key={stat.l} style={styles.statCard}>
          <Text style={styles.statValue}>{stat.v}</Text>
          <Text style={styles.statLabel}>{stat.l}</Text>
        </View>
      ))}
    </View>
  );
}

export default function Login({ onLogin, onGoRegister }: LoginProps) {
  const { colors, isDark, definirTema } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (obterLembrar()) {
      setEmail(obterEmailUsuario() ?? "");
      setSenha(obterSenha() ?? "");
      setLembrar(true);
    }
  }, []);

  const validar = () => {
    const next: Record<string, string> = {};
    if (!email) next.email = "O e-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Digite um e-mail válido";
    if (!senha) next.senha = "A senha é obrigatória";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const fazerLogin = async () => {
    if (!validar()) return;
    setCarregando(true);
    try {
      const res = await entrar({ email, senha });
      const nome = res.nome ?? "";
      salvarToken(res.token, lembrar);
      salvarEmailUsuario(email.trim(), lembrar);
      salvarNomeUsuario(nome, lembrar);
      salvarSenha(senha, lembrar);
      salvarLembrar(lembrar);
      if (!lembrar) definirTema("light");
      onLogin(email.trim(), nome);
      toast.success("Bem-vindo de volta!", `Você entrou como ${email.trim()}.`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erro ao conectar ao servidor.";
      toast.error("Falha no login", message);
    } finally {
      setCarregando(false);
    }
  };

  const alternarLembrar = () => {
    setLembrar((v) => {
      const proximo = !v;
      if (!proximo) {
        limparSenha();
        limparEmailUsuario();
        limparLembrar();
        definirTema("light");
      }
      return proximo;
    });
  };

  const form = (
    <View style={styles.formContainer}>
      <View style={styles.formHeader}>
        <Text style={styles.heading}>Bem-vindo de volta</Text>
        <Text style={styles.subheading}>Acesse sua conta no Radar Skill</Text>
      </View>

      <View style={styles.formFields}>
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
          autoComplete="password"
          rightIcon={
            mostrarSenha ? <EyeOff size={18} color={colors.muted} /> : <Eye size={18} color={colors.muted} />
          }
          onRightIconPress={() => setMostrarSenha((v) => !v)}
          error={errors.senha}
        />

        <View style={styles.rowBetween}>
          <PressableCheckbox label="Lembrar de mim" checked={lembrar} onToggle={alternarLembrar} />
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
        </View>

        <Button title={carregando ? "Entrando..." : "Entrar"} loading={carregando} onPress={fazerLogin} disabled={carregando} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button variant="outline" title="Criar conta" onPress={onGoRegister} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {isWide ? (
        <View style={styles.split}>
          <BrandPanel
            title={"Gerencie sua stack de tecnologia\ncom precisão."}
            subtitle={
              "Acompanhe skills, versões e níveis de proficiência. Fique à frente da sua evolução como desenvolvedor."
            }
          >
            <StatsCards />
          </BrandPanel>
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
          <View style={styles.mobileBrand}>
            <BrandPanel
              compact
              title={"Gerencie sua stack de tecnologia\ncom precisão."}
              subtitle={
                "Acompanhe skills, versões e níveis de proficiência. Fique à frente da sua evolução como desenvolvedor."
              }
            >
              <StatsCards />
            </BrandPanel>
          </View>
          {form}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function PressableCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.checkboxRow}>
      <Pressable onPress={onToggle} style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Check size={11} color={colors.white} strokeWidth={3} />}
      </Pressable>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
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
    mobileBrand: {
      width: "100%",
      maxWidth: 384,
      alignSelf: "center",
      marginBottom: 28,
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
    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 4,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.card,
    },
    checkboxChecked: {
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
    checkboxLabel: {
      fontSize: 14,
      fontFamily: font.regular,
      color: c.textSecondary,
    },
    forgot: {
      fontSize: 14,
      fontFamily: font.medium,
      color: c.primary,
      opacity: 0.7,
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
    stats: {
      flexDirection: "row",
      gap: 16,
      marginTop: 32,
      flexWrap: "wrap",
    },
    statCard: {
      backgroundColor: "rgba(255, 255, 255, 0.10)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.20)",
      borderRadius: radius.md,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    statValue: {
      fontSize: 18,
      fontFamily: font.bold,
      color: c.white,
    },
    statLabel: {
      marginTop: 2,
      fontSize: 12,
      fontFamily: font.medium,
      color: c.primaryLightest,
    },
  });
