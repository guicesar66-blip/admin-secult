import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, TrendingUp, Users, Briefcase, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

const dadosSociais = {
  totalPessoas: 2847,
  emIncubacao: 214,
  posIncubacao: 567,
  semIncubacao: 2066,
  meiFormalizados: 189,
  portfolioCompleto: 1245,
  mediaIdade: 28,
  genero: {
    masculino: 58,
    feminino: 40,
    outro: 2
  },
  escolaridade: {
    fundamental: 12,
    medio: 45,
    superior: 32,
    posGrad: 11
  },
  rendaMedia: {
    antes: 850,
    durante: 1200,
    depois: 2100
  }
};

const progressaoCarreira = [
  { etapa: "Cadastro Inicial", quantidade: 2847, percentual: 100 },
  { etapa: "Portfólio Completo", quantidade: 1245, percentual: 44 },
  { etapa: "Participou Incubação", quantidade: 781, percentual: 27 },
  { etapa: "Concluiu Incubação", quantidade: 567, percentual: 20 },
  { etapa: "MEI Formalizado", quantidade: 189, percentual: 7 },
  { etapa: "Renda Musical >2SM", quantidade: 134, percentual: 5 },
];

export default function AnaliseArtistas() {
  const [periodo, setPeriodo] = useState("ano");
  const [filtroIncubacao, setFiltroIncubacao] = useState("todos");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise de Pessoas
            </h2>
            <p className="text-sm text-muted-foreground">
              Impacto social e desenvolvimento do capital humano musical
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Status Incubação
              </label>
              <Select value={filtroIncubacao} onValueChange={setFiltroIncubacao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as pessoas</SelectItem>
                  <SelectItem value="em-incubacao">Em incubação</SelectItem>
                  <SelectItem value="pos-incubacao">Pós-incubação</SelectItem>
                  <SelectItem value="sem-incubacao">Sem incubação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Período
              </label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="trimestre">Último trimestre</SelectItem>
                  <SelectItem value="ano">Este ano</SelectItem>
                  <SelectItem value="total">Total acumulado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pessoas</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {dadosSociais.totalPessoas.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Incubação</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {dadosSociais.emIncubacao}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">MEIs Formalizados</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  {dadosSociais.meiFormalizados}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-warning" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfólio Completo</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {dadosSociais.portfolioCompleto}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Impacto na Renda */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Impacto no Desenvolvimento Econômico
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Renda Média Antes</p>
              <p className="text-3xl font-bold text-foreground">
                R$ {dadosSociais.rendaMedia.antes}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pré-incubação</p>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-lg border-2 border-warning/30">
              <p className="text-sm text-muted-foreground mb-2">Renda Média Durante</p>
              <p className="text-3xl font-bold text-warning">
                R$ {dadosSociais.rendaMedia.durante}
              </p>
              <p className="text-xs text-success mt-1">↗ +41% vs antes</p>
            </div>
            <div className="text-center p-4 bg-success/10 rounded-lg border-2 border-success/30">
              <p className="text-sm text-muted-foreground mb-2">Renda Média Pós</p>
              <p className="text-3xl font-bold text-success">
                R$ {dadosSociais.rendaMedia.depois}
              </p>
              <p className="text-xs text-success mt-1">↗ +147% vs antes</p>
            </div>
          </div>
        </Card>

        {/* Funil de Progressão de Carreira */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Funil de Progressão de Carreira Musical
          </h3>
          <div className="space-y-4">
            {progressaoCarreira.map((etapa, idx) => (
              <div key={etapa.etapa}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {etapa.etapa}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {etapa.quantidade.toLocaleString()} pessoas
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {etapa.percentual}%
                    </span>
                  </div>
                </div>
                <Progress value={etapa.percentual} className="h-3" />
              </div>
            ))}
          </div>
        </Card>

        {/* Perfil Demográfico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gênero */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Distribuição por Gênero
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Masculino</span>
                  <span className="text-sm font-medium">{dadosSociais.genero.masculino}%</span>
                </div>
                <Progress value={dadosSociais.genero.masculino} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Feminino</span>
                  <span className="text-sm font-medium">{dadosSociais.genero.feminino}%</span>
                </div>
                <Progress value={dadosSociais.genero.feminino} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Outro</span>
                  <span className="text-sm font-medium">{dadosSociais.genero.outro}%</span>
                </div>
                <Progress value={dadosSociais.genero.outro} />
              </div>
            </div>
          </Card>

          {/* Escolaridade */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Nível de Escolaridade
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Ensino Fundamental</span>
                  <span className="text-sm font-medium">{dadosSociais.escolaridade.fundamental}%</span>
                </div>
                <Progress value={dadosSociais.escolaridade.fundamental} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Ensino Médio</span>
                  <span className="text-sm font-medium">{dadosSociais.escolaridade.medio}%</span>
                </div>
                <Progress value={dadosSociais.escolaridade.medio} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Ensino Superior</span>
                  <span className="text-sm font-medium">{dadosSociais.escolaridade.superior}%</span>
                </div>
                <Progress value={dadosSociais.escolaridade.superior} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Pós-Graduação</span>
                  <span className="text-sm font-medium">{dadosSociais.escolaridade.posGrad}%</span>
                </div>
                <Progress value={dadosSociais.escolaridade.posGrad} />
              </div>
            </div>
          </Card>
        </div>

        {/* Insights Sociais */}
        <Card className="p-6 bg-success/5 border-success/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Principais Indicadores de Impacto Social
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Desenvolvimento Econômico</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Aumento médio de <strong className="text-success">147% na renda</strong> pós-incubação</li>
                <li>• <strong className="text-foreground">189 MEIs</strong> formalizados (33% dos formados)</li>
                <li>• Geração estimada de <strong className="text-foreground">R$ 2.8M/ano</strong> em renda musical</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Desenvolvimento Profissional</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong className="text-foreground">78% de conclusão</strong> dos programas de incubação</li>
                <li>• <strong className="text-foreground">89% criam portfólio</strong> profissional completo</li>
                <li>• Média de <strong className="text-foreground">4.6/5.0</strong> em satisfação dos participantes</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
