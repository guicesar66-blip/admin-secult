import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Brain, AlertTriangle, Lightbulb, MapPin, Users, TrendingUp } from "lucide-react";
import { insightsIAMock, type InsightIA } from "@/data/mockCensoAuxiliar";

interface InsightsIAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InsightCard({ insight }: { insight: InsightIA }) {
  const iconMap = {
    deserto_cultural: <AlertTriangle className="h-5 w-5 text-red-500" />,
    sugestao_edital: <Lightbulb className="h-5 w-5 text-amber-500" />,
    alerta: <TrendingUp className="h-5 w-5 text-blue-500" />,
  };

  const prioridadeColor = {
    alta: "bg-red-500/10 text-red-600 border-red-500/20",
    media: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    baixa: "bg-green-500/10 text-green-600 border-green-500/20",
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: insight.prioridade === "alta" ? "#ef4444" : insight.prioridade === "media" ? "#f59e0b" : "#22c55e" }}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-3">
          {iconMap[insight.tipo]}
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{insight.titulo}</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.descricao}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs gap-1">
            <MapPin className="h-3 w-3" /> {insight.regiao}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Users className="h-3 w-3" /> ~{insight.impacto} artistas impactados
          </Badge>
          <Badge className={`text-xs border ${prioridadeColor[insight.prioridade]}`}>
            Prioridade {insight.prioridade}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightsIAModal({ open, onOpenChange }: InsightsIAModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-primary" />
            AI Insights — Inteligência Territorial
          </DialogTitle>
          <DialogDescription>
            Análises automáticas cruzando dados do censo cultural, repasses históricos e cobertura territorial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {insightsIAMock.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
