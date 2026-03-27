import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react";
import mapaRecifeImg from "@/assets/mapa-recife.webp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BairroData {
  nome: string;
  projetos: number;
  vagas: number;
  porTipo: Record<string, number>;
}

interface MapaCalorRecifeProps {
  dados: BairroData[];
}

const tipoColors: Record<string, string> = {
  evento: "#3b82f6",
  vaga: "#10b981",
  oficina: "#f59e0b",
  projeto_bairro: "#8b5cf6",
};

const tipoLabels: Record<string, string> = {
  evento: "Evento",
  vaga: "Vaga",
  oficina: "Oficina",
  projeto_bairro: "Projeto de Bairro",
};

const tipoIcons: Record<string, React.ReactNode> = {
  evento: <Calendar className="h-3 w-3" />,
  vaga: <Briefcase className="h-3 w-3" />,
  oficina: <GraduationCap className="h-3 w-3" />,
  projeto_bairro: <MapPin className="h-3 w-3" />,
};

// Heat map color: red intensity scale
function getColorForBairro(_porTipo: Record<string, number>, total: number, maxTotal: number): string {
  if (total === 0) return "hsl(var(--muted-foreground))";
  const ratio = total / maxTotal;
  if (ratio > 0.7) return "#991b1b";
  if (ratio > 0.4) return "#dc2626";
  return "#f87171";
}

function getOpacityForBairro(total: number, maxTotal: number): number {
  if (total === 0) return 0.08;
  return Math.max(0.35, Math.min(0.95, 0.35 + (total / maxTotal) * 0.6));
}

// Bairro marker positions as percentages over the map image
const bairroMarkers: { id: string; label: string; x: number; y: number }[] = [
  { id: "Recife Antigo", label: "Recife Antigo", x: 62, y: 22 },
  { id: "Santo Amaro", label: "Sto. Amaro", x: 55, y: 28 },
  { id: "Boa Vista", label: "Boa Vista", x: 50, y: 32 },
  { id: "São José", label: "São José", x: 60, y: 30 },
  { id: "Derby", label: "Derby", x: 42, y: 36 },
  { id: "Espinheiro", label: "Espinheiro", x: 48, y: 30 },
  { id: "Aflitos", label: "Aflitos", x: 42, y: 40 },
  { id: "Graças", label: "Graças", x: 45, y: 35 },
  { id: "Casa Forte", label: "Casa Forte", x: 38, y: 30 },
  { id: "Parnamirim", label: "Parnamirim", x: 32, y: 34 },
  { id: "Apipucos", label: "Apipucos", x: 25, y: 28 },
  { id: "Arruda", label: "Arruda", x: 45, y: 18 },
  { id: "Campo Grande", label: "Campo Grande", x: 55, y: 16 },
  { id: "Encruzilhada", label: "Encruzilhada", x: 53, y: 22 },
  { id: "Beberibe", label: "Beberibe", x: 42, y: 10 },
  { id: "Água Fria", label: "Água Fria", x: 50, y: 8 },
  { id: "Madalena", label: "Madalena", x: 35, y: 44 },
  { id: "Torre", label: "Torre", x: 40, y: 48 },
  { id: "Cordeiro", label: "Cordeiro", x: 28, y: 48 },
  { id: "Iputinga", label: "Iputinga", x: 22, y: 42 },
  { id: "Várzea", label: "Várzea", x: 15, y: 52 },
  { id: "Pina", label: "Pina", x: 65, y: 42 },
  { id: "Brasília Teimosa", label: "Bras. Teimosa", x: 72, y: 35 },
  { id: "Afogados", label: "Afogados", x: 32, y: 55 },
  { id: "Areias", label: "Areias", x: 25, y: 62 },
  { id: "Tejipió", label: "Tejipió", x: 18, y: 60 },
  { id: "Boa Viagem", label: "Boa Viagem", x: 65, y: 62 },
  { id: "Imbiribeira", label: "Imbiribeira", x: 52, y: 58 },
  { id: "IPSEP", label: "IPSEP", x: 42, y: 68 },
  { id: "Ibura", label: "Ibura", x: 35, y: 75 },
  { id: "Jordão", label: "Jordão", x: 42, y: 82 },
];

