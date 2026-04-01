import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, DollarSign, AlertTriangle, ShieldAlert, TrendingUp, TrendingDown } from "lucide-react";
import { EvolucaoCadastros } from "./EvolucaoCadastros";
import { CapilaridadeKPI } from "./CapilaridadeKPI";
import { PainelSocioeconomico } from "./PainelSocioeconomico";
import { TabelaColetivos } from "./TabelaColetivos";
import { DemografiaCharts } from "./DemografiaCharts";
import { CollapsibleSection } from "./CollapsibleSection";
import { useEcossistemaData } from "@/hooks/useEcossistemaData";
import { SALARIO_MINIMO_2025 } from "@/data/mockColetivos";

interface PerfilEcossistemaProps {
  filtroPeriodo: string;
  filtroLinguagem: string;
}

interface MiniKPIProps {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
}

function MiniKPI({ label, value, subtitle, icon, trend, accentColor = "bg-primary/10 text-primary" }: MiniKPIProps) {
  const [bgClass] = accentColor.split(" ");
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-2xl font-bold mt-0.5 tabular-nums">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend.positive ? "text-success" : "text-warning"}`}>
                {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          </div>
          <div className={`h-9 w-9 rounded-xl ${bgClass} flex items-center justify-center shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PerfilEcossistema({ filtroPeriodo, filtroLinguagem }: PerfilEcossistemaProps) {
  const data = useEcossistemaData(filtroLinguagem);
  const percentSM = data.rendaMedia > 0 ? ((data.rendaMedia / SALARIO_MINIMO_2025) * 100).toFixed(0) : "0";

  const MUNICIPIOS_COM_AGENTES = 47;
  const TOTAL_MUNICIPIOS = 185;
  const PERCENTUAL_CAPILARIDADE = ((MUNICIPIOS_COM_AGENTES / TOTAL_MUNICIPIOS) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MiniKPI
          label="Total de Agentes Culturais"
          value={data.totalMembros.toLocaleString("pt-BR")}
          subtitle={`Período: ${filtroPeriodo}`}
          icon={<Users className="h-4 w-4 text-primary" />}
          trend={{ value: "+8,2%", positive: true }}
          accentColor="bg-primary/10 text-primary"
        />
        <MiniKPI
          label="Índice de Capilaridade"
          value={`${PERCENTUAL_CAPILARIDADE}%`}
          subtitle={`${MUNICIPIOS_COM_AGENTES}/${TOTAL_MUNICIPIOS} municípios`}
          icon={<MapPin className="h-4 w-4 text-primary" />}
          trend={{ value: "+3 municípios", positive: true }}
          accentColor="bg-primary/10 text-primary"
        />
        <MiniKPI
          label="Renda Média Mensal"
          value={`R$ ${data.rendaMedia.toLocaleString("pt-BR")}`}
          subtitle={`${percentSM}% do salário mínimo`}
          icon={<DollarSign className="h-4 w-4 text-warning" />}
          trend={{ value: `${percentSM}% do SM`, positive: false }}
          accentColor="bg-warning/10 text-warning"
        />
        <MiniKPI
          label="Sem acesso a serviço básico"
          value={`${data.percentSemServico}%`}
          subtitle="dos membros cadastrados"
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          accentColor="bg-destructive/10 text-destructive"
        />
        <MiniKPI
          label="Coletivos c/ membro vulnerável"
          value={`${data.percentColetivosVulneravel}%`}
          subtitle="ao menos 1 membro"
          icon={<ShieldAlert className="h-4 w-4 text-warning" />}
          accentColor="bg-warning/10 text-warning"
        />
      </div>

      {/* Evolução de cadastros + Capilaridade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EvolucaoCadastros filtroPeriodo={filtroPeriodo} />
        <CapilaridadeKPI filtroPeriodo={filtroPeriodo} />
      </div>

      {/* Demographic charts */}
      <DemografiaCharts filtroLinguagem={filtroLinguagem} data={data} />

      {/* Painel Socioeconômico — collapsible */}
      <CollapsibleSection sectionKey="painel-socioeconomico" title="Painel Socioeconômico dos Coletivos">
        <PainelSocioeconomico filtroPeriodo={filtroPeriodo} data={data} />
      </CollapsibleSection>

      {/* Tabela de Coletivos — collapsible */}
      <CollapsibleSection sectionKey="tabela-coletivos" title="Coletivos Cadastrados">
        <TabelaColetivos filtroPeriodo={filtroPeriodo} filtroLinguagem={filtroLinguagem} />
      </CollapsibleSection>
    </div>
  );
}
