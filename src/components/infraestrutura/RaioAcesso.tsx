import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";
import { acessoKPI } from "@/data/mockEquipamentosCulturais";

interface RaioAcessoProps {
  filtroCritico: boolean;
  onToggleCritico: () => void;
}

export function RaioAcesso({ filtroCritico, onToggleCritico }: RaioAcessoProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        filtroCritico
          ? "border-destructive/60 bg-gradient-to-r from-destructive/10 to-transparent ring-1 ring-destructive/30"
          : "border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40"
      }`}
      onClick={onToggleCritico}
    >
      <CardContent className="pt-6 pb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              População com acesso em até 1h a um espaço cultural
            </p>
            <p className="text-4xl font-bold mt-1">{acessoKPI.percentualAte1h}%</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{acessoKPI.totalEquipamentos} espaços mapeados</span>
              <span>·</span>
              <span className={`font-medium flex items-center gap-1 ${filtroCritico ? "text-destructive" : "text-destructive"}`}>
                <AlertTriangle className="h-3.5 w-3.5" />
                {acessoKPI.municipiosCriticos} municípios com acesso crítico (&gt;2h)
              </span>
            </div>
            {filtroCritico && (
              <p className="text-xs text-destructive font-medium mt-2">
                🔴 Filtro ativo — exibindo apenas municípios e equipamentos com acesso crítico
              </p>
            )}
          </div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
            filtroCritico ? "bg-destructive/10" : "bg-primary/10"
          }`}>
            <Clock className={`h-7 w-7 ${filtroCritico ? "text-destructive" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
