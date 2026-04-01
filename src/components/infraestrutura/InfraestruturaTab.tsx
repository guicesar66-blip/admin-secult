import { useState, useCallback, useRef } from "react";
import { MapaEquipamentos, type MapFilterEvent } from "./MapaEquipamentos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos, type TableFilter } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [filtroCritico, setFiltroCritico] = useState(false);
  const [filtroExterno, setFiltroExterno] = useState<TableFilter | null>(null);
  const tabelaRef = useRef<HTMLDivElement>(null);

  const handleMapClick = useCallback((event: MapFilterEvent) => {
    let filter: TableFilter;

    switch (event.type) {
      case "equipamento":
        filter = {
          municipio: event.municipio,
          nome: event.nome,
          label: event.nome || event.municipio || "Equipamento",
        };
        break;
      case "municipio":
        filter = {
          municipio: event.municipio,
          label: event.municipio || "Município",
        };
        break;
      case "artista":
        filter = {
          municipio: event.municipio,
          label: event.municipio ? `Artistas em ${event.municipio}` : "Artista",
        };
        break;
      default:
        return;
    }

    setFiltroExterno(filter);

    // Scroll suave até a tabela
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
          filtroExterno={filtroExterno}
          onLimparFiltroExterno={() => setFiltroExterno(null)}
        />
      </div>
    </div>
  );
}
