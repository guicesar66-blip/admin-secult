# CENA — Épico 2: Dashboard de Dados
## Especificação Técnica + Análise de Código

**Código:** M1-E2 · **Protótipo em Desenvolvimento · Código Real + Dados Mockados · Abril 2026**

---

## ⚙️ Status Geral do Épico

| Aba | Status | Cobertura | Arquivos |
|---|---|---|---|
| **Mapa** | 🔄 Em Progresso Avançado | 85% | MapaCenso.tsx (800+L) |
| **Perfil do Ecossistema** | 🔄 Em Progresso | 72% | PerfilEcossistema.tsx, DemografiaCharts.tsx (1.200L) |
| **Espaços Culturais** | 🔄 Em Progresso | 68% | InfraestruturaTab.tsx, QualidadeEspacos.tsx (800L) |
| **Projetos e Orçamento** | 🔄 Em Progresso | 62% | VisaoGeralProjetos.tsx, TabelaProjetos.tsx (1.000L) |
| **Componentes Globais** | ✅ Implementado | 100% | DashboardLayout.tsx, MapFilterContext.tsx |

**Total Linha de Código:** ~5.600+ linhas de componentes + dados mockados  
**Status de Implementação:** 72% do épico (17/25 histórias)

---

## 📋 Sobre este Épico

**Objetivo Principal:**  
Construir o dashboard central (Radar da Cultura) com 4 abas de visualização de dados que respondem às perguntas estratégicas sobre o ecossistema cultural de Pernambuco, preparado para futuro integração com dados reais via Supabase.

**Dependências Implementadas:**
- ✅ M1-E1 (Auth): AuthContext + roles (P1, P2, P3)
- ✅ M1-E1 (Layout): DashboardLayout base + navegação

**Status de Dados:**
- ✅ Dados mockados em padrão relacional (normalized)
- ✅ Sem hardcoding em views — toda fonte centraliza em `/src/data`
- ✅ Contextos globais para filtros (MapFilterContext)
- 🔄 Supabase integration pronta para próxima fase (tipos definidos, estrutura preparada)
- ⏳ API endpoints aguardando M1-E5 (Backend)

**Stack Tecnológico Atual:**
```
Frontend:
  - React 18.2.0 + TypeScript + Vite
  - Shadcn/ui v0.x + Tailwind CSS 3.x
  - Recharts 2.10+ (gráficos interativos)
  - React Leaflet 4.x + Leaflet 1.9.x (mapas)
  - React Router v6 (navegação)

Estado Global:
  - React Context (Auth, MapFilter, WhiteLabel, Notification)
  - Hooks customizados (useEcossistemaData, useFinanceiro, etc.)

Build & Deploy:
  - Vite (dev server + hot reload)
  - Bun (package manager)
  - CSS: Tailwind + CSS Modules (quando necessário)
```

---

## 🏗️ Arquitetura de Dados

### Estrutura em `/src/data`

```
src/data/
├── mockArtistas.ts               (↔️ Artistas únicos — tabela pessoa física)
├── mockProdutoras.ts             (↔️ Coletivos/produtoras — tabela pessoa jurídica)
├── mockEquipamentosCulturais.ts  (↔️ Espaços — teatros, museus, CEUs, independentes)
├── mockCensoAuxiliar.ts          (📊 Agregações + KPIs calculados inline)
├── mockMunicipios.ts             (📍 Geolocalização — lat/lng + dados geográficos)
├── mockMapaEntidades.ts          (📍 Entidades georreferenciadas para mapa)
├── mockProjetos.ts               (💼 Projetos culturais — financeiros + status)
├── mockColetivos.ts              (👥 Detalhe socioeconômico dos coletivos)
├── mockLinguagens.ts             (📚 Taxonomia — 8 linguagens principais)
├── mockUsuarios.ts               (🔐 Teste: usuários P1, P2, P3)
├── mockOportunidades.ts          (💰 Editais, prêmios, oportunidades abertas)
└── README_DATA.md                (📖 Documentação da estrutura relacional)
```

### Diagrama Relacional (Normalizado)

