# CENA — Histórias de Usuário
## Módulo 1 · Épico 2: Dashboard de Dados

**Código:** M1-E2 · **Protótipo em Desenvolvimento · Abril 2026**

---

## Perguntas Estratégicas Respondidas

| Pergunta | Aba |
|---|---|
| **Onde está tudo?** | Mapa |
| **Quem são os fazedores de cultura?** | Perfil do Ecossistema |
| **Como estão os espaços?** | Espaços Culturais |
| **O que está sendo feito, com qual recurso e resultado?** | Projetos e Orçamento |

---

## Personas

| ID | Persona | Papel |
|---|---|---|
| **P1** | Secretário(a) de Cultura | Visão estratégica — lê, interpreta, relatórios |
| **P2** | Técnico/Analista da Secretaria | Operação diária — filtra, cruza, exporta, edita |

---

# 📟 Histórias de Usuário por Aba

---

## ABA 1 — Mapa

### M1-E2-US-01 · Mapa base com camadas de entidades

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver um mapa de Pernambuco com quatro tipos de entidades de forma sobreposta em camadas independentes,
**Para que** eu tenha uma leitura territorial completa de quem está onde.

**Critérios de Aceitação:**
- [✅] O mapa ocupa toda a área da aba com PE visível por padrão
- [✅] Zoom in/out via botões (+/–) e scroll do mouse
- [✅] Arrasto habilitado
- [⏳] Controle de granularidade: seletor "Estado" / "Município"
- [✅] Transição de zoom animada e fluida
- [✅] Quatro camadas de entidades com cores: Produtores (azul `#3155A4`), Projetos (verde `#00AD4A`), Espaços (amarelo `#FFB511`), Desertos (vermelho `#C34342`)
- [✅] Legenda dinâmica no rodapé/mapa exibindo apenas camadas ativas + contadores

**STATUS:** ✅ **COMPLETO** — Mapa implementado com todas camadas, cores corretas, zoom animado e legenda dinâmica.

---

### M1-E2-US-02 · Painel de controle de camadas (toggles)

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** controlar quais camadas de entidades aparecem no mapa através de toggles,
**Para que** eu possa focar a leitura no tipo de informação que preciso.

**Critérios de Aceitação:**
- [✅] Painel de controle fixo no canto superior direito do mapa (colapsável)
- [✅] Quatro toggles com label e contador: Produtores/Coletivos (N) · Projetos (N) · Espaços Culturais (N) · Desertos Culturais
- [✅] Ao desativar um toggle, os marcadores daquela camada desaparecem com animação suave
- [✅] Ao ativar, os marcadores reaparecem com animação suave
- [✅] O painel mostra o total de entidades visíveis: "X entidades no mapa"
- [✅] Botão "Mostrar todas" reativa todos os toggles simultaneamente
- [✅] Estado dos toggles persiste ao navegar entre abas e retornar ao mapa
- [✅] Filtros adicionais expansíveis por camada: linguagem artística (Produtores), status (Projetos), tipo (Espaços), prioridade (Desertos)

---

### M1-E2-US-03 · Modal de entidade e filtro global

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** clicar em qualquer marcador do mapa e ver um modal com informações resumidas da entidade e opção de aplicar filtro global,
**Para que** eu possa ir diretamente do mapa para análise aprofundada daquela entidade em qualquer aba.

**Critérios de Aceitação:**
- [✅] Modal pequeno abre próximo ao marcador clicado, com seta apontando para ele
- [✅] Cabeçalho: ícone do tipo + nome em destaque + badge do tipo
- [🔄] Corpo: dados resumidos específicos por tipo (nome, linguagem, município, nº projetos, score)
- [🔄] Rodapé: botão "Aplicar filtro global" em destaque e link "Ver detalhe completo"
- [✅] Botão X fecha sem aplicar filtro
- [✅] Clique fora do modal fecha sem aplicar filtro
- [✅] Ao clicar "Aplicar filtro global": tag aparece no header, modal fecha, todas as abas exibem dados filtrados pelo contexto

---

### M1-E2-US-04 · Tag de filtro global no header

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver uma tag visível no header do dashboard indicando que um filtro global está ativo,
**Para que** eu saiba em todo momento que os dados estão contextualizados por um filtro.

**Critérios de Aceitação:**
- [✅] Quando um filtro global está ativo, uma tag aparece no header à direita do menu de abas
- [✅] A tag exibe: ícone do tipo de entidade + nome da entidade + botão X
- [✅] Múltiplos filtros ativos aparecem como múltiplas tags lado a lado
- [✅] Clicar no X de uma tag remove aquele filtro e restaura os dados
- [✅] Botão "Limpar todos os filtros" aparece quando há mais de um filtro ativo
- [🔄] Uma faixa de aviso discreta abaixo do menu de abas exibe: "Dados filtrados por: [lista]. Os gráficos refletem apenas o contexto selecionado."
- [🔄] Métricas que não se aplicam ao filtro exibem "—" ou "Não disponível"
- [✅] Ao remover o filtro, todos os dados voltam à visão completa imediatamente
- [✅] O filtro persiste ao navegar entre abas, mas reseta no logout

