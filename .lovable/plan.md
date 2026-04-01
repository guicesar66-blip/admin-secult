

## Plano de Limpeza do Codebase

Varredura completa realizada. Abaixo, todos os arquivos identificados como **inacessíveis pelo fluxo de usuários** ou **sem nenhuma referência de importação**.

---

### Arquivos a DELETAR

#### Pages (3 arquivos)
| Arquivo | Motivo |
|---|---|
| `src/pages/Index.tsx` | Página default "Welcome to Your Blank App". Não tem rota no App.tsx, nunca importada. |
| `src/pages/PlaceholderPage.tsx` | Página genérica "Em construção". Não tem rota no App.tsx, nunca importada por outro arquivo. |
| `src/pages/Dashboard.tsx` | Importada no App.tsx mas **nunca usada em nenhuma rota** — a rota `/dashboard` renderiza `MarketplaceExplorar`. 471 linhas mortas. |

#### Components (7 arquivos)
| Arquivo | Motivo |
|---|---|
| `src/components/ApprovalDialog.tsx` | Nunca importada por nenhum outro arquivo (a busca retornou 0 matches para import). |
| `src/components/StatCard.tsx` | Zero imports em todo o projeto. |
| `src/components/MapaCalorRecife.tsx` | Zero imports em todo o projeto. |
| `src/components/infraestrutura/MapaEquipamentos.tsx` | Nunca importada — apenas referencia a si mesma. Não é usada por `InfraestruturaTab` nem por nenhum outro componente. |
| `src/components/infraestrutura/RaioAcesso.tsx` | Zero imports em todo o projeto. |
| `src/components/projeto/FaseConstrucao.tsx` | Zero imports. |
| `src/components/projeto/FaseDivulgacao.tsx` | Zero imports. |
| `src/components/projeto/FaseExecucao.tsx` | Zero imports. |
| `src/components/projeto/FaseResultados.tsx` | Zero imports. |

#### Hooks (1 arquivo)
| Arquivo | Motivo |
|---|---|
| `src/hooks/useDadosDashboard.ts` | Zero imports em todo o projeto. |

#### Outros (2 arquivos)
| Arquivo | Motivo |
|---|---|
| `src/App.css` | Nunca importado por nenhum arquivo (nem `main.tsx`, nem `App.tsx`). |
| `src/types/leaflet-heat.d.ts` | Declaração de tipos para `leaflet.heat` — nenhum arquivo importa `leaflet.heat` no projeto. |

---

### Ajuste no App.tsx

Remover a importação morta:
```typescript
// REMOVER esta linha (linha 12):
import Dashboard from "./pages/Dashboard";
```
`Dashboard` é importado mas nunca referenciado em nenhuma `<Route>`.

---

### Resumo

| Categoria | Arquivos | Linhas estimadas removidas |
|---|---|---|
| Pages | 3 | ~500+ |
| Components | 7 | ~2500+ |
| Hooks | 1 | ~100+ |
| Outros | 2 | ~50+ |
| **Total** | **13 arquivos** | **~3000+ linhas** |

Nenhum dos arquivos listados é acessível por qualquer rota, menu, link, ou importação transitiva no projeto. A remoção é segura.

