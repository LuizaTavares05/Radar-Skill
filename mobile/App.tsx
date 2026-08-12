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
import {
  hidratar,
  limparNomeUsuario,
  limparToken,
  obterEmailUsuario,
  obterNomeUsuario,
  obterToken,
} from "./src/auth";
import { colors } from "./src/theme";

export default function App() {
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
    toast.info("Sessão encerrada", "Até logo!");
  };

  const currentPage: Page = page === "dashboard" && !emailUsuario ? "login" : page;

  if (!fontsLoaded || !hidratado) {
    return <View style={styles.boot} />;
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
    backgroundColor: colors.background,
  },
});
