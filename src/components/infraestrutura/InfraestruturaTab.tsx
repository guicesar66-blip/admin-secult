import { useState, useCallback, useRef } from "react";
import { MetricasEspacos } from "./MetricasEspacos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [filtroMunicipio, setFiltroMunicipio] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroConservacao, setFiltroConservacao] = useState("todos");
  const [filtroAcessibilidade, setFiltroAcessibilidade] = useState("todos");
  const [busca, setBusca] = useState("");

  return (
    <div className="space-y-6">
      <MetricasEspacos />
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
    </div>
  );
}