```
┌─────────────────────────────────────────────────────────────┐
│ Artistas (mockArtistas)                                      │
│ ├─ id: UUID                                                  │
│ ├─ nome, genero, raca_cor, data_nascimento                  │
│ ├─ municipio_id → FK(Municipios)                            │
│ ├─ linguagens: string[]                                      │
│ └─ status: 'Ativo' | 'Inativo'                              │
└─────────┬───────────────────────────────────────────────────┘
          │
          ├──→ ┌──────────────────────────┐
          │    │ Coletivos                 │
          │    │ (mockColetivos)           │
          │    │ ├─ id, nome               │
          │    │ ├─ membros[]              │
          │    │ ├─ renda_media            │
          │    │ └─ ivc (vulnerabilidade)  │
          │    └──────────────────────────┘
          │
          └──→ ┌──────────────────────────┐
               │ Projetos                 │
               │ (mockProjetos)           │
               │ ├─ id, nome              │
               │ ├─ proponente_id         │
               │ ├─ valor: number         │
               │ ├─ publico_impactado     │
               │ └─ fase, status          │
               └──────────────────────────┘

┌──────────────────────────────────────────────┐
│ Equipamentos Culturais (mockEquipamentosCulturais) │
│ ├─ id, nome, tipo                            │
│ ├─ municipio_id → FK(Municipios)             │
│ ├─ capacidade, conservacao                   │
│ ├─ acessibilidade: { rampa, elevador... }   │
│ └─ linguagens[]                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ Municipios (mockMunicipios)                  │
│ ├─ id, nome                                  │
│ ├─ lat, lng (geolocalização)                 │
│ ├─ mesorregiao                               │
│ └─ populacao                                 │
└──────────────────────────────────────────────┘
```

### Padrão de Consumo de Dados

```typescript
// Exemplo: Componente consome dados mockados + aplica filtros globais

import { useMapFilter } from '@/contexts/MapFilterContext';
import { agentesCenso, buildAgentesCenso } from '@/data/mockCensoAuxiliar';

export function DemografiaCharts() {
  const { filters } = useMapFilter();
  
  // 1. Carregar dados mockados (normalizado em /data)
  const agentes = useMemo(() => buildAgentesCenso(), []);
  
  // 2. Aplicar filtros globais
  const agentesFiltrados = useMemo(() => {
    let result = agentes;
    
    // Se há filtro de município
    filters.forEach(f => {
      if (f.tipo === 'municipio' && f.meta?.municipio) {
        result = result.filter(a => a.municipio === f.meta.municipio);
      }
    });
    
    return result;
  }, [agentes, filters]);
  
  // 3. Renderizar componente
  return <DnutChart data={agentesFiltrados.genero} />;
}
```

---

## 🎨 Design System + Animações

### 1. Paleta de Cores Implementada

```typescript
// tailwind.config.ts
const colors = {
  // Semânticas do negócio
  artistas: '#3155A4',      // Azul — Produtores/Coletivos no mapa
  projetos: '#00AD4A',      // Verde — Projetos ativos
  espacos: '#FFB511',       // Amarelo — Espaços culturais
  desertos: '#C34342',      // Vermelho — Desertos culturais
  
  // Status de conservação
  conservacao: {
    excelente: '#22c55e',   // Verde
    bom: '#06b6d4',         // Azul claro
    regular: '#f97316',     // Laranja
    precario: '#ef4444',    // Vermelho
  },
  
  // Formalização
  informal: '#ef5350',
  mei: '#ff9800',
  associacao: '#4caf50',
};
```

### 2. Componentes Reutilizáveis

```typescript
// Padrão: MiniKPI Card (usado em todas as abas)
export interface MiniKPIProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;      // "+8,2%" ou "-3,1%"
    positive: boolean;  // true = verde, false = vermelho
  };
  accentColor?: string; // "bg-primary/10 text-primary"
}

// Uso:
<MiniKPI
  label="Total de Artistas"
  value="662"
  trend={{ value: "+8,2%", positive: true }}
  icon={<Users />}
  accentColor="bg-blue-100 text-blue-900"
/>

// Padrão: Seção Colapsável
<CollapsibleSection
  sectionKey="perfil-demografico"
  title="Perfil Demográfico"
  defaultOpen={true}
>
  {/* Conteúdo */}
</CollapsibleSection>
```