---

### M1-E2-US-05 · Busca por município e zoom territorial

**Como** Técnico/Analista (P2),
**Quero** buscar um município pelo nome e navegar diretamente para aquela área no mapa,
**Para que** eu faça análise territorial focada sem precisar navegar manualmente.

**Critérios de Aceitação:**
- [✅] Campo de busca visível acima do mapa (barra de pesquisa)
- [✅] Sugestões de autocomplete ao digitar (até 8 municípios)
- [✅] Ao selecionar um município, o mapa centraliza e dá zoom automaticamente
- [✅] Indicação visual clara: bordas do município selecionado destacadas
- [✅] Botão "Ver Pernambuco completo" restaura a visão estadual e remove destaque
- [✅] A busca por município NÃO aplica filtro global (apenas navegação visual)

---

### M1-E2-US-06 · Troca de base do mapa (Street / Satélite)

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** alternar a base do mapa entre visão de rua (padrão) e visão de satélite,
**Para que** eu tenha contexto geográfico real ao analisar a distribuição territorial.

**Critérios de Aceitação:**
- [✅] Controle de troca de base visível no canto inferior direito do mapa (botão ou seletor)
- [✅] Opções: "Rua" (OSM) e "Satélite" (Esri WorldImagery)
- [✅] Ao selecionar "Satélite", a base muda — todos os marcadores permanecem visíveis
- [✅] Ao voltar para "Rua", restaura o tile padrão
- [✅] Nenhum marcador some, nenhum filtro é alterado
- [✅] A opção selecionada fica visualmente destacada no controle

---

### M1-E2-US-07 · Panes e hierarquia visual das camadas

**Como** sistema,
**Quero** garantir que as camadas do mapa se sobreponham na ordem correta sem conflito de z-index,
**Para que** os usuários sempre vejam os marcadores na frente das sobreposições.

**Critérios de Aceitação:**
- [🔄] Z-index das camadas (do mais baixo para o mais alto): Desertos (350) → Municípios (400) → Espaços (450) → Projetos (500) → Produtores (550)
- [✅] Container do mapa tem `position: relative; z-index: 0` para isolamento de stacking context
- [✅] O header da plataforma fica sempre acima do mapa
- [🔄] Modal de entidade (US-03) renderizado via Portal com z-index 1000
- [✅] Tags de filtro no header (US-04) gerenciadas pelo layout principal

---

## Resumo ABA 1 — Mapa

| Código | Título | Personas | Prioridade |
|---|---|---|---|
| M1-E2-US-01 | Mapa base com camadas | P1, P2 | Alta |
| M1-E2-US-02 | Painel de controle (toggles) | P1, P2 | Alta |
| M1-E2-US-03 | Modal de entidade + filtro global | P1, P2 | Alta |
| M1-E2-US-04 | Tag de filtro no header | P1, P2 | Alta |
| M1-E2-US-05 | Busca e zoom por município | P2 | Média |
| M1-E2-US-06 | Troca de base (Street/Satélite) | P1, P2 | Média |
| M1-E2-US-07 | Panes e z-index | Sistema | Alta |

---

## ABA 2 — Perfil do Ecossistema

### M1-E2-US-08 · Visão geral do perfil dos agentes culturais

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver um painel com características demográficas e de formalização dos agentes cadastrados,
**Para que** eu entenda quem compõe o ecossistema e identifique grupos sub-representados.

**Critérios de Aceitação:**
- [🔄] Aba exibe em sequência: Total de agentes, Distribuição por gênero, Distribuição por raça/cor, Distribuição por faixa etária, Distribuição por formalização, Distribuição por linguagem artística
- [🔄] Cada bloco tem título, gráfico e número absoluto correspondente
- [🔄] Todos os gráficos respondem ao filtro global
- [🔄] Card de destaque inclui variação percentual e absoluta vs. período anterior, com ícone de tendência
- [🔄] Gênero e Raça/Cor usam gráficos Donut (rosca) com legenda lateral
- [🔄] Faixa Etária, Formalização e Linguagem usam barras horizontais com barra de progresso visual

---

### M1-E2-US-09 · Evolução de cadastros ao longo do tempo

**Como** Técnico/Analista (P2),
**Quero** ver a evolução mensal de novos cadastros de artistas na plataforma,
**Para que** eu identifique sazonalidade, picos de adesão e impacto de ações de divulgação.

