import { LogOut } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  nome: string;
  email: string;
  onLogout: () => void;
};

function primeiroNome(nome: string, email: string): string {
  const completo = nome.trim();
  if (completo) {
    const primeiro = completo.split(/\s+/)[0];
    if (primeiro) return primeiro.charAt(0).toUpperCase() + primeiro.slice(1);
  }
  const local = email.split("@")[0] ?? "";
  if (!local) return email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export default function Header({ nome, email, onLogout }: HeaderProps) {
  const display = primeiroNome(nome, email);
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-background border border-border">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {display.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-foreground leading-none">{display}</p>
              <p className="text-xs text-muted mt-0.5 leading-none">{email}</p>
            </div>
          </div>
          <ThemeToggle />
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-muted hover:text-foreground hover:bg-surface transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