### 3. Animações & Transições

```css
/* Tailwind classes aplicadas no código */

/* Card hover: sombra suave */
.card {
  @apply hover:shadow-md transition-shadow duration-200;
}

/* Drawer abertura: slide bottom + fade */
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Filtro aplicado: pulse animado */
@keyframes pulse-filter {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Badge trending: pulsação contínua */
.badge-trending {
  animation: pulse-filter 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Collapse altura + fade */
@keyframes slideDown {
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
}

/* Mapa zoom suave: Leaflet nativo (800ms) */
.leaflet-zoom-anim .leaflet-zoom-animated {
  animation: zoomInOut 0.8s ease-in-out;
}
```

### 4. Microinterações

```typescript
// Skeleton Loading (durante fetch dados)
export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-8 bg-gray-300 rounded w-full" />
    </div>
  );
}

// Toast de sucesso/erro
const { toast } = useToast();

// Ao salvar dados (P2 edita espaço)
toast({
  title: "Sucesso!",
  description: "Dados atualizados com sucesso",
  duration: 4000,
  className: "bg-green-100 text-green-900",
});

// Botão com spinner
export function ButtonWithSpinner({ isLoading, ...props }) {
  return (
    <button disabled={isLoading} {...props}>
      {isLoading ? <Spinner className="mr-2" /> : null}
      {isLoading ? "Salvando..." : "Salvar"}
    </button>
  );
}
```

---

## 📁 Estrutura de Arquivos do Dashboard