**Critérios de Aceitação:**
- [✅] Gráfico de linha com série temporal dos últimos 12 meses de novos cadastros
- [✅] Possibilidade de sobrepor linha de "editais abertos no período" para correlação visual
- [✅] Anotações automáticas nos picos (ex: "Pico em março — abertura SIC 2024")
- [✅] Hover em um ponto exibe: mês, total novos cadastros e variação vs. mês anterior
- [✅] Toggle de "editais abertos" renderizado como Switch no header do card
- [✅] Linha de editais com estilo tracejado para diferenciação
- [✅] Picos anotados com cor de alerta visualmente destacada

---

### M1-E2-US-10 · KPI de Capilaridade do ecossistema

**Como** Secretário(a) (P1),
**Quero** ver o Índice de Capilaridade — quantos municípios têm ao menos um agente cadastrado,
**Para que** eu saiba o alcance territorial real da plataforma.

**Critérios de Aceitação:**
- [✅] Card de destaque: nº de municípios com agentes, variação vs. período anterior e % sobre 185 municípios de PE
- [✅] Breakdown por mesorregião (barras horizontais com barra de progresso)
- [✅] Mini-mapa estático com coloração por intensidade de cadastros (CircleMarker)
- [✅] Cores semânticas: verde (≥70%), amarelo (≥30%), vermelho (<30%)
- [✅] Mini-mapa sem scroll, drag ou zoom
- [✅] Mini-mapa sem controles de zoom ou atribuição

---

### M1-E2-US-11 · Painel socioeconômico dos coletivos

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver um painel com indicadores socioeconômicos agregados dos coletivos,
**Para que** eu entenda o contexto social do ecossistema e embase políticas de fomento com recorte de vulnerabilidade.

**Critérios de Aceitação:**

*Bloco: Renda*
- [🔄] Gráfico de barras horizontais com distribuição por faixas: Sem renda · Até R$ 600 · R$ 600–1.320 · R$ 1.320–2.640 · Acima R$ 2.640
- [🔄] Card de destaque: renda média mensal dos membros vs. salário mínimo vigente
- [🔄] Breakdown de renda por linguagem artística

*Bloco: Escolaridade*
- [🔄] Gráfico de donut com distribuição por nível
- [🔄] Comparativo: escolaridade dos membros vs. média do setor cultural de PE

*Bloco: Situação de Moradia e Saneamento*
- [🔄] Gráfico de barras com acesso a serviços básicos: Água encanada · Coleta de lixo · Energia elétrica · Esgoto tratado · Internet
- [🔄] Card de destaque: % de membros sem acesso a ao menos um serviço

*Bloco: Dificuldades Familiares e Vulnerabilidade*
- [🔄] Gráfico de barras com situações: Insegurança alimentar · Dependentes sem renda · Condição de rua · Familiar com deficiência · Beneficiário programa social
- [🔄] Card de destaque: % de coletivos com ao menos 1 membro vulnerável

*Bloco: Índice de Vulnerabilidade Composta*
- [🔄] Gráfico de donut com distribuição: Alta / Média / Baixa vulnerabilidade
- [🔄] Mapa miniatura com coloração dos municípios por IVC médio

---

### M1-E2-US-12 · Tabela de coletivos cadastrados

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver uma tabela com todos os coletivos culturais cadastrados,
**Para que** eu consulte rapidamente informações de cada grupo.

**Critérios de Aceitação:**
- [✅] Colunas exibidas: Avatar · Nome · Linguagem artística · Município · Nº membros · Tempo existência · Status · Score reputação · CNPJ
- [✅] Avatar renderizado como miniatura circular
- [✅] Score exibido como barra de progresso (0–100) com valor numérico
- [✅] Ordenação por qualquer coluna
- [✅] Campo de busca por nome ou município
- [✅] Filtros por: linguagem, município, status, faixa IVC, presença CNPJ
- [✅] Contador: "X coletivo(s) encontrado(s)"
- [✅] Botão "Exportar CSV" (placeholder no protótipo)
- [✅] Clique em linha abre detalhe do coletivo

---

### M1-E2-US-13 · Tela de detalhe do coletivo

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** acessar a ficha completa de um coletivo clicando na tabela,
**Para que** eu tenha todas as informações sobre aquele grupo para subsidiar decisões de fomento.

**Critérios de Aceitação:**

*Cabeçalho:*
- [✅] Imagem de capa (banner horizontal) com ícone de perfil circular sobreposto
- [✅] Nome, linguagem artística (badge), município e status destacados
- [✅] Score de reputação com barra e valor
- [✅] Botão "← Voltar" retorna à tabela

