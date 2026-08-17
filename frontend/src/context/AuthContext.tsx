import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  limparNomeUsuario,
  limparToken,
  obterEmailUsuario,
  obterNomeUsuario,
  restaurar,
} from "../auth";

type AuthContextValue = {
  email: string | null;
  nome: string | null;
  fazerLogin: (email: string, nome: string) => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);

  useEffect(() => {
    if (restaurar() && obterEmailUsuario()) {
      setEmail(obterEmailUsuario());
      setNome(obterNomeUsuario());
    }
  }, []);

  const fazerLogin = (email: string, nome: string) => {
    setEmail(email);
    setNome(nome);
  };

  const sair = () => {
    limparToken();
    limparNomeUsuario();
    setEmail(null);
    setNome(null);
  };

  return (
    <AuthContext.Provider value={{ email, nome, fazerLogin, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return contexto;
}
