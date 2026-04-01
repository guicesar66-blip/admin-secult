import { useState } from "react";
import { MapaEquipamentos } from "./MapaEquipamentos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  const [municipioSel, setMunicipioSel] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <MapaEquipamentos onMunicipioClick={setMunicipioSel} />
      <RaioAcesso municipioSelecionado={municipioSel} onMunicipioClick={setMunicipioSel} />
      <InventarioEquipamentos />
    </div>
  );
}
