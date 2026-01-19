import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp } from "lucide-react";

const investimentoPorCategoria = [
  { nome: "Incubações", valor: 78200, percentual: 62 },
  { nome: "Oportunidades", valor: 32100, percentual: 26 },
  { nome: "Recursos Individuais", valor: 15100, percentual: 12 },
];

const programas = [
  { nome: "Rock Básico", participantes: 28, investido: 15200, custoPorPessoa: 543 },
  { nome: "MPB Avançado", participantes: 15, investido: 12800, custoPorPessoa: 853 },
  { nome: "Rap Iniciantes", participantes: 35, investido: 10500, custoPorPessoa: 300 },
  { nome: "Festival Rock", participantes: 100, investido: 50000, custoPorPessoa: 500 },
];

export default function AnaliseFinanceira() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise Financeira
            </h2>
            <p className="text-sm text-muted-foreground">
              Investimentos e ROI dos programas
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Últimos 30 dias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todas as regiões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="varzea">Várzea</SelectItem>
                <SelectItem value="centro">Centro</SelectItem>
                <SelectItem value="boaviagem">Boa Viagem</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos os segmentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="mpb">MPB</SelectItem>
                <SelectItem value="rap">Rap</SelectItem>
              </SelectContent>
            </Select>

            <Button>Aplicar Filtros</Button>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              Visão Geral Financeira
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total investido (mês)
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  R$ 125.400
                </p>
              </div>
              <div className="space-y-2">
                {investimentoPorCategoria.map((item) => (
                  <div key={item.nome} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">• {item.nome}:</span>
                    <span className="font-medium text-foreground">
                      R$ {(item.valor / 1000).toFixed(1)}k ({item.percentual}%)
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-success/10 border border-success/20 p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-success">
                      ROI estimado
                    </p>
                    <p className="text-xs text-success/80">
                      R$ 2.10 para cada R$ 1.00 investido
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Barras Simplificado */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-card-foreground">
              Investimento por Categoria
            </h3>
            <div className="space-y-4">
              {investimentoPorCategoria.map((item) => (
                <div key={item.nome}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-foreground">{item.nome}</span>
                    <span className="font-semibold text-foreground">
                      R$ {(item.valor / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="h-8 w-full rounded-lg bg-muted overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela Detalhada */}
        <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-card-foreground">
              Detalhamento por Programa
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Investido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Custo/Pessoa
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {programas.map((programa) => (
                  <tr key={programa.nome} className="hover:bg-muted/30 transition-smooth">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground">
                        {programa.nome}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        {programa.participantes}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        R$ {(programa.investido / 1000).toFixed(1)}k
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">
                        R$ {programa.custoPorPessoa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projeções */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            Projeção Próximos 3 Meses
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Programas planejados
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                4 novos
              </p>
              <p className="text-xs text-muted-foreground">120 vagas</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Investimento estimado
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                R$ 285k
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Pessoas com portfólio
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">+89</p>
              <p className="text-xs text-muted-foreground">projeção</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                MEIs formalizados
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">+34</p>
              <p className="text-xs text-muted-foreground">projeção</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
