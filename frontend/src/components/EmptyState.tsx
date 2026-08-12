import { Layers } from "lucide-react";

export default function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-5 shadow-inner">
        <Layers size={34} className="text-primary/40" />
      </div>
      <h3 className="text-xl font-bold text-text-secondary mb-2">
        {query ? `Nenhum resultado para "${query}"` : "Nenhuma skill adicionada ainda"}
      </h3>
      <p className="text-muted text-sm max-w-xs leading-relaxed">
        {query
          ? "Tente outra palavra-chave ou limpe a pesquisa para ver todas as skills."
          : 'Comece a montar sua stack de tecnologia clicando em "Adicionar Skill" acima.'}
      </p>
    </div>
  );
}
