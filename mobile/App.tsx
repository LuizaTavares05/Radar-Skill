import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import type { Page } from "./src/types";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Dashboard from "./src/pages/Dashboard";
import Toaster, { toast } from "./src/components/Toast";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import {
  hidratar,
  limparNomeUsuario,
  limparToken,
  obterEmailUsuario,
  obterLembrarPersistidoAsync,
  obterNomeUsuario,
  obterToken,
} from "./src/auth";

function BootScreen() {
  const { colors } = useTheme();
  return <View style={[styles.boot, { backgroundColor: colors.background }]} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { pronto, definirTema } = useTheme();
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [hidratado, setHidratado] = useState(false);
  const [page, setPage] = useState<Page>("login");
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);

  useEffect(() => {
    hidratar()
      .then(() => {
        const token = obterToken();
        const email = obterEmailUsuario();
        if (token && email) {
          setEmailUsuario(email);
          setNomeUsuario(obterNomeUsuario());
          setPage("dashboard");
        }
      })
      .finally(() => setHidratado(true));
  }, []);

  const fazerLogin = (email: string, nome: string) => {
    setEmailUsuario(email);
    setNomeUsuario(nome);
    setPage("dashboard");
  };

  const sair = () => {
    limparToken();
    limparNomeUsuario();
    setEmailUsuario(null);
    setNomeUsuario(null);
    setPage("login");
    obterLembrarPersistidoAsync().then((lembrar) => {
      if (!lembrar) definirTema("light");
    });
    toast.info("Sessão encerrada", "Até logo!");
  };

  const currentPage: Page = page === "dashboard" && !emailUsuario ? "login" : page;

  if (!fontsLoaded || !hidratado || !pronto) {
    return <BootScreen />;
  }

  return (
    <SafeAreaProvider>
      <Toaster />
      {currentPage === "login" && (
        <Login onLogin={fazerLogin} onGoRegister={() => setPage("register")} />
      )}
      {currentPage === "register" && (
        <Register onRegistered={() => setPage("login")} onGoLogin={() => setPage("login")} />
      )}
      {currentPage === "dashboard" && emailUsuario && (
        <Dashboard email={emailUsuario} nome={nomeUsuario ?? ""} onLogout={sair} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
  },
});