*Seção: Identificação e Dados Gerais:*
- [🔄] Descrição do coletivo (histórico, missão, linguagens)
- [🔄] Data de fundação e tempo de existência
- [🔄] CNPJ ou indicação "Sem CNPJ — coletivo informal"
- [🔄] Nível de formalização
- [🔄] Endereço completo e município
- [🔄] Mapa miniatura com localização
- [🔄] Contato: e-mail, WhatsApp, redes sociais

*Seção: Situação Socioeconômica:*
- [🔄] IVC com badge colorido
- [🔄] Renda média mensal dos membros
- [🔄] % com renda abaixo de 1 SM
- [🔄] Escolaridade predominante + gráfico distribuição compacto
- [🔄] Acesso a serviços básicos: grade de ícones ✅/❌
- [🔄] Situações de vulnerabilidade em badges

*Seção: Galeria de Fotos:*
- [✅] Grid de miniaturas (mínimo 4 imagens)
- [✅] Clique abre lightbox com imagem em tamanho maior

*Seção: Membros do Coletivo:*
- [✅] Lista de membros: foto, nome, função e status
- [✅] Clique em membro abre modal de detalhe
- [✅] Campo de busca por nome
- [✅] Badge indicando representante legal

*Seção: Projetos Realizados:*
- [🔄] Tabela: Nome projeto · Instrumento · Ano · Valor · Status
- [🔄] Card resumo: total projetos, total captado, média público
- [⏳] Clique projeto: placeholder toastMessage "Módulo 2 disponível em breve"

*Seção: Espaços Culturais Vinculados:*
- [✅] Lista de espaços com nome, tipo (badge) e município
- [✅] Clicável (link para detalhe espaço)

---

### M1-E2-US-14 · Modal de detalhe do membro do coletivo

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** abrir o modal de detalhe de um membro a partir da lista no detalhe do coletivo,
**Para que** eu acesse as informações completas cadastrais do artista.

**Critérios de Aceitação:**

*Estrutura do Modal:*
- [✅] Modal abre sobre tela do coletivo (React Portal)
- [✅] Botão X ou clique fora fecha
- [✅] Cabeçalho: foto de perfil, nome completo, função no coletivo

*Dados de Identificação:*
- [✅] Nome completo
- [✅] CPF mascarado por padrão com botão olho revelar (P1/P2 apenas)
- [✅] Data de nascimento e idade
- [✅] Identidade de gênero (autodeclarado)
- [✅] Raça/Cor (autodeclarada)
- [✅] Município de residência (P2 vê endereço completo; P1 vê só município)
- [✅] Contato: e-mail e telefone mascarados (revelável P1/P2)

*Dados de Formação:*
- [🔄] Nível de escolaridade
- [🔄] Área de formação
- [🔄] Certificações e cursos

*Dados Socioeconômicos:*
- [🔄] Faixa de renda mensal
- [🔄] Situação de moradia
- [🔄] Acesso a serviços básicos (grade ✅/❌)
- [🔄] Situações de vulnerabilidade declaradas
- [🔄] Beneficiário de programa social

*Dados Culturais e Profissionais:*
- [✅] Linguagens artísticas praticadas (tags)
- [✅] Tempo de atuação na área (anos)
- [✅] Nível de formalização individual
- [✅] Score de reputação na plataforma (barra + valor)

*Coletivos Relacionados:*
- [✅] Lista de coletivos com período e status (Ativo/Encerrado)
- [✅] Clique em coletivo: fecha modal e abre detalhe do coletivo

*Conformidade:*
- [✅] Rodapé: "Dados coletados com consentimento conforme LGPD. Uso restrito à gestão cultural."

---

## Resumo ABA 2 — Perfil do Ecossistema

| Código | Título | Personas | Prioridade |
|---|---|---|---|
| M1-E2-US-08 | Visão geral perfil agentes | P1, P2 | Alta |
| M1-E2-US-09 | Evolução de cadastros | P2 | Média |
| M1-E2-US-10 | KPI Capilaridade | P1 | Alta |
| M1-E2-US-11 | Painel socioeconômico | P1, P2 | Alta |
| M1-E2-US-12 | Tabela coletivos | P1, P2 | Alta |
| M1-E2-US-13 | Detalhe coletivo | P1, P2 | Alta |
| M1-E2-US-14 | Modal membro | P1, P2 | Alta |

---

## ABA 3 — Espaços Culturais

### M1-E2-US-15 · Painel de métricas agregadas dos espaços culturais

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver um painel com métricas consolidadas sobre todos os espaços culturais,
**Para que** eu tenha visão estratégica da infraestrutura do estado.

**Critérios de Aceitação:**

