import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getEditalById } from "@/data/mockEditais";
import { cn } from "@/lib/utils";

export function EditaisDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const edital = id ? getEditalById(id) : null;

  if (!edital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Edital não encontrado</h1>
          <Button onClick={() => navigate("/marketplace")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const handleInscrever = () => {
    navigate(`/editais/${id}/inscrever`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{edital.titulo}</h1>
            <p className="text-sm text-muted-foreground">{edital.organizador}</p>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Card de destaque roxo */}
        <Card
          className={cn(
            "border-2 bg-gradient-to-br from-purple-50 to-violet-50",
            "border-purple-300 shadow-lg"
          )}
        >
          <CardContent className="pt-6 space-y-6">
            {/* Badge e título */}
            <div className="space-y-3">
              <Badge className="bg-violet-600 text-white hover:bg-violet-700">
                Inscrições abertas
              </Badge>
              <h2 className="text-3xl font-bold text-foreground">
                {edital.titulo} — {edital.linguagem}
              </h2>
              <p className="text-base text-muted-foreground">
                Publicado por: <span className="font-semibold">{edital.organizador}</span>
              </p>
            </div>

            {/* Grid de 3 métricas */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-primary/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-pe-blue-dark">
                  R$ {(edital.valorTotal / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-muted-foreground mt-1">Valor total</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pe-blue-dark">
                  {edital.projetosSelecionados}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Projetos selecionados</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pe-blue-dark">
                  {edital.dataLimiteInscricao}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Prazo final</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção: Sobre o edital */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Sobre o edital</h3>
          <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
            {edital.descricao}
          </p>
        </section>

        {/* Seção: Documentos exigidos */}
        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">Documentos exigidos</h3>
          <ul className="space-y-3">
            {edital.documentosExigidos.map((doc, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted border border-border"
              >
                <span className="text-xl mt-0.5">📎</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {doc.label}
                    {doc.obrigatorio && <span className="text-destructive"> *</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {doc.formato} · Máx {doc.tamanhoMaximo}MB
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Seção: Critérios de avaliação */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Critérios de avaliação</h3>
          <div className="space-y-4">
            {edital.criteriosAvaliacao.map((criterio, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {criterio.criterio}
                  </p>
                  <span className="text-sm font-bold text-pe-blue-dark">
                    {criterio.peso}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-600"
                    style={{ width: `${criterio.peso}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Prazos */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Prazos</h3>
          <div className="relative p-6 rounded-lg bg-muted border border-border">
            <div className="flex items-center justify-between text-sm">
              {edital.prazos.map((prazo, idx) => (
                <div key={idx} className="text-center flex-1">
                  <p className="font-bold text-pe-blue-dark">{prazo.data}</p>
                  <p className="text-xs text-muted-foreground">{prazo.evento}</p>
                  {idx < edital.prazos.length - 1 && (
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-purple-300 to-transparent transform -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Botão fixo na base */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={handleInscrever}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-base font-semibold"
          >
            Inscrever meu projeto →
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditaisDetalhes;
