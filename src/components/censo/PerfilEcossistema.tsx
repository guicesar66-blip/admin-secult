import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, DollarSign, AlertTriangle, ShieldAlert, TrendingUp, TrendingDown } from "lucide-react";
import { EvolucaoCadastros } from "./EvolucaoCadastros";
import { CapilaridadeKPI } from "./CapilaridadeKPI";
import { PainelSocioeconomico } from "./PainelSocioeconomico";
import { TabelaColetivos } from "./TabelaColetivos";
import { DemografiaCharts } from "./DemografiaCharts";
import { CollapsibleSection } from "./CollapsibleSection";
import {
  RENDA_MEDIA_MEMBROS,
  SALARIO_MINIMO_2025,
  PERCENT_SEM_SERVICO,
  PERCENT_COLETIVOS_VULNERAVEL,
} from "@/data/mockColetivos";

const TOTAL_AGENTES = 662;
const VARIACAO_PERIODO = "+8,2%";
const MUNICIPIOS_COM_AGENTES = 47;
const TOTAL_MUNICIPIOS = 185;
const PERCENTUAL_CAPILARIDADE = ((MUNICIPIOS_COM_AGENTES / TOTAL_MUNICIPIOS) * 100).toFixed(1);

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
  const [bgClass, textClass] = accentColor.split(" ");
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
  const percentSM = ((RENDA_MEDIA_MEMBROS / SALARIO_MINIMO_2025) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MiniKPI
          label="Total de Agentes Culturais"
          value={TOTAL_AGENTES.toLocaleString("pt-BR")}
          subtitle={`Período: ${filtroPeriodo}`}
          icon={<Users className="h-4 w-4 text-primary" />}
          trend={{ value: VARIACAO_PERIODO, positive: true }}
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
          value={`R$ ${RENDA_MEDIA_MEMBROS.toLocaleString("pt-BR")}`}
          subtitle={`${percentSM}% do salário mínimo`}
          icon={<DollarSign className="h-4 w-4 text-warning" />}
          trend={{ value: `${percentSM}% do SM`, positive: false }}
          accentColor="bg-warning/10 text-warning"
        />
        <MiniKPI
          label="Sem acesso a serviço básico"
          value={`${PERCENT_SEM_SERVICO}%`}
          subtitle="dos membros cadastrados"
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          accentColor="bg-destructive/10 text-destructive"
        />
        <MiniKPI
          label="Coletivos c/ membro vulnerável"
          value={`${PERCENT_COLETIVOS_VULNERAVEL}%`}
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
      <DemografiaCharts filtroLinguagem={filtroLinguagem} />

      {/* Painel Socioeconômico — collapsible */}
      <CollapsibleSection sectionKey="painel-socioeconomico" title="Painel Socioeconômico dos Coletivos">
        <PainelSocioeconomico filtroPeriodo={filtroPeriodo} />
      </CollapsibleSection>

      {/* Tabela de Coletivos — collapsible */}
      <CollapsibleSection sectionKey="tabela-coletivos" title="Coletivos Cadastrados">
        <TabelaColetivos filtroPeriodo={filtroPeriodo} />
      </CollapsibleSection>
    </div>
  );
}
