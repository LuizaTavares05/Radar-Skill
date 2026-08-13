import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { tema, alternarTema } = useTheme();
  const escuro = tema === "dark";

  return (
    <button
      onClick={alternarTema}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-all duration-200"
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      title={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {escuro ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
