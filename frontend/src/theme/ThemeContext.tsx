import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { obterLembrarPersistido } from "../auth";

export type Tema = "light" | "dark";

const CHAVE_TEMA = "radar.theme";

type ThemeContextValue = {
  tema: Tema;
  alternarTema: () => void;
  definirTema: (tema: Tema) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function obterTemaInicial(): Tema {
  if (!obterLembrarPersistido()) return "light";
  return localStorage.getItem(CHAVE_TEMA) === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(obterTemaInicial);

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle("dark", tema === "dark");
    raiz.style.colorScheme = tema;
    if (obterLembrarPersistido()) localStorage.setItem(CHAVE_TEMA, tema);
    else localStorage.removeItem(CHAVE_TEMA);
  }, [tema]);

  const alternarTema = () => {
    setTema((atual) => (atual === "dark" ? "light" : "dark"));
  };

  const definirTema = (tema: Tema) => {
    setTema(tema);
  };

  return (
    <ThemeContext.Provider value={{ tema, alternarTema, definirTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return contexto;
}