```
src/
├── components/
│   ├── DashboardLayout.tsx              (Header + Sidebar + contexto geral)
│   ├── NotificationBell.tsx             (Ícone notificações + dropdown)
│   ├── PaginacaoTabela.tsx              (Componente reutilizável de paginação)
│   ├── ProtectedRoute.tsx               (Guarda de rotas por role)
│   ├── ReportPreviewDialog.tsx          (Modal de preview PDF)
│   ├── InvestmentProposalDialog.tsx     (Modal para propostas de investimento)
│   └── ui/                              (Shadcn/ui componentes — Button, Card, Badge, etc.)
│
├── pages/
│   ├── DadosDashboard.tsx               (🗺️ ABA 1 — Mapa territorial)
│   │   └── MapaCenso.tsx                (Mapa Leaflet + camadas)
│   │   └── LegendaMapa.tsx              (Legenda dinâmica)
│   │   └── PainelControle.tsx           (Toggles camadas)
│   │
│   ├── PerfilEcossistema.tsx            (👥 ABA 2 — Perfil + demografia)
│   │   ├── DemografiaCharts.tsx         (Donuts + barras gênero/raça/faixa)
│   │   ├── EvolucaoCadastros.tsx        (Gráfico linha 12 meses)
│   │   ├── CapilaridadeKPI.tsx          (Mini-mapa + breakdown mesorregião)
│   │   ├── TabelaColetivos.tsx          (DataTable coletivos + filtros)
│   │   ├── ColetivosDetalhes.tsx        (Detalhe coletivo page)
│   │   ├── SocioeconomicoPanel.tsx      (Renda, escolaridade, vulnerabilidade)
│   │   └── IVCIndicador.tsx             (Cálculo + visualização IVC)
│   │
│   ├── Infraestrutura.tsx               (🏛️ ABA 3 — Espaços culturais)
│   │   ├── InfraestruturaTab.tsx        (Métricas agregadas espaços)
│   │   ├── QualidadeEspacos.tsx         (Conservação + acessibilidade)
│   │   ├── InventarioEquipamentos.tsx   (Tabela inventário por município)
│   │   ├── EspacoDetalhes.tsx           (Detalhe espaço page)
│   │   └── AcessibilidadePanel.tsx      (Checklist acessibilidade PCDs)
│   │
│   ├── DashboardFinanceiro.tsx          (💰 ABA 4 — Projetos + orçamento)
│   │   ├── VisaoGeralProjetos.tsx       (Cards KPI + gráfico evolução)
│   │   ├── DistribuicaoProjetos.tsx     (Mapa calor territorial)
│   │   ├── TabelaProjetos.tsx           (DataTable + filtros avançados)
│   │   ├── impactoFinanceiroPanel.tsx   (Renda média, alavancagem, crowdfunding)
│   │   ├── AlcanceSocial.tsx            (Público, perfil demográfico, comentários)
│   │   ├── FormalizacaoIndicador.tsx    (Área empilhada evolução)
│   │   └── OrcamentoFomento.tsx         (Execução orçamentária + distribuição territorial)
│   │
│   ├── Login.tsx                        (Auth — já implementado M1-E1)
│   ├── MeuPerfil.tsx                    (Configurações usuário)
│   └── NotFound.tsx                     (404 fallback)
│
├── contexts/
│   ├── AuthContext.tsx                  (P1, P2, P3 roles ✅)
│   ├── MapFilterContext.tsx             (Filtros globais propagados)
│   ├── NotificationContext.tsx          (Toasts + broadcast)
│   ├── WhiteLabelContext.tsx            (Logo + cores customizáveis)
│   └── CollapseSectionContext.tsx       (Estado colapsáveis entre tabs)
│
├── hooks/
│   ├── useFinanceiro.ts                 (Dados financeiros + cache)
│   ├── useEcossistemaData.ts            (Dados ecossistema formatados)
│   ├── useOportunidades.ts              (Dados de editais/oportunidades)
│   ├── usePaginacao.ts                  (Lógica de paginação + sorting)
│   ├── useFilter.ts                     (Aplicar múltiplos filtros)
│   └── use-toast.ts                     (Hook padrão shadcn)
│
├── data/
│   ├── mockArtistas.ts                  (~50 artistas relacional)
│   ├── mockProdutoras.ts                (~35 coletivos relacional)
│   ├── mockEquipamentosCulturais.ts     (~25 espaços + tipos variados)
│   ├── mockCensoAuxiliar.ts             (Agregações + buildAgentesCenso())
│   ├── mockMunicipios.ts                (185 municípios PE + lat/lng)
│   ├── mockMapaEntidades.ts             (Georreferenciação)
│   ├── mockProjetos.ts                  (~40 projetos)
│   ├── mockColetivos.ts                 (Detalhe socioeconômico)
│   ├── mockLinguagens.ts                (8 linguagens)
│   ├── mockUsuarios.ts                  (Usuários teste P1, P2, P3)
│   └── mockOportunidades.ts             (Editais abertos)
│
├── lib/
│   └── utils.ts                         (Utilitários — formatação, cálculos)
│
├── types/
│   ├── evento-wizard.ts                 (Tipos eventos)
│   ├── oficina-wizard.ts                (Tipos oficinas)
│   └── ... (tipos reutilizáveis)
│
├── integrations/
│   └── supabase/                        (Future: real data integration)
│
├── public/
│   └── robots.txt
│
├── App.tsx                              (Router + Providers)
├── main.tsx                             (Entry point + React.StrictMode)
├── index.css                            (Tailwind + globais)
├── vite-env.d.ts                        (Tipos Vite)
│
└── [config files]
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── vite.config.ts
    └── eslint.config.js
```

---

## 🔗 Fluxo de Dados — Contextos Globais

### MapFilterContext (Filtros Globais)

