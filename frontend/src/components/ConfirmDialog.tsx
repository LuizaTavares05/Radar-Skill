import { useState } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  skillName: string;
};

export default function ConfirmDialog({ open, onClose, onConfirm, skillName }: ConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!open) return null;

  const closeDialog = () => {
    if (!deleting) onClose();
  };

  const handleConfirm = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // mantém o diálogo aberto; o erro já foi exibido pelo chamador
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDialog} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm z-10 p-7 animate-[fadeInScale_0.18s_ease-out]">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-danger" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Excluir Skill</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Tem certeza que deseja remover{" "}
          <strong className="text-foreground font-semibold">{skillName}</strong> das suas skills?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={closeDialog}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border-2 border-border text-text-secondary font-semibold hover:bg-surface hover:border-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-danger text-white font-semibold hover:bg-danger-hover hover:shadow-lg hover:shadow-danger/20 active:bg-danger-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-danger disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {deleting && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