*Cards de Resumo (topo):*
- [✅] Total de espaços cadastrados com breakdown por tipo
- [✅] Total ativos vs. inativos (badge alerta se inativos > 20%)
- [✅] Capacidade total instalada
- [✅] Público impactado no período
- [✅] Média de projetos por espaço

*Bloco: Frequência e Uso:*
- [🔄] Gráfico de barras: público médio mensal por tipo
- [🔄] Gráfico de linha: evolução mensal público (12 meses)
- [🔄] Taxa de ocupação média (%)
- [🔄] Ranking 10 espaços com maior público (barras horizontais)

*Bloco: Projetos nos Espaços:*
- [🔄] Gráfico barras agrupadas: projetos por tipo espaço
- [🔄] Distribuição por instrumento de fomento
- [🔄] Ranking 10 espaços com mais projetos
- [🔄] Taxa de reuso (% espaços com 3+ projetos)

*Bloco: Qualidade e Conservação:*
- [🔄] Gráfico donut: distribuição por status (Excelente, Bom, Regular, Precário)
- [🔄] Evolução trimestral empilhada (identifica melhora/piora)
- [🔄] Alerta: lista de espaços precários com município
- [🔄] Avaliação média (estrelas 1–5) com breakdown por tipo e origem

*Bloco: Acessibilidade para PCDs:*
- [🔄] Gráfico barras: % com cada recurso (rampa, elevador, banheiro, vagas PCD, piso tátil, audiodescrição, Libras)
- [🔄] Badge: % "Totalmente acessíveis" vs. "Parcialmente" vs. "Não acessíveis"
- [🔄] Índice acessibilidade por mesorregião

*Bloco: Distribuição Territorial:*
- [✅] Gráfico barras: nº espaços por mesorregião
- [✅] Card comparativo: espaços por 100k habitantes por mesorregião
- [✅] Tabela: municípios sem nenhum espaço cultural

*Bloco: Diversidade de Linguagens:*
- [🔄] Heatmap/matriz: tipos espaço (Y) x linguagens (X)
- [🔄] Card: % espaços com 3+ linguagens diferentes
- [🔄] Ranking linguagens mais presentes

---

### M1-E2-US-16 · Inventário de espaços culturais por município

**Como** Técnico/Analista (P2),
**Quero** ver uma tabela com o inventário de espaços culturais por município,
**Para que** eu consulte rapidamente a infraestrutura disponível.

**Critérios de Aceitação:**
- [✅] Tabela filtrável por município, tipo, conservação, acessibilidade
- [✅] Colunas: Município · Tipo · Nome · Capacidade · Acessibilidade badge · Conservação badge · Gestão · Status
- [✅] Campo de busca por nome ou município
- [✅] Ordenação por qualquer coluna
- [✅] Clique em linha abre detalhe do espaço
- [✅] Botão "Exportar CSV" (placeholder)
- [✅] Contador: "X espaço(s) encontrado(s)"
- [✅] Badge "Filtro crítico ativo" quando filtrado por precários

---

### M1-E2-US-17 · Tela de detalhe do espaço cultural

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** acessar a ficha completa de um espaço clicando na tabela,
**Para que** eu tenha todas as informações sobre aquele espaço.

**Critérios de Aceitação:**

*Cabeçalho:*
- [✅] Imagem de capa com nome, tipo (badge), município e status destacados
- [✅] Botão "← Voltar" retorna ao inventário

*Seção: Informações Gerais:*
- [✅] Descrição (histórico, tipo uso, linguagens)
- [✅] Capacidade máxima, horários, tipo gestão, CNPJ, contato
- [✅] Status de conservação (badge colorido)

*Seção: Acessibilidade para PCDs:*
- [✅] Indicador geral (badge): Totalmente / Parcialmente / Não acessível
- [✅] Checklist expansível (8 itens): Rampa · Elevador · Banheiro adaptado · Vagas PCD · Piso tátil · Audiodescrição · Libras
- [✅] Campo de observações

*Seção: Galeria de Fotos:*
- [✅] Grid de miniaturas (mínimo 4 imagens)
- [✅] Lightbox ao clicar + legenda com data

*Seção: Métricas de Uso:*
- [✅] Cards: total projetos · total pessoas · média público/evento · renda gerada (R$)
- [🔄] Gráfico linha: evolução mensal eventos (12 meses)
- [🔄] Perfil demográfico público: faixa etária e gênero (donuts compactos)

*Seção: Instrumentos de Fomento:*
- [🔄] Lista de instrumentos com nº projetos
- [🔄] Gráfico barras: distribuição por instrumento

*Seção: Comentários:*
- [🔄] Abas: Artistas | Cidadãos
- [🔄] Cada comentário: avatar, nome (ou "Anônimo"), data, texto
- [🔄] Avaliação média (estrelas) com nº de avaliações por painel
- [🔄] Mínimo 3 comentários por painel