```typescript
// src/contexts/MapFilterContext.tsx

interface Filter {
  id: string;
  tipo: 'produtor' | 'projeto' | 'espaco' | 'deserto' | 'municipio';
  label: string;
  meta?: {
    municipio?: string;
    linguagem?: string;
    status?: string;
  };
}

interface MapFilterContextType {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  hasFilter: (tipo: string) => boolean;
}

// Hook customizado
export const useMapFilter = () => {
  const context = useContext(MapFilterContext);
  if (!context) throw new Error('useMapFilter deve être usado dentro de MapFilterProvider');
  return context;
};

// Uso em componentes
export function PerfilAba() {
  const { filters, hasFilter } = useMapFilter();
  
  const agentesFiltrados = useMemo(() => {
    let data = agentesCenso;
    
    if (hasFilter('municipio')) {
      const mun = filters.find(f => f.tipo === 'municipio')?.meta?.municipio;
      data = data.filter(a => a.municipio === mun);
    }
    
    return data;
  }, [filters]);
  
  return (
    <div>
      {filters.length > 0 && (
        <div className="bg-blue-50 p-3 rounded text-sm">
          Dados filtrados por: {filters.map(f => f.label).join(', ')}
        </div>
      )}
      {/* Renderizar gráficos com agentesFiltrados */}
    </div>
  );
}
```

### Propagação entre Abas

```
[ABA 1 - Mapa]
  Clica em marcador
       ↓
  Dispara addFilter(produtor)
       ↓
  MapFilterContext atualiza
       ↓
  Tag aparece no header (DashboardLayout)
       ↓
[ABA 2 - Perfil]
  useMapFilter() lê contexto
       ↓
  useMemo aplica filtro automaticamente
       ↓
  Gráficos atualizam com dados filtrados
```

---

## 📊 Componentes Principais por Aba

### ABA 1 — Mapa (DadosDashboard.tsx)

**Status:** 🔄 85% | **Linhas:** ~800

```typescript
export function DadosDashboard() {
  const [searchMunicipio, setSearchMunicipio] = useState('');
  const [layerVisibility, setLayerVisibility] = useState({
    produtores: true,
    projetos: true,
    espacos: true,
    desertos: true,
  });
  const [tileMode, setTileMode] = useState<'street' | 'satellite'>('street');
  
  const mapRef = useRef<L.Map>(null);
  
  // Dados mockados carregados
  const { produtores, projetos, espacos, desertos } = useMemo(() => ({
    produtores: buildAgentesCenso().slice(0, 100),
    projetos: projetosMock.slice(0, 50),
    espacos: equipamentosCulturaisMock,
    desertos: mockMapaEntidades.desertosCulturaisMock,
  }), []);
  
  // Renderizar mapa com camadas condicionais
  return (
    <div className="flex h-screen">
      {/* Sidebar controle camadas */}
      <PainelControle
        visibility={layerVisibility}
        onToggle={toggleLayer}
      />
      
      {/* Mapa Leaflet */}
      <MapContainer ref={mapRef} center={RECIFE_CENTER} zoom={7}>
        {/* Tile layers */}
        <TileLayer url={TILE_URL} />
        
        {/* Camadas condicionais */}
        {layerVisibility.produtores && (
          <LayerProdutores data={produtores} onClick={handleMarkerClick} />
        )}
        {layerVisibility.projetos && (
          <LayerProjetos data={projetos} onClick={handleMarkerClick} />
        )}
        {/* etc */}
        
        {/* Legenda dinâmica */}
        <LegendaMapa visibility={layerVisibility} counts={...} />
      </MapContainer>
    </div>
  );
}
```

**Componentes Filhos:**
- `MapaCenso.tsx`: Renderização mapa + camadas
- `PainelControle.tsx`: Toggles + contadores
- `LegendaMapa.tsx`: Legenda dinâmica
- `ModalEntidade.tsx`: Popup com filtro global

---

### ABA 2 — Perfil (PerfilEcossistema.tsx)

**Status:** 🔄 72% | **Linhas:** ~1.200

