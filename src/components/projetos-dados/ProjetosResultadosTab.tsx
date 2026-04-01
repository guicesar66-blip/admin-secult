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
      <VisaoGeralProjetos />

      <CollapsibleSection sectionKey="proj-impacto" title="Impacto Financeiro e Econômico">
        <ImpactoFinanceiro />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-alcance" title="Alcance Social e Participação">
        <AlcanceSocial />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-formal" title="Formalização via Projetos">
        <FormalizacaoProjetos />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-orcamento" title="Orçamento e Fomento">
        <OrcamentoFomento />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-tabela" title="Tabela de Projetos">
        <TabelaProjetos />
      </CollapsibleSection>
    </div>
  );
}
