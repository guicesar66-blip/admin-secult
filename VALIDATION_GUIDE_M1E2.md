# 📋 Sprint M1-E2 — Guia de Validação dos Componentes

**Data:** 2 de Abril de 2026  
**Status:** Componentes implementados ✅ | Aguardando validação visual

---

## 🎯 Objetivo

Validar que os componentes DemografiaCharts e PainelSocioeconomico:
1. **Renderizam corretamente** no navegador
2. **Conectados ao filtro global** (filterProdutoras)
3. **Dados atualizam dynamicamente** quando filtro muda
4. **Nenhum erro de compilação ou runtime**

---

## 📊 Componentes a Validar

### Componente 1: DemografiaCharts (5 Seções)
Local: `src/components/censo/DemografiaCharts.tsx`

**Esperado renderizar:**
```
┌─ Card: GÊNERO (Donut chart)
├─ Card: RAÇA/COR (Donut chart)
├─ Card: FAIXA ETÁRIA (Barras horizontal)
├─ Card: FORMALIZAÇÃO (Radar chart)
└─ Card: LINGUAGEM (Donut chart)
```

**Validação:**
- [ ] 5 cards aparecem na tela
- [ ] Legenda lateral em cada donut
- [ ] Barra de progresso com cores semânticas
- [ ] Valores percentuais corretos

### Componente 2: PainelSocioeconomico (5 Blocos)
Local: `src/components/censo/PainelSocioeconomico.tsx`

**Esperado renderizar:**
```
┌─ BLOCO 1: RENDA (Barras 5 faixas)
│  └── Linha referência SM
│
├─ BLOCO 2: ESCOLARIDADE (2 cards - Donut + Comparativo)
│  └── % superior vs média PE
│
├─ BLOCO 3: MORADIA (Barras 5 serviços)
│  └── % acesso
│
├─ BLOCO 4: VULNERABILIDADES (Barras agrupadas)
│  └── % coletivos c/ ≥1 vulnerabilidade
│
└─ BLOCO 5: IVC COMPOSTO (Donut + Mini-mapa)
   └── Distribuição Alta/Média/Baixa
```

**Validação:**
- [ ] 5 blocos aparecem
- [ ] Gráficos Recharts renderizam sem erro
- [ ] Cards com valores numéricos
- [ ] Tooltips funcionam ao passar mouse

---

## 🔌 Teste de Integração: Fluxo de Filtros

### Step 1: Iniciar App
```
cd c:\Users\guice\Documents\GitHub\admin-secult
yarn dev
→ Abrir browser: http://localhost:5173
```

### Step 2: Ir para Aba "Perfil Ecossistema"
```
Menu esquerdo ou Tabs no topo
Click em "Perfil Ecossistema" → Carrega componentes
```

### Step 3: Verificar Renderização Inicial
```
✓ DemografiaCharts: 5 cards visíveis?
✓ PainelSocioeconomico (seção colapsável): Dados visíveis?
✓ Console browser (F12): Algum erro JavaScript?
```

### Step 4: Testar Filtro Global
```
1. Voltar para ABA "Mapa"
2. Clicar em um marcador (produtor)
3. Modal abre com opção "Aplicar filtro"
4. Clicar "Aplicar filtro"
5. Tag de filtro deve aparecer no header
```

### Step 5: Validar Atualização de Dados
```
1. Voltar para ABA "Perfil Ecossistema"
2. Verificar se dados mudaram:
   ✓ Total artistas menor (filtrado)
   ✓ Gráficos percentuais recalculados
   ✓ Nenhum reload necessário
3. Múltiplos filtros:
   ✓ Clicar outro produtor
   ✓ Dados devem agregar (OR logic)
```

### Step 6: Testar Reset de Filtro
```
1. Clicar X nas tags de filtro
2. Dados devem voltar ao estado inicial
3. Gráficos devem recalcular
```

---

## ✅ Checklist de Validação

### Build & Compilation
- [ ] `npm run build` executa sem erros críticos
- [ ] Sem console errors ao abrir app
- [ ] Componentes DemografiaCharts e PainelSocioeconomico aparecem

### Visual & UX
- [ ] 5 sections DemografiaCharts aparecem
- [ ] 5 blocos PainelSocioeconomico aparecem
- [ ] Valores numéricos visíveis
- [ ] Gráficos renderizam (Recharts)
- [ ] Legendas aparecem corretamente
- [ ] Cores semânticas (verde, amarelo, vermelho)

### Funcionalidade de Filtros
- [ ] PerfilEcossistema recebe filterProdutoras
- [ ] useEcossistemaData filtra artistas corretamente (OR logic)
- [ ] DemografiaCharts dados mudam ao filtrar
- [ ] PainelSocioeconomico dados mudam ao filtrar
- [ ] Múltiplos filtros agregam (não AND, é OR)

### Data Completeness
- [ ] Renda: 5 faixas com dados
- [ ] Escolaridade: 4 níveis com dados
- [ ] Moradia: 5 serviços com dados
- [ ] Vulnerabilidades: dados preenchidos
- [ ] IVC: Alta/Média/Baixa com %

### No Regressions
- [ ] Aba Mapa funciona
- [ ] Aba Espaços funciona
- [ ] Aba Projetos funciona
- [ ] Sem quebra em outros componentes

---

## 🐛 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|--------|
| PowerShell error ao yarn dev | Execution policy bloqueado | Execute: `Set-ExecutionPolicy RemoteSigned` |
| Componentes não aparecem | Props não passando | Verificar DadosDashboard passa filterProdutoras a PerfilEcossistema |
| Gráficos vazios | Dados não vinddo | Verificar useEcossistemaData retorna dados |
| Filtro não funciona | MapFilterContext não passando | Verificar tags de filtro aparecem no header |
| Console errors | TypeScript/imports quebrados | Verificar get_errors novamente |

---

## 📍 Logs Esperados (Console Browser)

Ao abrir Perfil tab com filtro ativo, esperar ver:
```
[useEcossistemaData] Filtro artistas: 47 → 8 (filterProdutoras aplicado)
[DemografiaCharts] Renderizando com 8 artistas
[PainelSocioeconomico] IVC calculado: Alta=2, Média=5, Baixa=1
```

---

## 🎉 Resultado de Sucesso

Se tudo acima passar: **Sprint 95%+ completo** ✅

- US-08: DemografiaCharts com 5 sections ✅
- US-11: PainelSocioeconomico com 5 blocos ✅
- Filtros propagados com OR logic ✅
- Nenhum erro de compilação ✅

**Pronto para UAT amanhã!**

---

**Tempo estimado validação:** 20-30 minutos  
**Status atual:** Aguardando teste no navegador