```typescript
export function PerfilEcossistema() {
  const { filters } = useMapFilter();
  const agentes = useMemo(() => buildAgentesCenso(), []);
  
  // Aplicar filtros
  const agentesFiltrados = useMemo(() => {
    let data = agentes;
    // Apply filters...
    return data;
  }, [agentes, filters]);
  
  return (
    <div className="space-y-6">
      {/* Seção: Visão geral (US-08) */}
      <MiniKPI
        label="Total de Artistas"
        value={agentesFiltrados.length}
        trend={{ value: "+8,2%", positive: true }}
      />
      
      {/* Grid de gráficos */}
      <grid className="grid grid-cols-2 gap-4">
        <Card>
          <DontChart data={agentesFiltrados.genero} title="Gênero" />
        </Card>
        <Card>
          <DontChart data={agentesFiltrados.raca} title="Raça/Cor" />
        </Card>
      </grid>
      
      <CollapsibleSection title="Perfil Demográfico Completo">
        <DemografiaCharts data={agentesFiltrados} />
      </CollapsibleSection>
      
      {/* Seção: Evolução cadastros (US-09) */}
      <CollapsibleSection title="Evolução de Cadastros" defaultOpen>
        <EvolucaoCadastros data={evolutionData} />
      </CollapsibleSection>
      
      {/* Seção: Capilaridade (US-10) */}
      <CollapsibleSection title="Capilaridade do Ecossistema">
        <CapilaridadeKPI data={municipiosComAgentes} />
      </CollapsibleSection>
      
      {/* Seção: Socioeconômico (US-11) */}
      <CollapsibleSection title="Painel Socioeconômico">
        <SocioeconomicoPanel data={agentesFiltrados} />
      </CollapsibleSection>
      
      {/* Seção: Tabela coletivos (US-12) */}
      <CollapsibleSection title="Tabela de Coletivos">
        <TabelaColetivos 
          data={coletivosFiltrados} 
          onRowClick={(coletivo) => navigate(`/coletivos/${coletivo.id}`)}
        />
      </CollapsibleSection>
    </div>
  );
}
```

**Componentes Filhos:**
- `DemografiaCharts.tsx`: Donuts + barras
- `EvolucaoCadastros.tsx`: Gráfico linha + toggle editais
- `CapilaridadeKPI.tsx`: Mini-mapa + breakdown
- `SocioeconomicoPanel.tsx`: Renda, escolaridade, vulnerabilidade, IVC
- `TabelaColetivos.tsx`: DataTable reutilizável
- `ColetivosDetalhes.tsx`: Page — detalhe coletivo

---

### ABA 3 — Espaços (Infraestrutura.tsx)

**Status:** 🔄 68% | **Linhas:** ~800

```typescript
export function Infraestrutura() {
  const espacos = equipamentosCulturaisMock;
  
  const metrics = useMemo(() => ({
    total: espacos.length,
    ativos: espacos.filter(e => e.status === 'Ativo').length,
    capacidadeTotal: espacos.reduce((sum, e) => sum + e.capacidade, 0),
    porTipo: groupBy(espacos, 'tipo'),
    porConservacao: groupBy(espacos, 'conservacao'),
  }), [espacos]);
  
  return (
    <div className="space-y-6">
      {/* Cards resumo (US-15) */}
      <div className="grid grid-cols-2 gap-4">
        <MiniKPI label="Total Espaços" value={metrics.total} />
        <MiniKPI label="Capacidade Instalada" value={formatMil(metrics.capacidadeTotal)} />
      </div>
      
      {/* Bloco: Frequência e uso */}
      <CollapsibleSection title="Frequência e Uso">
        <div className="grid grid-cols-2 gap-4">
          <BarChart data={metrics.porTipo} title="Público Mensal por Tipo" />
          <LineChart data={publicoMensal12m} title="Evolução Público (12 meses)" />
        </div>
      </CollapsibleSection>
      
      {/* Bloco: Conservação */}
      <CollapsibleSection title="Qualidade e Conservação">
        <QualidadeEspacos data={metrics.porConservacao} />
      </CollapsibleSection>
      
      {/* Bloco: Acessibilidade */}
      <CollapsibleSection title="Acessibilidade para PCDs">
        <AcessibilidadePanel data={espacos} />
      </CollapsibleSection>
      
      {/* Tabela: Inventário (US-16) */}
      <CollapsibleSection title="Inventário de Espaços por Município">
        <InventarioEquipamentos 
          data={espacos}
          onRowClick={(espaco) => navigate(`/espacos/${espaco.id}`)}
        />
      </CollapsibleSection>
    </div>
  );
}
```

