import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, FileText, Download, Camera } from "lucide-react";
import { projetosAuditoriaMock } from "@/data/mockCensoAuxiliar";

export function AuditoriaPanel() {
  const statusIcon = {
    verde: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    amarelo: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    vermelho: <XCircle className="h-4 w-4 text-red-500" />,
  };

  const statusBadge = {
    verde: "bg-green-500/10 text-green-600 border-green-500/20",
    amarelo: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    vermelho: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const totalProjetos = projetosAuditoriaMock.length;
  const emDia = projetosAuditoriaMock.filter(p => p.status === "verde").length;
  const pendencias = projetosAuditoriaMock.filter(p => p.status === "amarelo").length;
  const atrasados = projetosAuditoriaMock.filter(p => p.status === "vermelho").length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      {/* KPI mini cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalProjetos}</p>
              <p className="text-xs text-muted-foreground">Projetos em execução</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{emDia}</p>
              <p className="text-xs text-muted-foreground">Em dia</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-2xl font-bold">{pendencias}</p>
              <p className="text-xs text-muted-foreground">Pendências</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{atrasados}</p>
              <p className="text-xs text-muted-foreground">Atrasados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Pipeline de Aprovação</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Exportar PDF TCE
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Artista</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-center">Evidências</TableHead>
                  <TableHead>Prazo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projetosAuditoriaMock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcon[p.status]}
                        <Badge className={`text-xs border ${statusBadge[p.status]}`} variant="outline">
                          {p.statusLabel}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{p.titulo}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.artista}</TableCell>
                    <TableCell className="text-right font-medium text-sm">{formatCurrency(p.valor)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={p.percentualConcluido} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{p.percentualConcluido}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Camera className="h-3 w-3" /> {p.evidencias}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(p.prazo).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
