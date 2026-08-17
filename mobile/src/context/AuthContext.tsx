import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  hidratar,
  limparNomeUsuario,
  limparToken,
  obterEmailUsuario,
  obterNomeUsuario,
  obterToken,
} from "../auth";

type AuthContextValue = {
  email: string | null;
  nome: string | null;
  pronto: boolean;
  fazerLogin: (email: string, nome: string) => void;
  sair: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    hidratar()
      .then(() => {
        const token = obterToken();
        const emailUsuario = obterEmailUsuario();
        if (token && emailUsuario) {
          setEmail(emailUsuario);
          setNome(obterNomeUsuario());
        }
      })
      .finally(() => setPronto(true));
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
    <AuthContext.Provider value={{ email, nome, pronto, fazerLogin, sair }}>
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
