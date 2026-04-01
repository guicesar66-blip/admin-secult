import { useState } from "react";
import { MapaEquipamentos } from "./MapaEquipamentos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [filtroCritico, setFiltroCritico] = useState(false);

  return (
    <div className="space-y-6">
      <RaioAcesso filtroCritico={filtroCritico} onToggleCritico={() => setFiltroCritico((v) => !v)} />
      <MapaEquipamentos filtroCritico={filtroCritico} />
      <InventarioEquipamentos filtroCritico={filtroCritico} />
    </div>
  );
}
