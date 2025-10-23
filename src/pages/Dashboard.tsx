import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Button } from "@/components/ui/button";
import {
  Users,
  MapPin,
  Building2,
  Target,
  DollarSign,
  Network,
  AlertCircle,
  TrendingUp,
  LineChart,
  Music,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            icon={Users}
            label="Artistas Cadastrados"
            value="2.847"
            change={{ value: "+12%", trend: "up" }}
          />
          <StatCard
            icon={MapPin}
            label="ZEIS/CIS Participando"
            value="67%"
            change={{ value: "+8%", trend: "up" }}
          />
          <StatCard
            icon={Building2}
            label="Programas Ativos"
            value="8"
            change={{ value: "0", trend: "neutral" }}
          />
          <StatCard
            icon={Target}
            label="Oportunidades"
            value="24"
            change={{ value: "+3", trend: "up" }}
          />
          <StatCard
            icon={DollarSign}
            label="R$ Gerados este Mês"
            value="R$ 45.2k"
            change={{ value: "+15%", trend: "up" }}
          />
          <StatCard
            icon={Network}
            label="Conexões Realizadas"
            value="156"
            change={{ value: "+28", trend: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Módulos Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alertas */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-error" />
                Ações Necessárias
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-md bg-error/5 p-3 border border-error/20">
                  <div className="h-2 w-2 rounded-full bg-error mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      5 oportunidades aguardando aprovação
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pendentes há mais de 3 dias
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
                <div className="flex items-start gap-3 rounded-md bg-error/5 p-3 border border-error/20">
                  <div className="h-2 w-2 rounded-full bg-error mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      2 programas com baixa adesão
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Menos de 40% de ocupação
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
                <div className="flex items-start gap-3 rounded-md bg-warning/5 p-3 border border-warning/20">
                  <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      15 recursos individuais aguardando decisão
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Média de 2.3 dias pendentes
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </div>
              </div>
            </div>

            {/* Módulos de Análise e Gestão */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/analise-financeira"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <LineChart className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Análise Financeira
                </h4>
                <p className="text-xs text-muted-foreground">
                  R$ por segmento, ROI programas
                </p>
              </Link>

              <Link
                to="/analise-territorial"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <MapPin className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Análise Territorial
                </h4>
                <p className="text-xs text-muted-foreground">
                  Mapa ZEIS/CIS, Distribuição
                </p>
              </Link>

              <Link
                to="/analise-artistas"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <Users className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Análise de Artistas
                </h4>
                <p className="text-xs text-muted-foreground">
                  Perfil demográfico, Engajamento
                </p>
              </Link>

              <Link
                to="/analise-carreiras"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <TrendingUp className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Análise de Carreiras
                </h4>
                <p className="text-xs text-muted-foreground">
                  Progressão, Pós-incubação
                </p>
              </Link>

              <Link
                to="/oportunidades"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <Target className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Gestão de Oportunidades
                </h4>
                <p className="text-xs text-muted-foreground">
                  Editais, Shows, Aprovações
                </p>
              </Link>

              <Link
                to="/incubacoes"
                className="group rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated hover:border-primary/50"
              >
                <Building2 className="h-8 w-8 text-primary mb-3" />
                <h4 className="font-semibold text-card-foreground mb-1">
                  Gestão de Incubações
                </h4>
                <p className="text-xs text-muted-foreground">
                  Programas, Turmas, Mentores
                </p>
              </Link>
            </div>

            {/* Atividades Recentes */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                Atividade da Plataforma (Últimos 7 dias)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    <strong>Oportunidades:</strong> 3 criadas | 7 inscrições
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Music className="h-4 w-4 text-secondary" />
                  <span className="text-foreground">
                    <strong>Incubações:</strong> 2 iniciadas | 15 formandos
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span className="text-foreground">
                    <strong>Recursos:</strong> 8 aprovados | R$ 12.4k liberados
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Network className="h-4 w-4 text-warning" />
                  <span className="text-foreground">
                    <strong>Conexões:</strong> 23 realizadas | 67% com follow-up
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa Territorial */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-lg font-semibold text-card-foreground">
                Concentração Territorial
              </h3>
              <div className="aspect-square rounded-lg bg-muted/30 border border-border flex items-center justify-center mb-4">
                <MapPin className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-error" />
                    <span className="text-foreground">Alta: Várzea</span>
                  </div>
                  <span className="font-semibold text-foreground">340</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-foreground">Média: Centro</span>
                  </div>
                  <span className="font-semibold text-foreground">180</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-foreground">Baixa: Boa V.</span>
                  </div>
                  <span className="font-semibold text-foreground">65</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