*Seção: Responsáveis e Artistas:*
- [🔄] Cards de responsáveis: nome, tipo vínculo, período, avatar
- [🔄] Tabela artistas que se apresentaram: Nome · Linguagem · Data última apresentação

---

### M1-E2-US-18 · Edição de dados do espaço cultural

**Como** Técnico/Analista (P2),
**Quero** editar os dados cadastrais de um espaço na tela de detalhe,
**Para que** as informações se mantenham atualizadas.

**Critérios de Aceitação:**
- [⏳] Botão "Editar espaço" visível APENAS para P2 em M1-E2-US-17
- [⏳] Ao clicar, campos de Informações Gerais e Acessibilidade tornam-se editáveis
- [⏳] Campos editáveis: descrição, capacidade, horários, contato, conservação, acessibilidade
- [⏳] Campos bloqueados com indicação visual: CNPJ, tipo gestão
- [⏳] Botões "Salvar alterações" e "Cancelar" no modo edição
- [⏳] Salvar: toast "Dados atualizados com sucesso" + retorno leitura
- [⏳] Cancelar: reverte sem salvar
- [⏳] No protótipo: salvar atualiza state local (sem API real)

---

## Resumo ABA 3 — Espaços Culturais

| Código | Título | Personas | Prioridade |
|---|---|---|---|
| M1-E2-US-15 | Painel métricas agregadas | P1, P2 | Alta |
| M1-E2-US-16 | Inventário espaços | P2 | Média |
| M1-E2-US-17 | Detalhe espaço | P1, P2 | Alta |
| M1-E2-US-18 | Edição espaço | P2 | Média |

---

## ABA 4 — Projetos e Orçamento

### M1-E2-US-19 · Painel de visão geral dos projetos

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver um painel de resumo executivo dos projetos,
**Para que** eu tenha leitura rápida da saúde do portfólio cultural.

**Critérios de Aceitação:**

*Cards de Resumo (topo):*
- [✅] Projetos ativos com variação vs. período anterior
- [✅] Projetos concluídos no período com variação
- [✅] Projetos com pendência (alerta se > 10%)
- [✅] Total de recursos em execução (R$) com variação
- [✅] KPI Eficiência de Repasse: dias médios até primeiro repasse (meta ≤ 30, semáforo visual)
- [✅] KPI Retorno Social: pessoas impactadas com variação

*Gráfico: Evolução mensal (12 meses):*
- [✅] Linhas sobrepostas: Projetos iniciados · Projetos concluídos · Recursos desembolsados (R$)
- [✅] Ativar/desativar cada linha individualmente
- [✅] Anotações automáticas em eventos (abertura editais, encerramentos)
- [✅] Hover exibe valores dos 3 indicadores no mês

---

### M1-E2-US-20 · Distribuição territorial e por linguagem

**Como** Técnico/Analista (P2),
**Quero** ver onde e em quais linguagens os projetos estão distribuídos,
**Para que** eu identifique concentrações e lacunas de cobertura.

**Critérios de Aceitação:**

*Mapa de Calor Territorial:*
- [🔄] Mapa PE colorido por volume projetos aprovados por município
- [🔄] Tooltip: município, nº projetos, valor total, público impactado
- [🔄] Toggle para alternar: nº projetos / valor recebido / público
- [🔄] Filtro por instrumento de fomento

*Gráfico: Projetos por Linguagem:*
- [🔄] Barras horizontais: nº projetos aprovados por linguagem
- [🔄] Barra secundária overlay: nº proponentes cadastrados (evidencia gap)
- [🔄] Tooltip: linguagem, aprovados, cadastrados, taxa aprovação (%)

---

### M1-E2-US-21 · Painel de impacto financeiro e econômico

**Como** Secretário(a) (P1),
**Quero** ver os indicadores econômicos gerados pelos projetos,
**Para que** eu demonstre o retorno econômico do investimento público.

**Critérios de Aceitação:**

*Cards de Destaque:*
- [✅] Volume total movimentado (R$) com variação
- [✅] Empregos e contratos gerados com variação
- [✅] KPI Alavancagem: R$ privado por R$ 1,00 público
- [✅] Volume vendas Marketplace pelos projetos (R$)

*Gráfico: Receita por Fonte:*
- [🔄] Barras empilhadas mensais: fomento público + patrocínio + Marketplace + crowdfunding
- [🔄] Tooltip com valores absolutos de cada fonte no mês

*Gráfico: Renda Média por Linguagem:*
- [✅] Barras horizontais com renda média gerada por projeto de cada linguagem
- [✅] Linha de referência: renda média antes de ingressar na plataforma

