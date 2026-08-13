import { useEffect, useState } from "react";
import type { Page } from "./types";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Toaster, { toast } from "./components/Toast";
import { useTheme } from "./theme/ThemeContext";
import {
  limparNomeUsuario,
  limparToken,
  obterEmailUsuario,
  obterLembrarPersistido,
  obterNomeUsuario,
  restaurar,
} from "./auth";

export default function App() {
  const { definirTema } = useTheme();
  const [page, setPage] = useState<Page>("login");
  const [emailUsuario, setEmailUsuario] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);

  useEffect(() => {
    if (restaurar() && obterEmailUsuario()) {
      setEmailUsuario(obterEmailUsuario());
      setNomeUsuario(obterNomeUsuario());
      setPage("dashboard");
    }
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
    if (!obterLembrarPersistido()) definirTema("light");
    toast.info("Sessão encerrada", "Até logo!");
  };

  const currentPage: Page = page === "dashboard" && !emailUsuario ? "login" : page;

  return (
    <>
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
    </>
  );
}
