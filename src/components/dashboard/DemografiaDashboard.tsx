import React, { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, TrendingUp } from 'lucide-react';
import { CardComparação, CardMetrica, BlocoSocioeconômico, GraficoComFiltro } from '../shared';
import { aggregarDemografia, calcularVariacao, formatarParaDonut, formatarParaBarrasHorizontal } from '../../utils/demografiaUtils';
import { useMapFilter } from '../../contexts/MapFilterContext';
import { artistasMock } from '../../data/mockArtistas';

interface DemografiaDashboardProps {
  dados?: any[];
  periodo?: 'mes' | 'trimestre' | 'ano';
  respostaFiltroGlobal?: boolean;
}

export const DemografiaDashboard: React.FC<DemografiaDashboardProps> = ({
  dados = artistasMock,
  periodo = 'ano',
  respostaFiltroGlobal = true,
}) => {
  const { filters } = useMapFilter();
  const [expandidos, setExpandidos] = useState({
    genero: true,
    raca: true,
    faixaEtaria: true,
    formalização: true,
    linguagem: true,
  });

  // Filtrar dados se houver contexto
  const dadosFiltrados = useMemo(() => {
    if (!respostaFiltroGlobal || !filters || filters.length === 0) {
      return dados;
    }
    // TODO: Implementar lógica de filtro baseado em MapFilterContext
    return dados;
  }, [dados, filters, respostaFiltroGlobal]);

  // Agregar dados demográficos
  const demografiaAtual = useMemo(() => aggregarDemografia(dadosFiltrados), [dadosFiltrados]);

  // Simular período anterior para cálculo de variação
  const demografiaAnterior = useMemo(() => aggregarDemografia(dados.slice(0, Math.floor(dados.length * 0.8))), [dados]);

  const variacaoTotal = calcularVariacao(demografiaAtual.totalAgentes, demografiaAnterior.totalAgentes);

  // Dados para gráficos
  const generoDados = formatarParaDonut(demografiaAtual.genero, ['#3567C4', '#C41200', '#00A84F', '#8A9BB5']);
  const racaDados = formatarParaDonut(demografiaAtual.raca, ['#FFBD0C', '#3567C4', '#C41200', '#00A84F', '#C85A1A', '#8A9BB5']);
  const faixaEtariaDados = [
    { name: '18-24', value: demografiaAtual.faixaEtaria['18-24'] },
    { name: '25-34', value: demografiaAtual.faixaEtaria['25-34'] },
    { name: '35-49', value: demografiaAtual.faixaEtaria['35-49'] },
    { name: '50-64', value: demografiaAtual.faixaEtaria['50-64'] },
    { name: '65+', value: demografiaAtual.faixaEtaria['65+'] },
  ];
  const formalizacaoDados = formatarParaBarrasHorizontal(demografiaAtual.formalização);

  const toggleExpandir = (bloco: string) => {
    setExpandidos((prev) => ({
      ...prev,
      [bloco]: !prev[bloco],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Card de Contexto */}
      {filters && filters.length > 0 && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm text-pe-dark">
          Dados filtrados por: {filters.map(f => f.name).join(', ')}
        </div>
      )}

      {/* KPI Principal */}
      <CardComparação
        titulo="Total de Agentes Culturais"
        valor={demografiaAtual.totalAgentes}
        variacao={{
          percentual: variacaoTotal.percentual,
          tendencia: variacaoTotal.tendencia,
          anterior: demografiaAnterior.totalAgentes,
        }}
        referencia={{
          label: 'Estado de PE',
          valor: '1.247 agentes',
        }}
        icon={<Users className="w-5 h-5" />}
      />

      {/* Seção: Gênero */}
      <BlocoSocioeconômico
        titulo="Distribuição por Gênero"
        descricao="Identificação de gênero autodeclarada pelos agentes"
        expandido={expandidos.genero}
        onToggleExpandir={() => toggleExpandir('genero')}
        grafico={
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={generoDados}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {generoDados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} agentes`} />
            </PieChart>
          </ResponsiveContainer>
        }
        cardResumo={
          <div className="flex gap-2">
            <CardMetrica titulo="Feminino" valor={demografiaAtual.genero.feminino} />
            <CardMetrica titulo="Masculino" valor={demografiaAtual.genero.masculino} />
            <CardMetrica titulo="Não-bináro" valor={demografiaAtual.genero.nao_binario} />
          </div>
        }
      />

      {/* Seção: Raça/Cor */}
      <BlocoSocioeconômico
        titulo="Distribuição por Raça/Cor"
        descricao="Autodeclaração conforme IBGE"
        expandido={expandidos.raca}
        onToggleExpandir={() => toggleExpandir('raca')}
        grafico={
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={racaDados}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {racaDados.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} agentes`} />
            </PieChart>
          </ResponsiveContainer>
        }
      />

      {/* Seção: Faixa Etária */}
      <BlocoSocioeconômico
        titulo="Distribuição por Faixa Etária"
        expandido={expandidos.faixaEtaria}
        onToggleExpandir={() => toggleExpandir('faixaEtaria')}
        grafico={
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={faixaEtariaDados}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={50} />
              <Tooltip />
              <Bar dataKey="value" fill="#3567C4" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        }
      />

      {/* Seção: Formalização */}
      <BlocoSocioeconômico
        titulo="Distribuição por Formalização"
        expandido={expandidos.formalização}
        onToggleExpandir={() => toggleExpandir('formalização')}
        grafico={
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={formalizacaoDados}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#00A84F" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        }
        cardResumo={
          <div className="text-sm text-muted-foreground">
            <p>
              Taxa de informalidade: <strong className="text-foreground">{
                Math.round((demografiaAtual.formalização.informal / demografiaAtual.totalAgentes) * 100)
              }%</strong>
            </p>
          </div>
        }
      />

      {/* Informação contextual */}
      <div className="bg-neutral-50 border border-border rounded-lg p-4 text-xs text-muted-foreground">
        <p>
          Dados coletados com consentimento conforme LGPD. Uso restrito à gestão cultural. Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};
