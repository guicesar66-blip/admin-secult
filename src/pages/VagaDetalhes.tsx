import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, DollarSign, Calendar, Users, Briefcase, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVagaById } from "@/data/mockVagas";

const tipoColor = {
  presencial: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  remoto: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  hibrido: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
};

export default function VagaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vaga = id ? getVagaById(id) : null;

  if (!vaga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Vaga não encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/marketplace")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-2">{vaga.titulo}</h1>
                <p className="text-lg text-muted-foreground">{vaga.organizacao}</p>
              </div>
              <Badge
                variant="outline"
                className={`${tipoColor[vaga.tipo as keyof typeof tipoColor]} text-base px-3 py-1`}
              >
                {vaga.tipo}
              </Badge>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {vaga.local && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Local</p>
                    <p className="font-semibold">{vaga.local}</p>
                  </div>
                </div>
              )}
              {vaga.salario && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Salário</p>
                    <p className="font-semibold text-sm">
                      R$ {vaga.salario.minimo.toLocaleString("pt-BR")} - R${" "}
                      {vaga.salario.maximo.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Prazo</p>
                  <p className="font-semibold">{vaga.dataLimite}</p>
                </div>
              </div>
              {vaga.candidatos && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Candidatos</p>
                    <p className="font-semibold">{vaga.candidatos}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Descrição */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre a oportunidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">{vaga.descricao}</p>
            <div className="inline-block">
              <Badge>{vaga.linguagem}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilidades */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Responsabilidades principais</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {vaga.responsabilidades.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requisitos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">O que procuramos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {vaga.requisitos.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefícios */}
        {vaga.beneficios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">O que oferecemos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {vaga.beneficios.map((ben, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      ★
                    </div>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="flex gap-4 justify-center pb-8">
          <Button
            onClick={() => navigate("/marketplace?tab=vagas")}
            variant="outline"
            size="lg"
          >
            ← Voltar às vagas
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Candidatar-se agora →
          </Button>
        </div>
      </main>
    </div>
  );
}
