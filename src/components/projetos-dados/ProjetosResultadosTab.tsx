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
  filterProjetos?: string[];
}

export function ProjetosResultadosTab({ filtroPeriodo, filtroLinguagem, filtroCidades, filterProjetos = [] }: ProjetosResultadosTabProps) {
  return (
    <div className="space-y-6">
      <VisaoGeralProjetos filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />

      <CollapsibleSection sectionKey="proj-impacto" title="Impacto Financeiro e Econômico">
        <ImpactoFinanceiro filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-alcance" title="Alcance Social e Participação">
        <AlcanceSocial filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-formal" title="Formalização via Projetos">
        <FormalizacaoProjetos filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-orcamento" title="Orçamento e Fomento">
        <OrcamentoFomento filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />
      </CollapsibleSection>

      <CollapsibleSection sectionKey="proj-tabela" title="Tabela de Projetos">
        <TabelaProjetos filtroLinguagem={filtroLinguagem} filtroCidades={filtroCidades} filterProjetos={filterProjetos} />
      </CollapsibleSection>
    </div>
  );
}
