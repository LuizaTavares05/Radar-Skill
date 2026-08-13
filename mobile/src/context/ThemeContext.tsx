import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { obterLembrarPersistidoAsync } from "../auth";
import { buildColors } from "../theme";
import type { Paleta } from "../theme";

export type Tema = "light" | "dark";

const CHAVE_TEMA = "radar.theme";

type ThemeContextValue = {
  tema: Tema;
  isDark: boolean;
  pronto: boolean;
  alternarTema: () => void;
  definirTema: (tema: Tema) => void;
  colors: Paleta;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema | null>(null);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const [salvo, lembrar] = await Promise.all([
        AsyncStorage.getItem(CHAVE_TEMA),
        obterLembrarPersistidoAsync(),
      ]);
      if (!ativo) return;
      if (!lembrar) {
        AsyncStorage.removeItem(CHAVE_TEMA).catch(() => {});
        setTema("light");
        return;
      }
      setTema(salvo === "dark" ? "dark" : "light");
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const isDark = tema === "dark";
  const colors = useMemo(() => buildColors(isDark), [isDark]);

  const persistirTema = (t: Tema) => {
    obterLembrarPersistidoAsync().then((lembrar) => {
      if (lembrar) AsyncStorage.setItem(CHAVE_TEMA, t).catch(() => {});
      else AsyncStorage.removeItem(CHAVE_TEMA).catch(() => {});
    });
  };

  const alternarTema = () => {
    setTema((atual) => {
      const proximo = (atual ?? "light") === "dark" ? "light" : "dark";
      persistirTema(proximo);
      return proximo;
    });
  };

  const definirTema = (t: Tema) => {
    setTema(t);
    persistirTema(t);
  };

  return (
    <ThemeContext.Provider
      value={{
        tema: isDark ? "dark" : "light",
        isDark,
        pronto: tema !== null,
        alternarTema,
        definirTema,
        colors,
      }}
    >
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
