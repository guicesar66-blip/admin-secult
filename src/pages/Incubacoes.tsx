import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BadgeStatus } from "@/components/ui/badge-status";
import { Progress } from "@/components/ui/progress";
import { Plus, FileText, Users, Calendar, TrendingUp, Eye } from "lucide-react";
import { useState } from "react";
import { ReportPreviewDialog } from "@/components/ReportPreviewDialog";
import { ApprovalDialog } from "@/components/ApprovalDialog";

const programas = [
  {
    id: 1,
    nome: "Rock Básico",
    nivel: "Básico",
    vagas: "28/30",
    ocupacao: 93,
    mentor: "Ana Carolina",
    inicio: "15/09/2025",
    termino: "15/12/2025",
    status: "active" as const,
  },
  {
    id: 2,
    nome: "MPB Avançado",
    nivel: "Avançado",
    vagas: "15/20",
    ocupacao: 75,
    mentor: "João Mendes",
    inicio: "01/10/2025",
    termino: "15/01/2026",
    status: "active" as const,
  },
  {
    id: 3,
    nome: "Rap Iniciantes",
    nivel: "Básico",
    vagas: "0/30",
    ocupacao: 0,
    mentor: "Sem mentor",
    inicio: "Previsão: Nov",
    termino: "-",
    status: "paused" as const,
  },
  {
    id: 4,
    nome: "Jazz Intermediário",
    nivel: "Intermediário",
    vagas: "18/20",
    ocupacao: 90,
    mentor: "Maria Silva",
    inicio: "20/09/2025",
    termino: "20/12/2025",
    status: "active" as const,
  },
];

export default function Incubacoes() {
  const [reportOpen, setReportOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestão de Incubações
            </h2>
            <p className="text-sm text-muted-foreground">
              12 programas totais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Modelos
            </Button>
            <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Programa
            </Button>
          </div>
        </div>

        {/* Visão Geral */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            Status dos Programas
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <div className="h-3 w-3 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <div className="h-3 w-3 rounded-full bg-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Planejados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error/10">
                <div className="h-3 w-3 rounded-full bg-error" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Pausados</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de vagas:</span>
                <span className="font-semibold text-foreground">240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ocupação atual:</span>
                <span className="font-semibold text-success">89% (214)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards dos Programas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programas.map((programa) => (
            <div
              key={programa.id}
              className="rounded-lg border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-elevated"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-card-foreground">
                    {programa.nome}
                  </h3>
                </div>
                <BadgeStatus
                  variant={
                    programa.status === "active"
                      ? "success"
                      : programa.status === "paused"
                      ? "error"
                      : "warning"
                  }
                >
                  {programa.status === "active"
                    ? "Ativo"
                    : programa.status === "paused"
                    ? "Pausado"
                    : "Planejado"}
                </BadgeStatus>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nível:</span>
                  <span className="font-medium text-foreground">
                    {programa.nivel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vagas:</span>
                  <span className="font-medium text-foreground">
                    {programa.vagas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mentor:</span>
                  <span className="font-medium text-foreground">
                    {programa.mentor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Início:</span>
                  <span className="font-medium text-foreground">
                    {programa.inicio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Término:</span>
                  <span className="font-medium text-foreground">
                    {programa.termino}
                  </span>
                </div>
              </div>

              {/* Barra de Ocupação */}
              {programa.ocupacao > 0 && (
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Ocupação</span>
                    <span className="font-medium text-foreground">
                      {programa.ocupacao}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${programa.ocupacao}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="mt-4 flex gap-2">
                {programa.status === "active" ? (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedProgram(programa);
                        setApprovalOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Relatório
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      Reativar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Editar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Métricas de Performance */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            Indicadores Gerais
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Taxa de conclusão média
              </p>
              <p className="mt-1 text-2xl font-bold text-success">78%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Satisfação dos participantes
              </p>
              <p className="mt-1 text-2xl font-bold text-success">4.6/5.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Artistas com portfólio criado
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                156 (89%)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                MEIs formalizados pós-incubação
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                67 (38%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ReportPreviewDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        title="Relatório de Incubações"
        type="incubacoes"
      />
      
      {selectedProgram && (
        <ApprovalDialog
          open={approvalOpen}
          onOpenChange={setApprovalOpen}
          type="incubacao"
          item={selectedProgram}
        />
      )}
    </DashboardLayout>
  );
}
