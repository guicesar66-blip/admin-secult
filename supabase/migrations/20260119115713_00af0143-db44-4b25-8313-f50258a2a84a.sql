-- ============================================================================
-- Migration: Adicionar campos para o wizard de 11 steps de oficinas
-- Descrição: Campos baseados no documento CENA_Admin_Fluxo_Criacao_Oficinas_v1
-- Todos os campos são opcionais para manter compatibilidade com dados existentes
-- ============================================================================

-- STEP 1: JUSTIFICATIVA
ALTER TABLE public.oficinas 
ADD COLUMN IF NOT EXISTS justificativa TEXT,
ADD COLUMN IF NOT EXISTS linguagem_artistica TEXT,
ADD COLUMN IF NOT EXISTS territorios TEXT[];

-- STEP 2 e 3: OBJETIVOS
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS objetivo_geral TEXT,
ADD COLUMN IF NOT EXISTS objetivos_especificos JSONB;

-- STEP 4: METODOLOGIA (etapas/encontros estruturados)
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS metodologia_descricao TEXT,
ADD COLUMN IF NOT EXISTS etapas_encontros JSONB,
ADD COLUMN IF NOT EXISTS endereco_completo TEXT;

-- STEP 5: DIVULGAÇÃO E MARCA
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS canais_divulgacao TEXT[],
ADD COLUMN IF NOT EXISTS descricao_divulgacao TEXT,
ADD COLUMN IF NOT EXISTS marcas_parceiras JSONB;

-- STEP 6: PLANO DE MÍDIA
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS estrategia_campanha TEXT,
ADD COLUMN IF NOT EXISTS parcerias_midia JSONB,
ADD COLUMN IF NOT EXISTS cobertura_evento TEXT[];

-- STEP 7: ACESSIBILIDADE E ACOLHIMENTO
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS recursos_acessibilidade TEXT[],
ADD COLUMN IF NOT EXISTS descricao_acolhimento TEXT;

-- STEP 8: EQUIPAMENTOS E MATERIAIS
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS equipamentos_materiais JSONB;

-- STEP 9: PÚBLICO E CRONOGRAMA
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS quantidade_participantes INTEGER,
ADD COLUMN IF NOT EXISTS faixa_etaria_min INTEGER,
ADD COLUMN IF NOT EXISTS faixa_etaria_max INTEGER,
ADD COLUMN IF NOT EXISTS perfil_participante TEXT,
ADD COLUMN IF NOT EXISTS equipe_instrutores JSONB,
ADD COLUMN IF NOT EXISTS equipe_apoio JSONB,
ADD COLUMN IF NOT EXISTS periodo_inscricoes_inicio DATE,
ADD COLUMN IF NOT EXISTS periodo_inscricoes_fim DATE,
ADD COLUMN IF NOT EXISTS periodo_oficinas_inicio DATE,
ADD COLUMN IF NOT EXISTS periodo_oficinas_fim DATE,
ADD COLUMN IF NOT EXISTS periodo_producao_inicio DATE,
ADD COLUMN IF NOT EXISTS periodo_producao_fim DATE,
ADD COLUMN IF NOT EXISTS data_evento_final DATE,
ADD COLUMN IF NOT EXISTS tamanho_grupos INTEGER;

-- STEP 10: PLANILHA DE CUSTOS
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS itens_custo JSONB,
ADD COLUMN IF NOT EXISTS reserva_tecnica_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS orcamento_total NUMERIC(12,2);

-- STEP 11: RESULTADOS ESPERADOS
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS resultados_quantitativos JSONB,
ADD COLUMN IF NOT EXISTS resultados_qualitativos TEXT,
ADD COLUMN IF NOT EXISTS indicadores_sucesso JSONB;

-- CONTROLE DO WIZARD
ALTER TABLE public.oficinas
ADD COLUMN IF NOT EXISTS step_atual INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS status_wizard TEXT DEFAULT 'rascunho' 
  CHECK (status_wizard IN ('rascunho', 'completo', 'publicado'));

-- Comentários para documentação
COMMENT ON COLUMN public.oficinas.justificativa IS 'Step 1: Contextualização da relevância do projeto';
COMMENT ON COLUMN public.oficinas.linguagem_artistica IS 'Step 1: Música, Teatro, Dança, Artes Visuais, Audiovisual, Literatura, Circo, Cultura Popular, Multidisciplinar';
COMMENT ON COLUMN public.oficinas.territorios IS 'Step 1: Lista de bairros/territórios de atuação';
COMMENT ON COLUMN public.oficinas.objetivo_geral IS 'Step 2: Propósito principal do projeto';
COMMENT ON COLUMN public.oficinas.objetivos_especificos IS 'Step 3: Array de {titulo, descricao, emoji}';
COMMENT ON COLUMN public.oficinas.metodologia_descricao IS 'Step 4: Descrição detalhada da metodologia';
COMMENT ON COLUMN public.oficinas.etapas_encontros IS 'Step 4: Array de {titulo, descricao, duracao_horas, modalidade}';
COMMENT ON COLUMN public.oficinas.canais_divulgacao IS 'Step 5: Lista de canais selecionados';
COMMENT ON COLUMN public.oficinas.marcas_parceiras IS 'Step 5: Array de {nome, tipo, logo_url}';
COMMENT ON COLUMN public.oficinas.recursos_acessibilidade IS 'Step 7: Lista de recursos de acessibilidade';
COMMENT ON COLUMN public.oficinas.equipamentos_materiais IS 'Step 8: Categorias com itens {nome_categoria, itens[]}';
COMMENT ON COLUMN public.oficinas.itens_custo IS 'Step 10: Array de {item, categoria, quantidade, valor_unitario, total, fonte}';
COMMENT ON COLUMN public.oficinas.resultados_quantitativos IS 'Step 11: Array de {descricao, meta_numerica, unidade}';
COMMENT ON COLUMN public.oficinas.indicadores_sucesso IS 'Step 11: Array de {indicador, meta}';
COMMENT ON COLUMN public.oficinas.step_atual IS 'Controle: Step atual do wizard (1-11)';
COMMENT ON COLUMN public.oficinas.status_wizard IS 'Controle: rascunho, completo, publicado';