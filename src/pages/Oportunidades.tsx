import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeStatus } from "@/components/ui/badge-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Download, Upload, Edit, Eye, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import { ReportPreviewDialog } from "@/components/ReportPreviewDialog";
import { ApprovalDialog } from "@/components/ApprovalDialog";

const oportunidades = [
  {
    id: 1,
    titulo: "Festival Rock Recife 2025",
    tipo: "Show",
    status: "Aguardando Aprovação",
    statusVariant: "error" as const,
    inscricoes: "45/100",
  },
  {
    id: 2,
    titulo: "Workshop Produção Musical",
    tipo: "Curso",
    status: "Ativa",
    statusVariant: "success" as const,
    inscricoes: "23/30",
  },
  {
    id: 3,
    titulo: "Edital Carnaval 2025",
    tipo: "Fomento",
    status: "Finalizada",
    statusVariant: "info" as const,
    inscricoes: "156/200",
  },
  {
    id: 4,
    titulo: "Show na Praça do Marco Zero",
    tipo: "Show",
    status: "Ativa",
    statusVariant: "success" as const,
    inscricoes: "67/80",
  },
  {
    id: 5,
    titulo: "Curso de Violão Básico",
    tipo: "Curso",
    status: "Aguardando Aprovação",
    statusVariant: "error" as const,
    inscricoes: "12/25",
  },
];

export default function Oportunidades() {
  const [reportOpen, setReportOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Gestão de Oportunidades
            </h2>
            <p className="text-sm text-muted-foreground">
              47 oportunidades totais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setReportOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Relatório
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Ativas</p>
            <p className="mt-1 text-2xl font-bold text-foreground">24</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Aguardando</p>
            <p className="mt-1 text-2xl font-bold text-foreground">5</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">Finalizadas</p>
            <p className="mt-1 text-2xl font-bold text-foreground">18</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todas as status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="pending">Aguardando</SelectItem>
                <SelectItem value="finished">Finalizadas</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="show">Show</SelectItem>
                <SelectItem value="curso">Curso</SelectItem>
                <SelectItem value="fomento">Fomento</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Este mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar oportunidade..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Inscrições
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {oportunidades.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {item.titulo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <BadgeStatus variant={item.statusVariant}>
                        {item.status}
                      </BadgeStatus>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-foreground">
                        {item.inscricoes}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setApprovalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando 1-5 de 47 resultados
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="default" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ReportPreviewDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        title="Relatório de Oportunidades"
        type="oportunidades"
      />
      
      {selectedItem && (
        <ApprovalDialog
          open={approvalOpen}
          onOpenChange={setApprovalOpen}
          type="oportunidade"
          item={selectedItem}
        />
      )}
    </DashboardLayout>
  );
}
