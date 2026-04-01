import { MapaEquipamentos } from "./MapaEquipamentos";
import { RaioAcesso } from "./RaioAcesso";
import { InventarioEquipamentos } from "./InventarioEquipamentos";

interface InfraestruturaTabProps {
  filtroPeriodo: string;
}

export function InfraestruturaTab({ filtroPeriodo }: InfraestruturaTabProps) {
  return (
    <div className="space-y-6">
      <MapaEquipamentos />
      <RaioAcesso />
      <InventarioEquipamentos />
    </div>
  );
}
