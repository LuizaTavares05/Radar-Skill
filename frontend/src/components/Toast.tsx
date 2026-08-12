import { useEffect, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

type TipoToast = "success" | "error" | "info";

type ItemToast = {
  id: number;
  type: TipoToast;
  titulo: string;
  descricao?: string;
};

type Listener = (toasts: ItemToast[]) => void;

let listeners: Listener[] = [];
let itensToast: ItemToast[] = [];
let proximoId = 0;

const DURATION = 4000;

function emitir() {
  listeners.forEach((listener) => listener([...itensToast]));
}

function adicionar(type: TipoToast, titulo: string, descricao?: string) {
  const item: ItemToast = { id: ++proximoId, type, titulo, descricao };
  itensToast = [...itensToast, item];
  emitir();
  window.setTimeout(() => remover(item.id), DURATION);
}

function remover(id: number) {
  itensToast = itensToast.filter((item) => item.id !== id);
  emitir();
}

export const toast = {
  success: (titulo: string, descricao?: string) => adicionar("success", titulo, descricao),
  error: (titulo: string, descricao?: string) => adicionar("error", titulo, descricao),
  info: (titulo: string, descricao?: string) => adicionar("info", titulo, descricao),
};

const ICONS: Record<TipoToast, { icon: typeof CheckCircle2; className: string; accent: string }> = {
  success: {
    icon: CheckCircle2,
    className: "text-success",
    accent: "border-success",
  },
  error: {
    icon: XCircle,
    className: "text-danger",
    accent: "border-danger",
  },
  info: {
    icon: Info,
    className: "text-primary",
    accent: "border-primary",
  },
};

export default function Toaster() {
  const [items, setItems] = useState<ItemToast[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      listeners = listeners.filter((listener) => listener !== setItems);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
      {items.map((item) => {
        const config = ICONS[item.type];
        const Icon = config.icon;
        return (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto bg-card rounded-xl border border-border shadow-lg shadow-foreground/5 overflow-hidden animate-[toastIn_0.2s_ease-out] border-l-4 ${config.accent}`}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <Icon size={20} className={`mt-0.5 flex-shrink-0 ${config.className}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{item.titulo}</p>
                {item.descricao && (
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.descricao}</p>
                )}
              </div>
              <button
                onClick={() => remover(item.id)}
                className="text-muted hover:text-foreground transition-colors flex-shrink-0 p-0.5"
                aria-label="Fechar notificação"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
