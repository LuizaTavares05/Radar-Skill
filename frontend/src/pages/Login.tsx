import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import Logo from "../components/Logo";
import FloatingInput from "../components/FloatingInput";
import { toast } from "../components/Toast";
import { entrar } from "../api/auth";
import {
  limparEmailUsuario,
  limparLembrar,
  limparSenha,
  obterEmailUsuario,
  obterLembrarPersistido,
  obterSenha,
  salvarEmailUsuario,
  salvarLembrar,
  salvarNomeUsuario,
  salvarSenha,
  salvarToken,
} from "../auth";
import { ApiError } from "../api/client";
import { useTheme } from "../theme/ThemeContext";

type LoginProps = {
  onLogin: (email: string, nome: string) => void;
  onGoRegister: () => void;
};

export default function Login({ onLogin, onGoRegister }: LoginProps) {
  const { definirTema } = useTheme();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (obterLembrarPersistido()) {
      setEmail(obterEmailUsuario() ?? "");
      setSenha(obterSenha() ?? "");
      setLembrar(true);
    }
  }, []);

  const validar = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "O e-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Digite um e-mail válido";
    if (!senha) e.senha = "A senha é obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex flex-col flex-1 relative bg-gradient-to-br from-primary via-primary-via to-primary-hover overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="dots-login" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-login)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col h-full min-h-0 p-12 overflow-y-auto">
          <Logo light />

          <div className="flex-1" />

          <div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
              Gerencie sua stack de tecnologia
              <br />
              com precisão.
            </h2>
            <p className="text-primary-lightest text-base leading-relaxed max-w-md mb-8">
              Acompanhe skills, versões e níveis de proficiência. Fique à frente da sua evolução como
              desenvolvedor.
            </p>
            <div className="flex gap-4 flex-wrap">
              {[
                { v: "150+", l: "Tecnologias" },
                { v: "12K+", l: "Desenvolvedores" },
                { v: "98K+", l: "Skills Rastreadas" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3"
                >
                  <div className="text-white font-bold text-lg">{s.v}</div>
                  <div className="text-primary-lightest text-xs font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:max-w-[500px] bg-background flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 py-12">
          <div className="max-w-sm mx-auto w-full">
            <div className="lg:hidden mb-8">
              <Logo />
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-1">Bem-vindo de volta</h1>
              <p className="text-text-secondary text-base">Acesse sua conta no Radar Skill</p>
            </div>

            <div className="space-y-4">
              <FloatingInput
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                icon={User}
                error={errors.email}
              />
              <FloatingInput
                label="Senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={setSenha}
                icon={ShieldCheck}
                rightIcon={mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                onRightIconClick={() => setMostrarSenha(!mostrarSenha)}
                error={errors.senha}
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={alternarLembrar}
                  className="flex items-center gap-2.5 group"
                  aria-pressed={lembrar}
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      lembrar
                        ? "bg-primary border-primary"
                        : "border-border group-hover:border-primary"
                    }`}
                  >
                    {lembrar && <Check size={11} color="white" strokeWidth={3} />}
                  </span>
                  <span className="text-sm text-text-secondary select-none">Lembrar de mim</span>
                </button>
                <span
                  className="text-sm text-primary font-medium cursor-not-allowed select-none opacity-70"
                  title="Indisponível"
                >
                  Esqueceu a senha?
                </span>
              </div>

              <button
                onClick={fazerLogin}
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-primary-hover shadow-[0_4px_14px_rgba(10,78,119,0.35)] hover:shadow-[0_6px_22px_rgba(10,78,119,0.48)] hover:scale-[1.015] active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-2"
              >
                {carregando && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {carregando ? "Entrando..." : "Entrar"}
              </button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-medium">ou</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={onGoRegister}
                className="w-full py-3.5 rounded-2xl font-semibold text-primary border-2 border-primary/25 hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10 transition-all duration-200"
              >
                Criar conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
