import { useState } from "react";
import { CollapsibleSection } from "@/components/censo/CollapsibleSection";
import { VisaoGeralProjetos } from "./VisaoGeralProjetos";
import { ImpactoFinanceiro } from "./ImpactoFinanceiro";
import { AlcanceSocial } from "./AlcanceSocial";
import { FormalizacaoProjetos } from "./FormalizacaoProjetos";
import { TabelaProjetos } from "./TabelaProjetos";
import { OrcamentoFomento } from "./OrcamentoFomento";

interface ProjetosResultadosTabProps {
  filtroPeriodo: string;
  filtroLinguagem: string;
  filtroCidades: string[];
}

export function ProjetosResultadosTab({ filtroPeriodo, filtroLinguagem, filtroCidades }: ProjetosResultadosTabProps) {
  return (
    <div className="space-y-6">
      <CollapsibleSection title="Visão Geral dos Projetos" defaultOpen>
        <VisaoGeralProjetos />
      </CollapsibleSection>

      <CollapsibleSection title="Impacto Financeiro e Econômico" defaultOpen>
        <ImpactoFinanceiro />
      </CollapsibleSection>

      <CollapsibleSection title="Alcance Social e Participação" defaultOpen>
        <AlcanceSocial />
      </CollapsibleSection>

      <CollapsibleSection title="Formalização via Projetos" defaultOpen>
        <FormalizacaoProjetos />
      </CollapsibleSection>

      <CollapsibleSection title="Orçamento e Fomento" defaultOpen>
        <OrcamentoFomento />
      </CollapsibleSection>

      <CollapsibleSection title="Tabela de Projetos" defaultOpen>
        <TabelaProjetos />
      </CollapsibleSection>
    </div>
  );
}
