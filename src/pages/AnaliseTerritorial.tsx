import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, MapPin } from "lucide-react";
import { useState } from "react";

const regioes = [
  { nome: "Várzea", zeis: true, pessoas: 340, oportunidades: 12, incubacoes: 3, lat: -8.047, lng: -34.95 },
  { nome: "Centro", zeis: false, pessoas: 180, oportunidades: 8, incubacoes: 2, lat: -8.063, lng: -34.871 },
  { nome: "Boa Viagem", zeis: false, pessoas: 65, oportunidades: 3, incubacoes: 1, lat: -8.113, lng: -34.893 },
  { nome: "Casa Amarela", zeis: true, pessoas: 210, oportunidades: 9, incubacoes: 2, lat: -8.021, lng: -34.909 },
  { nome: "Cajueiro", zeis: true, pessoas: 156, oportunidades: 6, incubacoes: 1, lat: -8.030, lng: -34.924 },
  { nome: "Santo Amaro", zeis: false, pessoas: 98, oportunidades: 5, incubacoes: 1, lat: -8.045, lng: -34.880 },
];

export default function AnaliseTerritorial() {
  const [periodo, setPeriodo] = useState("mes");
  const [tipoMapa, setTipoMapa] = useState("pessoas");

  const getIntensidade = (valor: number, max: number) => {
    const percent = (valor / max) * 100;
    if (percent >= 70) return "bg-error";
    if (percent >= 40) return "bg-warning";
    return "bg-success";
  };

  const maxPessoas = Math.max(...regioes.map(r => r.pessoas));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Análise Territorial
            </h2>
            <p className="text-sm text-muted-foreground">
              Distribuição geográfica de pessoas, oportunidades e incubações
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar Mapa
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-2 block">
                Visualização
              </label>
              <Select value={tipoMapa} onValueChange={setTipoMapa}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoas">Pessoas Cadastradas</SelectItem>
                  <SelectItem value="oportunidades">Oportunidades</SelectItem>
                  <SelectItem value="incubacoes">Incubações</SelectItem>
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

        {/* Mapa de Calor Simplificado */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Mapa de Calor - Recife
          </h3>
          <div className="relative bg-muted/30 rounded-lg p-8 min-h-[500px] border-2 border-dashed border-border">
            {/* Simulação visual do mapa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground max-w-md">
                  Mapa interativo de Recife mostrando concentração de {tipoMapa}
                </p>
              </div>
            </div>
            
            {/* Pontos de calor representativos */}
            <div className="relative z-10 grid grid-cols-3 gap-4 h-full">
              {regioes.map((regiao, idx) => {
                const valor = tipoMapa === "pessoas" ? regiao.pessoas :
                             tipoMapa === "oportunidades" ? regiao.oportunidades :
                             regiao.incubacoes;
                const max = tipoMapa === "pessoas" ? maxPessoas :
                           tipoMapa === "oportunidades" ? 12 : 3;
                
                return (
                  <div
                    key={regiao.nome}
                    className={`${getIntensidade(valor, max)} bg-opacity-20 border-2 rounded-lg p-4 hover:bg-opacity-30 transition-smooth cursor-pointer`}
                    style={{
                      borderColor: `hsl(var(--${getIntensidade(valor, max).replace('bg-', '')}))`
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{regiao.nome}</h4>
                        {regiao.zeis && (
                          <span className="text-xs text-primary font-medium">ZEIS/CIS</span>
                        )}
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-foreground">{valor}</p>
                      <p className="text-xs text-muted-foreground">
                        {tipoMapa === "pessoas" && "pessoas"}
                        {tipoMapa === "oportunidades" && "oportunidades"}
                        {tipoMapa === "incubacoes" && "incubações"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-sm text-muted-foreground">Baixa concentração</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span className="text-sm text-muted-foreground">Média concentração</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-error rounded"></div>
              <span className="text-sm text-muted-foreground">Alta concentração</span>
            </div>
          </div>
        </Card>

        {/* Detalhamento por Região */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Região
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    ZEIS/CIS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Pessoas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Oportunidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Incubações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    % Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {regioes.map((regiao) => {
                  const totalPessoas = regioes.reduce((sum, r) => sum + r.pessoas, 0);
                  const percentual = ((regiao.pessoas / totalPessoas) * 100).toFixed(1);
                  
                  return (
                    <tr key={regiao.nome} className="hover:bg-muted/30 transition-smooth">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-foreground">{regiao.nome}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {regiao.zeis ? (
                          <span className="text-xs font-medium text-primary">✓ Sim</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Não</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-foreground">{regiao.pessoas}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">{regiao.oportunidades}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-muted-foreground">{regiao.incubacoes}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-foreground">{percentual}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Insights */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Insights Territoriais
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">67% das pessoas</strong> estão em regiões ZEIS/CIS</li>
            <li>• <strong className="text-foreground">Várzea</strong> concentra a maior comunidade (340 pessoas)</li>
            <li>• <strong className="text-foreground">Boa Viagem</strong> tem baixa participação apesar da infraestrutura</li>
            <li>• Recomendação: expandir programas em <strong className="text-foreground">Casa Amarela e Cajueiro</strong></li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
