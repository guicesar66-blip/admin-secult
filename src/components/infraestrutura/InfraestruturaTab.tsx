import { useState, useCallback, useRef } from "react";
import { MapaEquipamentos, type MapFilterEvent } from "./MapaEquipamentos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [filtroCritico, setFiltroCritico] = useState(false);
  const [filtroMunicipio, setFiltroMunicipio] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");
  const tabelaRef = useRef<HTMLDivElement>(null);

  const handleMapClick = useCallback((event: MapFilterEvent) => {
    // Clear all existing filters before applying new ones
    setBusca("");

    switch (event.type) {
      case "equipamento":
        setFiltroMunicipio(event.municipio ?? "todos");
        setFiltroTipo(event.tipo ?? "todos");
        break;
      case "municipio":
        // Use the municipality where the nearest equipment is located,
        // since the clicked municipality may not have its own equipment
        setFiltroMunicipio(event.municipioEquipamento ?? event.municipio ?? "todos");
        setFiltroTipo("todos");
        break;
      case "artista":
        setFiltroMunicipio(event.municipio ?? "todos");
        setFiltroTipo("todos");
        break;
      default:
        return;
    }

    setTimeout(() => {
      tabelaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <div className="space-y-6">
      <RaioAcesso filtroCritico={filtroCritico} onToggleCritico={() => setFiltroCritico((v) => !v)} />
      <MapaEquipamentos filtroCritico={filtroCritico} onMapClick={handleMapClick} />
      <div ref={tabelaRef}>
        <InventarioEquipamentos
          filtroCritico={filtroCritico}
          filtroMunicipio={filtroMunicipio}
          onFiltroMunicipioChange={setFiltroMunicipio}
          filtroTipo={filtroTipo}
          onFiltroTipoChange={setFiltroTipo}
          busca={busca}
          onBuscaChange={setBusca}
        />
      </div>
    </div>
  );
}