export function MapaCalorRecife({ dados }: MapaCalorRecifeProps) {
  const [hoveredBairro, setHoveredBairro] = useState<string | null>(null);

  const maxProjetos = Math.max(...dados.map(d => d.projetos), 1);

  const bairroDataMap = useMemo(() => {
    const map: Record<string, BairroData> = {};
    dados.forEach(d => { map[d.nome] = d; });
    return map;
  }, [dados]);

  const chartData = useMemo(() => {
    return dados
      .sort((a, b) => b.projetos - a.projetos)
      .slice(0, 10)
      .map(d => ({
        bairro: d.nome,
        evento: d.porTipo.evento || 0,
        vaga: d.porTipo.vaga || 0,
        oficina: d.porTipo.oficina || 0,
        projeto_bairro: d.porTipo.projeto_bairro || 0,
        total: d.projetos,
      }));
  }, [dados]);

  const hoveredData = hoveredBairro ? bairroDataMap[hoveredBairro] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa de Calor — Recife
          </CardTitle>
          <CardDescription>Concentração de projetos por bairro. Números indicam a quantidade de projetos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map with image background */}
            <div className="relative flex-1 max-w-xl mx-auto w-full">
              <div className="relative">
                <img
                  src={mapaRecifeImg}
                  alt="Mapa de Recife"
                  className="w-full h-auto rounded-lg"
                />
                {/* Data markers overlay */}
                {bairroMarkers.map((marker) => {
                  const data = bairroDataMap[marker.id];
                  const total = data?.projetos || 0;
                  if (total === 0) return null;

                  const color = data ? getColorForBairro(data.porTipo, total, maxProjetos) : "#6b7280";
                  const size = Math.max(28, Math.min(44, 28 + (total / maxProjetos) * 16));
                  const isHovered = hoveredBairro === marker.id;

                  return (
                    <div
                      key={marker.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-10"
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                      }}
                      onMouseEnter={() => setHoveredBairro(marker.id)}
                      onMouseLeave={() => setHoveredBairro(null)}
                    >
                      {/* Label */}
                      <span
                        className="text-[9px] font-bold leading-none mb-0.5 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                        style={{ color: "white" }}
                      >
                        {marker.label}
                      </span>
                      {/* Circle with number */}
                      <div
                        className="rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white/80 transition-transform"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          backgroundColor: color,
                          fontSize: `${Math.max(11, size * 0.35)}px`,
                          transform: isHovered ? "scale(1.3)" : "scale(1)",
                          zIndex: isHovered ? 20 : 10,
                        }}
                      >
                        {total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info panel */}
            <div className="lg:w-56 flex-shrink-0 space-y-4">
              {/* Tooltip on hover */}
              <div className="rounded-lg border border-border bg-card p-4 min-h-[120px]">
                {hoveredData ? (
                  <>
                    <h4 className="font-semibold text-foreground text-sm">{hoveredBairro}</h4>
                    <p className="text-2xl font-bold text-foreground mt-1">{hoveredData.projetos} <span className="text-sm font-normal text-muted-foreground">projetos</span></p>
                    <p className="text-xs text-muted-foreground">{hoveredData.vagas} vagas</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(hoveredData.porTipo).map(([tipo, count]: [string, number]) => (
                        <Badge key={tipo} variant="outline" className="text-xs" style={{ borderColor: tipoColors[tipo], color: tipoColors[tipo] }}>
                          {tipoLabels[tipo]} ({count})
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MapPin className="h-6 w-6 mb-2 opacity-40" />
                    <p className="text-xs text-center">Passe o mouse sobre um bairro para ver detalhes</p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legenda por Tipo</p>
                <div className="space-y-2">
                  {Object.entries(tipoColors).map(([tipo, color]) => (
                    <div key={tipo} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                      <span className="text-xs text-foreground flex items-center gap-1">
                        {tipoIcons[tipo]}
                        {tipoLabels[tipo]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Intensidade</p>
                  <div className="flex items-center gap-1">
                    {[0.15, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                      <div key={i} className="flex-1 h-3 rounded-sm" style={{ backgroundColor: "#ef4444", opacity: op }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">Menos</span>
                    <span className="text-[10px] text-muted-foreground">Mais</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resumo</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Bairros ativos</span>
                    <span className="text-xs font-semibold text-foreground">{dados.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total projetos</span>
                    <span className="text-xs font-semibold text-foreground">{dados.reduce((a, b) => a + b.projetos, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total vagas</span>
                    <span className="text-xs font-semibold text-foreground">{dados.reduce((a, b) => a + b.vagas, 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stacked bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos por Bairro</CardTitle>
          <CardDescription>Top bairros com maior número de projetos, por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis
                    dataKey="bairro"
                    type="category"
                    tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--popover-foreground))",
                    }}
                  />
                  <Legend
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">{tipoLabels[value] || value}</span>
                    )}
                  />
                  <Bar dataKey="evento" stackId="a" fill={tipoColors.evento} name="evento" />
                  <Bar dataKey="vaga" stackId="a" fill={tipoColors.vaga} name="vaga" />
                  <Bar dataKey="oficina" stackId="a" fill={tipoColors.oficina} name="oficina" />
                  <Bar dataKey="projeto_bairro" stackId="a" fill={tipoColors.projeto_bairro} name="projeto_bairro" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mb-4 opacity-50" />
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
