import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, ShieldCheck, User, XCircle } from "lucide-react";
import Logo from "../components/Logo";
import FloatingInput from "../components/FloatingInput";
import { toast } from "../components/Toast";
import { cadastrar } from "../api/auth";
import { ApiError } from "../api/client";

function parseFieldErrors(message: string): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const part of message.split(",")) {
    const match = part.trim().match(/^([A-Za-z]+):\s*(.+)$/);
    if (!match) continue;
    const [, field, text] = match;
    if (field === "nome") errors.nome = text;
    else if (field === "email") errors.email = text;
    else if (field === "senha") errors.senha = text;
    else if (field === "confirmacaoSenha") errors.confirmacaoSenha = text;
  }
  return errors;
}

function forcaDaSenha(senha: string): { score: number; label: string; color: string } {
  let score = 0;
  if (senha.length >= 8) score++;
  if (senha.length >= 12) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^A-Za-z0-9]/.test(senha)) score++;
  if (score <= 1) return { score, label: "Fraca", color: "#B94A48" };
  if (score <= 2) return { score, label: "Regular", color: "#B7791F" };
  if (score <= 3) return { score, label: "Boa", color: "#505D61" };
  if (score <= 4) return { score, label: "Forte", color: "#2E7D5B" };
  return { score: 5, label: "Muito forte", color: "#2E7D5B" };
}

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const forca = forcaDaSenha(senha);
  const validations = [
    { label: "Pelo menos 6 caracteres", ok: senha.length >= 6 },
    { label: "Uma letra maiúscula", ok: /[A-Z]/.test(senha) },
    { label: "Um número", ok: /[0-9]/.test(senha) },
    { label: "Um caractere especial", ok: /[^A-Za-z0-9]/.test(senha) },
  ];

  const validar = () => {
    const e: Record<string, string> = {};
    if (!nome) e.nome = "O nome é obrigatório";
    else if (nome.trim().length < 3) e.nome = "O nome deve ter pelo menos 3 caracteres";
    if (!email) e.email = "O e-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Digite um e-mail válido";
    if (!senha) e.senha = "A senha é obrigatória";
    else if (senha.length < 6) e.senha = "A senha deve ter pelo menos 6 caracteres";
    else if (senha.length > 255) e.senha = "A senha deve ter no máximo 255 caracteres";
    if (!confirmacaoSenha) e.confirmacaoSenha = "Confirme sua senha";
    else if (senha !== confirmacaoSenha) e.confirmacaoSenha = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const fazerCadastro = async () => {
    if (!validar()) return;
    setCarregando(true);
    try {
      await cadastrar({ nome: nome.trim(), email, senha, confirmacaoSenha });
      toast.success("Conta criada!", "Sua conta foi criada com sucesso.");
      navigate("/login", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          toast.error("E-mail em uso", error.message);
        } else if (error.status === 400) {
          const fieldErrors = parseFieldErrors(error.message);
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          } else {
            toast.error("Não foi possível criar a conta", error.message);
          }
        } else {
          toast.error("Não foi possível criar a conta", error.message);
        }
      } else {
        toast.error("Erro de conexão", "Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex flex-col flex-1 relative bg-gradient-to-br from-primary via-primary-via to-primary-hover overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="dots-reg" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-reg)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col h-full min-h-0 p-12 overflow-y-auto">
          <Logo light />
          <div className="flex-1" />
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
              Junte-se a milhares de
              <br />
              desenvolvedores hoje.
            </h2>
            <p className="text-primary-lightest text-base leading-relaxed max-w-md">
              Crie sua conta e comece a gerenciar sua stack de tecnologia profissional em minutos.
            </p>
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
              <h1 className="text-3xl font-bold text-foreground mb-1">Criar conta</h1>
              <p className="text-text-secondary text-base">Junte-se ao Radar Skill hoje</p>
            </div>

            <div className="space-y-4">
              <FloatingInput
                label="Nome completo"
                type="text"
                value={nome}
                onChange={setNome}
                icon={User}
                error={errors.nome}
              />
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
              <FloatingInput
                label="Confirmar senha"
                type={mostrarConfirmacao ? "text" : "password"}
                value={confirmacaoSenha}
                onChange={setConfirmacaoSenha}
                icon={ShieldCheck}
                rightIcon={mostrarConfirmacao ? <EyeOff size={18} /> : <Eye size={18} />}
                onRightIconClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                error={errors.confirmacaoSenha}
              />

              {senha.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-secondary">Força da senha</span>
                    <span className="text-xs font-bold" style={{ color: forca.color }}>
                      {forca.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i <= forca.score ? forca.color : "var(--color-border)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 pt-0.5">
                    {validations.map((v) => (
                      <div key={v.label} className="flex items-center gap-1.5">
                        {v.ok ? (
                          <CheckCircle2 size={12} className="text-success flex-shrink-0" />
                        ) : (
                          <XCircle size={12} className="text-muted/40 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs leading-none ${v.ok ? "text-success" : "text-muted"}`}
                        >
                          {v.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={fazerCadastro}
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-primary to-primary-hover shadow-[0_4px_14px_rgba(10,78,119,0.35)] hover:shadow-[0_6px_22px_rgba(10,78,119,0.48)] hover:scale-[1.015] active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 mt-2"
              >
                {carregando && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {carregando ? "Criando conta..." : "Criar conta"}
              </button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted font-medium">já tem uma conta?</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-2xl font-semibold text-primary border-2 border-primary/25 hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10 transition-all duration-200"
              >
                Voltar para o login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