**Componentes Filhos:**
- `InfraestruturaTab.tsx`: Agregação principal
- `QualidadeEspacos.tsx`: Donuts + área empilhada
- `AcessibilidadePanel.tsx`: Barras + heatmap
- `InventarioEquipamentos.tsx`: DataTable
- `EspacoDetalhes.tsx`: Page — detalhe espaço

---

### ABA 4 — Projetos (DashboardFinanceiro.tsx)

**Status:** 🔄 62% | **Linhas:** ~1.000

```typescript
export function DashboardFinanceiro() {
  const { filters } = useMapFilter();
  const projetos = projetosMock;
  
  const metrics = useMemo(() => ({
    ativos: projetos.filter(p => p.status === 'Ativo').length,
    concluidos: projetos.filter(p => p.status === 'Concluído').length,
    valor_total: projetos.reduce((sum, p) => sum + p.valor, 0),
    publico_total: projetos.reduce((sum, p) => sum + p.publico_impactado, 0),
  }), [projetos]);
  
  return (
    <div className="space-y-6">
      {/* Visão geral (US-19) */}
      <CollapsibleSection title="Visão Geral dos Projetos" defaultOpen>
        <VisaoGeralProjetos data={metrics} />
      </CollapsibleSection>
      
      {/* Distribuição territorial (US-20) */}
      <CollapsibleSection title="Distribuição Territorial e por Linguagem">
        <DistribuicaoProjetos data={projetos} />
      </CollapsibleSection>
      
      {/* Impacto financeiro (US-21) */}
      <CollapsibleSection title="Impacto Financeiro e Econômico">
        <ImpactoFinanceiroPanel data={metrics} />
      </CollapsibleSection>
      
      {/* Alcance social (US-22) */}
      <CollapsibleSection title="Alcance Social e Comentários">
        <AlcanceSocialPanel data={projetos} />
      </CollapsibleSection>
      
      {/* Formalização (US-23) */}
      <CollapsibleSection title="Formalização dos Coletivos">
        <FormalizacaoIndicador data={evolutionFormalização} />
      </CollapsibleSection>
      
      {/* Tabela projetos (US-24) */}
      <CollapsibleSection title="Tabela de Projetos com Filtros">
        <TabelaProjetos 
          data={projetos}
          onRowClick={(projeto) => navigate(`/projetos/${projeto.id}`)}
        />
      </CollapsibleSection>
      
      {/* Orçamento (US-25) */}
      <CollapsibleSection title="Execução Orçamentária e Fomento">
        <OrcamentoFomento data={instrumentos} />
      </CollapsibleSection>
    </div>
  );
}
```

**Componentes Filhos:**
- `VisaoGeralProjetos.tsx`: KPIs + linha 12m
- `DistribuicaoProjetos.tsx`: Mapa heatmap + barras linguagem
- `ImpactoFinanceiroPanel.tsx`: Cards + gráficos
- `AlcanceSocialPanel.tsx`: Perfil público + comentários
- `FormalizacaoIndicador.tsx`: Área empilhada
- `TabelaProjetos.tsx`: DataTable + filtros avançados
- `OrcamentoFomento.tsx`: Tabelas execução + distribuição

---

## 🔐 Permissões por Persona

```typescript
// src/lib/permissions.ts

export const PERMISSIONS = {
  P1: { // Secretario(a)
    read: ['mapa', 'perfil', 'espacos', 'projetos', 'auditoria'],
    edit: [],
    export: false,
  },
  P2: { // Tecnico/Analista
    read: ['mapa', 'perfil', 'espacos', 'projetos', 'auditoria'],
    edit: ['espacos', 'projetos'], // Pode editar dados específicos
    export: true, // CSV
  },
  P3: { // Gestor Editais
    read: ['auditoria', 'acessoRestrito'], // Acesso restrito à auditoria
    edit: ['auditoria:sinalizar', 'auditoria:aprovar'],
    export: true,
  },
};

// Hook
export const useCanEdit = (section: string) => {
  const { user } = useAuth();
  return PERMISSIONS[user.role]?.edit?.includes(section);
};
```

