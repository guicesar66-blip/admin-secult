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
  const tabelaRef = useRef<HTMLDivElement>(null);

  const handleMapClick = useCallback((event: MapFilterEvent) => {
    switch (event.type) {
      case "equipamento":
        if (event.municipio) setFiltroMunicipio(event.municipio);
        if (event.tipo) setFiltroTipo(event.tipo);
        break;
      case "municipio":
        if (event.municipio) setFiltroMunicipio(event.municipio);
        setFiltroTipo("todos");
        break;
      case "artista":
        if (event.municipio) setFiltroMunicipio(event.municipio);
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
        />
      </div>
    </div>
  );
}