*Indicador: Sobrevivência Coletivos Pós-Projeto:*
- [🔄] Card: % coletivos ativos 1 ano e 2 anos após conclusão
- [🔄] Comparativo: com projetos vs. sem projetos

---

### M1-E2-US-22 · Painel de alcance social, participação e comentários

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver os indicadores de alcance social dos projetos,
**Para que** eu avalie se as políticas estão gerando acesso equitativo e impacto real.

**Critérios de Aceitação:**

*Bloco: Alcance do Público:*
- [✅] Gráfico barras: público impactado por linguagem
- [✅] Breakdown: eventos gratuitos vs. pagos (% e valores)
- [✅] Total eventos no período com breakdown por linguagem
- [✅] Mapa calor: intensidade eventos por município

*Bloco: Perfil Demográfico Público:*
- [✅] Donut faixa etária e donut gênero
- [✅] % do público de territórios baixa renda
- [🔄] Comparativo: perfil público vs. perfil artistas (barras lado a lado)
- [✅] Nota: "Dados coletados via opt-in no App da Sociedade"

*Bloco: Engajamento Cidadão:*
- [✅] Cards: apoios crowdfunding (pessoas + R$), voluntários, trocas serviços
- [✅] Gráfico linha: evolução mensal crowdfunding
- [✅] Top 5 projetos maior engajamento
- [✅] Breakdown crowdfunding por linguagem

*Bloco: Comentários da Comunidade:*
- [✅] Feed com comentários recentes sobre projetos em execução
- [✅] Origem: Artistas (App) ou Cidadãos (App)
- [✅] Cada comentário: avatar, nome (ou "Anônimo"), projeto, data, texto
- [✅] Avaliação média (1-5 estrelas) separada por origem
- [✅] Filtros: apenas Artistas / apenas Cidadãos / todos
- [✅] Mínimo 6 comentários (3 por origem)

---

### M1-E2-US-23 · Indicador de formalização via projetos

**Como** Técnico/Analista (P2),
**Quero** acompanhar se a participação em projetos contribui para formalização dos coletivos,
**Para que** eu mensure o impacto da política de fomento na redução da informalidade.

**Critérios de Aceitação:**
- [🔄] Gráfico área empilhada: evolução trimestral por nível (Informal, MEI, Associação, EPP)
- [🔄] Linha overlay: nº projetos realizados no trimestre
- [🔄] Card: taxa informalidade atual vs. média nacional (44,6% IBGE)
- [🔄] Card: % formalizados após 1+ projeto via plataforma
- [🔄] Tooltip: valores absolutos e percentuais de cada categoria no trimestre

---

### M1-E2-US-24 · Tabela de projetos com filtros avançados

**Como** Secretário(a) (P1) ou Técnico/Analista (P2),
**Quero** ver uma tabela completa de todos os projetos com filtros avançados,
**Para que** eu localize rapidamente projetos específicos.

**Critérios de Aceitação:**

*Tabela:*
- [✅] Colunas: Nome · Proponente · Linguagem · Instrumento · Município · Fase · Status badge · Público · Valor · Score conformidade
- [✅] Score conformidade como barra colorida: Verde ≥80%, Amarelo 50-79%, Vermelho <50%
- [✅] Ordenação por qualquer coluna
- [✅] Busca por nome ou proponente

*Filtros Avançados (painel colapsável):*
- [✅] Instrumento: Funcultura, SIC, PNAB, Mecenato, Rouanet, Aldir Blanc
- [✅] Status: Ativo, Concluído, Pendência, Irregular, Cancelado
- [✅] Linguagem (multi-select)
- [✅] Município (multi-select)
- [✅] Fase: Planejamento, Execução, Prestação, Encerrado
- [✅] Faixa valor (slider range)
- [✅] Período (data início e fim)

*Resultados:*
- [✅] Contador: "X projeto(s) encontrado(s)"
- [✅] Botão "Exportar CSV" (placeholder)
- [✅] Clique linha abre detalhe do projeto

---

### M1-E2-US-25 · Orçamento e Fomento

#### Seção: Execução Orçamentária por Instrumento

**Como** Secretário(a) (P1),
**Quero** ver a execução orçamentária de cada instrumento,
**Para que** eu identifique gargalos e tome decisões sobre remanejamento.

**Critérios de Aceitação:**
- [🔄] Tabela: Instrumento · Planejado (R$) · Empenhado (R$) · Pago (R$) · % executado
- [🔄] Barra progresso com semáforo: Verde ≥80%, Amarelo 50-79%, Vermelho <50%
- [🔄] Card destaque: "Total investido" com variação vs. período anterior
- [🔄] Gráfico barras empilhadas: composição investimento por instrumento
- [🔄] Filtro por período

