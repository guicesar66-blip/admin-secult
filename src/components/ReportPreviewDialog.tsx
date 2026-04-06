import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface ReportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: "oportunidades" | "incubacoes" | "financeiro" | "territorial" | "pessoas";
}

export function ReportPreviewDialog({
  open,
  onOpenChange,
  title,
  type,
}: ReportPreviewDialogProps) {
  const getReportContent = () => {
    switch (type) {
      case "oportunidades":
        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Relatório de Oportunidades</h3>
              <p className="text-sm text-muted-foreground">Período: Outubro 2025</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <div className="bg-success/10 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold text-success">24</p>
              </div>
              <div className="bg-warning/10 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Aguardando</p>
                <p className="text-2xl font-bold text-warning">5</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Principais Oportunidades</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Festival Rock Recife 2025</span>
                  <span className="text-muted-foreground">45 inscrições</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Workshop Produção Musical</span>
                  <span className="text-muted-foreground">23 inscrições</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Show na Praça do Marco Zero</span>
                  <span className="text-muted-foreground">67 inscrições</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "incubacoes":
        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Relatório de Incubações</h3>
              <p className="text-sm text-muted-foreground">Período: 2025</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-success/10 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Programas Ativos</p>
                <p className="text-2xl font-bold text-success">8</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Participantes</p>
                <p className="text-2xl font-bold">214</p>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Taxa Conclusão</p>
                <p className="text-2xl font-bold text-primary">78%</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Performance por Programa</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Rock Básico</span>
                  <span className="text-success">28/30 vagas - 93%</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>MPB Avançado</span>
                  <span className="text-warning">15/20 vagas - 75%</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Rap Iniciantes</span>
                  <span className="text-error">Pausado</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "financeiro":
        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Relatório Financeiro</h3>
              <p className="text-sm text-muted-foreground">Período: Outubro 2025</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">Total Investido</p>
              <p className="text-3xl font-bold text-primary">R$ 125.400</p>
              <p className="text-xs text-success mt-1">ROI: R$ 2.10 por R$ 1.00</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Distribuição por Categoria</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Incubações</span>
                    <span className="font-medium">R$ 78.200 (62%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "62%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Oportunidades</span>
                    <span className="font-medium">R$ 32.100 (26%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: "26%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Recursos Individuais</span>
                    <span className="font-medium">R$ 15.100 (12%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "12%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "territorial":
        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Relatório Territorial</h3>
              <p className="text-sm text-muted-foreground">Distribuição Geográfica</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Top 5 Regiões</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-error/10 rounded">
                  <span className="font-medium">Várzea (ZEIS)</span>
                  <span>340 pessoas</span>
                </div>
                <div className="flex justify-between p-2 bg-warning/10 rounded">
                  <span className="font-medium">Casa Amarela (ZEIS)</span>
                  <span>210 pessoas</span>
                </div>
                <div className="flex justify-between p-2 bg-warning/10 rounded">
                  <span>Centro</span>
                  <span>180 pessoas</span>
                </div>
                <div className="flex justify-between p-2 bg-success/10 rounded">
                  <span className="font-medium">Cajueiro (ZEIS)</span>
                  <span>156 pessoas</span>
                </div>
                <div className="flex justify-between p-2 bg-success/10 rounded">
                  <span>Santo Amaro</span>
                  <span>98 pessoas</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="text-sm font-medium">Concentração ZEIS/CIS</p>
              <p className="text-2xl font-bold text-primary mt-1">67%</p>
              <p className="text-xs text-muted-foreground mt-1">
                706 pessoas em regiões prioritárias
              </p>
            </div>
          </div>
        );

      case "pessoas":
        return (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">Relatório de Pessoas</h3>
              <p className="text-sm text-muted-foreground">Impacto Social e Desenvolvimento</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Pessoas</p>
                <p className="text-2xl font-bold">2.847</p>
              </div>
              <div className="bg-success/10 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">Em Incubação</p>
                <p className="text-2xl font-bold text-success">214</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Impacto na Renda</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Antes da Incubação</span>
                  <span className="font-medium">R$ 850</span>
                </div>
                <div className="flex justify-between p-2 bg-warning/10 rounded">
                  <span>Durante Incubação</span>
                  <span className="font-medium text-warning">R$ 1.200 (+41%)</span>
                </div>
                <div className="flex justify-between p-2 bg-success/10 rounded">
                  <span>Pós-Incubação</span>
                  <span className="font-medium text-success">R$ 2.100 (+147%)</span>
                </div>
              </div>
            </div>

            <div className="bg-success/5 p-4 rounded-lg border border-success/20">
              <p className="text-sm font-medium mb-2">Principais Conquistas</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• 189 MEIs formalizados (33% dos formados)</li>
                <li>• 78% de taxa de conclusão</li>
                <li>• 89% criam portfólio completo</li>
                <li>• Satisfação média: 4.6/5.0</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview do Relatório</DialogTitle>
          <DialogDescription>
            Visualização prévia antes de exportar
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-6 bg-card text-black rounded-lg border-2">
          {getReportContent()}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