---

## ⏳ Histórias Não Iniciadas (Roadmap)

| Código | Título | Estimativa | Bloqueador |
|---|---|---|---|
| M1-E2-US-14 | Modal membro coletivo | 2 dias | Nenhum |
| M1-E2-US-18 | Edição espaço | 3 dias | Nenhum |
| M1-E2-US-22 | (Refinamento) Alcance social completo | 4 dias | Dados comentários |
| M1-E2-US-25 | (Refinamento) Orçamento completo | 3 dias | Dados financeiros |

**Total Estimado Conclusão:** ~12 dias de dev

---

## 🐛 Pendências e Issues Conhecidas

| # | Problema | Severidade | Fix |
|---|---|---|---|
| 1 | Panes z-index Leaflet não totalmente aplicado (US-07) | Baixa | Implementar map.getPane() no PaneSetup |
| 2 | Mini-mapa capilaridade (US-10) sem drag/zoom — hover lag em 50+ municípios | Baixa | Memoizar renderização CircleMarker |
| 3 | TabelaColetivos (US-12) filtros IVC não aplicando ao buscar nome | Média | Adicionar lógica AND nos filtros |
| 4 | EspacoDetalhes (US-17) lightbox fotos ainda implementado parcialmente | Média | Integrar yet-another-react-lightbox ou nativa |
| 5 | ColetivosDetalhes (US-13) campos de Projetos redirecionam para placeholder M2 | Baixa | Aguardar M1-E5 Backend |
| 6 | Performance: DemografiaCharts recompila em cada filtro (sem memo otimizado) | Baixa | Ativar StrictMode + React.memo nos Charts |

---

## 📈 Métricas de Performance

```
Bundle Size (Vite build):
  - Main JS: ~240KB (gzipped ~60KB)
  - CSS: ~85KB (gzipped ~18KB)
  - Total: ~78KB gzipped

Performance no Localhost:
  - DadosDashboard (Mapa): ~450ms initial load
  - PerfilEcossistema: ~300ms (com dados mockados)
  - Infraestrutura: ~280ms
  - DashboardFinanceiro: ~320ms

Dados Mockados:
  - Artistas: 662 registros
  - Coletivos: 35 registros
  - Espaços: 25 registros
  - Projetos: 40 registros
  - Total em memória: ~450KB
```

---

## 🚀 Próximas Fases

### Fase 2: Integração Supabase (M1-E5 Backend)

```typescript
// Futura substituição de mocks por real data:

// Antes:
import { agentesCenso } from '@/data/mockCensoAuxiliar';

// Depois:
import { useSupabase } from '@/integrations/supabase';

export function PerfilEcossistema() {
  const { data: agentes, isLoading } = useSupabase('artistas', {
    select: '*',
    filter: e => e.municipio_id.in(selectedMunicipios)
  });
  
  return isLoading ? <Skeleton /> : <Charts data={agentes} />;
}
```

### Fase 3: IA Preditiva (M1-E3)

- ABA 5 IA Preditiva: Previsões de demanda, tendências, insights automáticos
- Integração com backend de ML (FastAPI / similar)

### Fase 4: Auditoria (M1-E4)

- ABA Auditoria: Conformidade, sinalização de irregularidades (P3 apenas)
- Compartilhamento de componente detalhe projeto com ABA 4

---

## 📚 Referências Implementadas

- **Design:** Shadcn/ui patterns + Tailwind CSS
- **Gráficos:** Recharts (LineChart, BarChart, PieChart, AreaChart)
- **Mapa:** React Leaflet v4 + Leaflet v1.9
- **Estado:** React Context + Hooks customizados
- **Roteamento:** React Router v6
- **Build:** Vite + TypeScript
- **Package Manager:** Bun

---

*CENA · M1-E2 · Dashboard de Dados · Especificação Técnica · Abril 2026*  
*Versão: 2.1 | Última Atualização: Abril 2026 | Status: 72% Implementado*