#### Seção: Distribuição Territorial do Fomento

**Como** Secretário(a) (P1),
**Quero** ver como o investimento público está distribuído geograficamente,
**Para que** eu avalie equidade de recursos nas regiões.

**Critérios de Aceitação:**
- [🔄] Mapa PE com coloração por volume recursos por município (heatmap)
- [🔄] KPI Alavancagem: "Para cada R$ 1,00 público, R$ X privado"
- [🔄] Ranking 10 municípios (valor absoluto e per capita cultural)
- [🔄] Gráfico proporção por mesorregião (barras horizontais)
- [🔄] Filtro por instrumento

---

## Resumo ABA 4 — Projetos e Orçamento

| Código | Título | Personas | Prioridade |
|---|---|---|---|
| M1-E2-US-19 | Visão geral projetos | P1, P2 | Alta |
| M1-E2-US-20 | Distribuição territorial | P2 | Alta |
| M1-E2-US-21 | Impacto financeiro | P1 | Alta |
| M1-E2-US-22 | Alcance social | P1, P2 | Alta |
| M1-E2-US-23 | Formalização | P2 | Média |
| M1-E2-US-24 | Tabela com filtros | P1, P2 | Alta |
| M1-E2-US-25 | Orçamento e Fomento | P1 | Alta |

---

## 🔗 Componentes Globais

### [GLOBAL] Contexto de Filtros Globais

**Como** qualquer pessoa usando o dashboard,
**Quero** que os filtros que aplico em uma aba se propaguem automaticamente para todas as outras abas,
**Para que** eu possa explorar diferentes perspectivas dos mesmos dados filtrados.

**Critérios de Aceitação:**
- [✅] Filtro aplicado na ABA Mapa (US-03) aparece como tag no header
- [✅] Ao navegar para ABA Perfil, os dados já são exibidos filtrados
- [✅] Ao navegar para ABA Espaços, dados também filtrados pelo mesmo contexto
- [✅] Múltiplos filtros podem ser combinados
- [✅] Cada aba marca visualmente quando um filtro está ativo
- [🔄] Faixa de aviso discreta exibe lista de filtros ativos
- [✅] Filtro persiste ao navegar entre abas, mas reseta ao logout
- [✅] Context Hook `useMapFilter()` disponível para qualquer componente consumir

---

### [GLOBAL] Layout e Navegação

**Como** usuário do dashboard,
**Quero** interface clara com menu de abas, header com informações e layout responsivo,
**Para que** eu navigate facilmente entre as diferentes áreas de análise.

**Critérios de Aceitação:**
- [✅] Sidebar com menu colapsável (ícone hambúrguer expandido por padrão mobile)
- [✅] Menu com 5 abas: Mapa · Perfil Ecossistema · Espaços Culturais · Projetos e Orçamento · IA Preditiva
- [✅] Rota ativa destacada visualmente no menu
- [✅] Header com logo CENA + filtros globais (tags) + NotificationBell
- [✅] Breadcrumb navegação mostrando localização
- [✅] Footer com versão + créditos
- [✅] Responsivo: mobile com sidebar drawer, desktop com sidebar lateral
- [✅] White-label: logo e cores customizáveis via context

---

### [GLOBAL] Notificações e Feedback

**Como** usuário,
**Quero** feedback visual imediato quando realizo ações (salvar, aplicar filtro, erro),
**Para que** eu saiba se a ação foi bem-sucedida ou se há algum problema.

**Critérios de Aceitação:**
- [✅] Toast notifications para: sucesso (verde), erro (vermelho), info (azul)
- [✅] Toast aparece no canto inferior direito com auto-dismiss (4s)
- [✅] Possibilidade de fechar manualmente com X
- [✅] Skeleton screens em Cards durante carregamento
- [✅] Spinner em botões durante operação async
- [✅] Mensagens de estado vazio com ícone + descrição

---

### [GLOBAL] Temas e Cores

**Como** usuário,
**Quero** interface com paleta de cores semântica intuitiva,
**Para que** eu interprete rapidamente o significado dos elementos.

**Critérios de Aceitação:**
- [✅] Cores primárias: Produtores (azul `#3155A4`), Espaços (amarelo `#FFB511`)
- [✅] Cores semânticas: Sucesso (verde `#00AD4A`), Alerta (laranja), Crítico (vermelho `#C34342`)
- [✅] Conservação: Excelente (verde), Bom (azul claro), Regular (laranja), Precário (vermelho)
- [✅] Formalização: cores diferenciadas por tipo
- [✅] Acessibilidade: cores considerando daltonismo (não usar vermelho/verde como único indicador)

---

*CENA · M1-E2 · Dashboard de Dados · Histórias de Usuário · Abril 2026*
