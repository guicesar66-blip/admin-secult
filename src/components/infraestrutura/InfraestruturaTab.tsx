import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Briefcase, TrendingUp } from "lucide-react";
import { equipamentosMock, tiposEquipamento, iconesTipoEquipamento } from "@/data/mockEquipamentosCulturais";
import { QualidadeEspacos } from "./QualidadeEspacos";
import { AtividadeEspacos } from "./AtividadeEspacos";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [subAba, setSubAba] = useState("qualidade");
  const [filtroMunicipio, setFiltroMunicipio] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroConservacao, setFiltroConservacao] = useState("todos");
  const [filtroAcessibilidade, setFiltroAcessibilidade] = useState("todos");
  const [busca, setBusca] = useState("");

  const ativos = equipamentosMock.filter(e => e.status === "Ativo");
  const inativos = equipamentosMock.filter(e => e.status === "Inativo");
  const percentInativos = Math.round((inativos.length / equipamentosMock.length) * 100);
  const capacidadeTotal = equipamentosMock.reduce((s, e) => s + (e.capacidade || 0), 0);
  const publicoTotal = ativos.reduce((s, e) => s + e.publicoMensal * 3, 0);
  const mediaProjetos = (equipamentosMock.reduce((s, e) => s + e.projetosRealizados, 0) / equipamentosMock.length).toFixed(1);

  const byTipo = tiposEquipamento.map(t => ({
    tipo: t,
    icon: iconesTipoEquipamento[t],
    count: equipamentosMock.filter(e => e.tipo === t).length,
  }));

  return (
    <div className="space-y-6">
      {/* KPIs fixos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Espaços</p>
                <p className="text-2xl font-bold">{equipamentosMock.length}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {byTipo.map(t => <span key={t.tipo} className="text-[10px] text-muted-foreground">{t.icon}{t.count}</span>)}
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ativos / Inativos</p>
                <p className="text-2xl font-bold">{ativos.length} <span className="text-sm font-normal text-muted-foreground">/ {inativos.length}</span></p>
                {percentInativos > 20 && <Badge variant="destructive" className="text-[10px] mt-1">⚠ {percentInativos}% inativos</Badge>}
              </div>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-success" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Capacidade Total</p>
                <p className="text-2xl font-bold">{capacidadeTotal.toLocaleString("pt-BR")}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Público (trimestre)</p>
                <p className="text-2xl font-bold">{(publicoTotal / 1000).toFixed(0)}k</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center"><Users className="h-5 w-5 text-warning" /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Média Projetos/Espaço</p>
                <p className="text-2xl font-bold">{mediaProjetos}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center"><Briefcase className="h-5 w-5 text-accent-foreground" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dropdown sub-aba */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Visualizar:</span>
        <Select value={subAba} onValueChange={setSubAba}>
          <SelectTrigger className="w-[260px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qualidade">Qualidade dos Espaços</SelectItem>
            <SelectItem value="atividade">Atividade nos Espaços</SelectItem>
            <SelectItem value="inventario">Inventário de Espaços Culturais</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conteúdo da sub-aba */}
      {subAba === "qualidade" && <QualidadeEspacos />}
      {subAba === "atividade" && <AtividadeEspacos />}
      {subAba === "inventario" && (
        <InventarioEquipamentos
          filtroMunicipio={filtroMunicipio}
          onFiltroMunicipioChange={setFiltroMunicipio}
          filtroTipo={filtroTipo}
          onFiltroTipoChange={setFiltroTipo}
          filtroConservacao={filtroConservacao}
          onFiltroConservacaoChange={setFiltroConservacao}
          filtroAcessibilidade={filtroAcessibilidade}
          onFiltroAcessibilidadeChange={setFiltroAcessibilidade}
          busca={busca}
          onBuscaChange={setBusca}
        />
      )}
    </div>
  );
}
