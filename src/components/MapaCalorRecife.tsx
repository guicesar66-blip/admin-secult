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

// Simplified polygon definitions for Recife bairros
// viewBox coordinates on a 500x680 grid
interface BairroShape {
  id: string;
  label: string;
  path: string;
  labelPos: { x: number; y: number };
}

const bairroShapes: BairroShape[] = [
  // RPA 2 - Norte
  {
    id: "Beberibe",
    label: "Beberibe",
    path: "M 170,10 L 260,8 L 280,40 L 265,65 L 200,70 L 160,50 Z",
    labelPos: { x: 220, y: 42 },
  },
  {
    id: "Água Fria",
    label: "Água Fria",
    path: "M 260,8 L 330,15 L 340,55 L 280,40 Z",
    labelPos: { x: 300, y: 32 },
  },
  {
    id: "Arruda",
    label: "Arruda",
    path: "M 160,50 L 200,70 L 265,65 L 260,100 L 210,105 L 155,85 Z",
    labelPos: { x: 210, y: 82 },
  },
  {
    id: "Campo Grande",
    label: "Campo Grande",
    path: "M 265,65 L 280,40 L 340,55 L 355,85 L 310,100 L 260,100 Z",
    labelPos: { x: 305, y: 75 },
  },
  // RPA 3 - Zona Norte nobre
  {
    id: "Apipucos",
    label: "Apipucos",
    path: "M 60,80 L 120,60 L 160,50 L 155,85 L 130,110 L 70,115 Z",
    labelPos: { x: 110, y: 88 },
  },
  {
    id: "Casa Forte",
    label: "Casa Forte",
    path: "M 130,110 L 155,85 L 210,105 L 215,140 L 155,145 Z",
    labelPos: { x: 175, y: 120 },
  },
  {
    id: "Espinheiro",
    label: "Espinheiro",
    path: "M 210,105 L 260,100 L 275,130 L 260,155 L 215,140 Z",
    labelPos: { x: 242, y: 125 },
  },
  {
    id: "Encruzilhada",
    label: "Encruzilhada",
    path: "M 260,100 L 310,100 L 355,85 L 370,115 L 330,140 L 275,130 Z",
    labelPos: { x: 318, y: 115 },
  },
  {
    id: "Parnamirim",
    label: "Parnamirim",
    path: "M 70,115 L 130,110 L 155,145 L 130,175 L 65,165 Z",
    labelPos: { x: 112, y: 145 },
  },
  {
    id: "Graças",
    label: "Graças",
    path: "M 155,145 L 215,140 L 260,155 L 248,185 L 200,190 L 155,180 Z",
    labelPos: { x: 205, y: 165 },
  },
  {
    id: "Aflitos",
    label: "Aflitos",
    path: "M 130,175 L 155,145 L 155,180 L 200,190 L 190,210 L 130,205 Z",
    labelPos: { x: 162, y: 190 },
  },
  // RPA 1 - Centro
  {
    id: "Derby",
    label: "Derby",
    path: "M 200,190 L 248,185 L 265,210 L 240,230 L 195,225 Z",
    labelPos: { x: 228, y: 210 },
  },
  {
    id: "Boa Vista",
    label: "Boa Vista",
    path: "M 260,155 L 330,140 L 355,170 L 340,200 L 310,205 L 265,210 L 248,185 Z",
    labelPos: { x: 305, y: 178 },
  },
  {
    id: "Recife Antigo",
    label: "Recife Antigo",
    path: "M 370,150 L 410,140 L 425,165 L 415,190 L 385,195 L 370,175 Z",
    labelPos: { x: 395, y: 170 },
  },
  {
    id: "Santo Amaro",
    label: "Sto. Amaro",
    path: "M 310,205 L 340,200 L 370,210 L 385,240 L 350,250 L 310,240 Z",
    labelPos: { x: 345, y: 225 },
  },
  {
    id: "São José",
    label: "São José",
    path: "M 350,250 L 385,240 L 410,260 L 400,285 L 365,280 L 340,265 Z",
    labelPos: { x: 375, y: 262 },
  },
  // RPA 4 - Zona Oeste
  {
    id: "Madalena",
    label: "Madalena",
    path: "M 130,205 L 190,210 L 195,225 L 200,260 L 165,270 L 120,250 Z",
    labelPos: { x: 162, y: 238 },
  },
  {
    id: "Torre",
    label: "Torre",
    path: "M 195,225 L 240,230 L 255,260 L 245,285 L 200,260 Z",
    labelPos: { x: 225, y: 252 },
  },
  {
    id: "Cordeiro",
    label: "Cordeiro",
    path: "M 50,210 L 100,195 L 130,205 L 120,250 L 80,260 L 45,245 Z",
    labelPos: { x: 88, y: 230 },
  },
  {
    id: "Iputinga",
    label: "Iputinga",
    path: "M 15,185 L 65,165 L 100,195 L 50,210 L 20,210 Z",
    labelPos: { x: 55, y: 195 },
  },
  {
    id: "Várzea",
    label: "Várzea",
    path: "M 5,245 L 45,245 L 80,260 L 85,310 L 50,330 L 10,310 Z",
    labelPos: { x: 48, y: 285 },
  },
  // Center-East
  {
    id: "Pina",
    label: "Pina",
    path: "M 340,265 L 365,280 L 400,285 L 420,310 L 410,340 L 365,335 L 340,310 L 325,290 Z",
    labelPos: { x: 370, y: 305 },
  },
  {
    id: "Brasília Teimosa",
    label: "Bras. Teimosa",
    path: "M 410,260 L 445,250 L 470,270 L 460,300 L 430,310 L 420,310 L 400,285 Z",
    labelPos: { x: 440, y: 280 },
  },
  // RPA 5 - Zona Sul/Oeste
  {
    id: "Afogados",
    label: "Afogados",
    path: "M 120,250 L 165,270 L 200,260 L 210,295 L 175,320 L 115,310 L 85,290 Z",
    labelPos: { x: 152, y: 290 },
  },
  {
    id: "Areias",
    label: "Areias",
    path: "M 85,290 L 115,310 L 130,350 L 100,370 L 60,350 L 50,330 L 85,310 Z",
    labelPos: { x: 90, y: 340 },
  },
  {
    id: "Tejipió",
    label: "Tejipió",
    path: "M 10,310 L 50,330 L 60,350 L 50,390 L 15,380 L 5,345 Z",
    labelPos: { x: 35, y: 355 },
  },
  // RPA 6 - Zona Sul
  {
    id: "Boa Viagem",
    label: "Boa Viagem",
    path: "M 310,340 L 365,335 L 410,340 L 425,380 L 430,430 L 420,490 L 390,510 L 340,500 L 310,460 L 295,400 Z",
    labelPos: { x: 365, y: 420 },
  },
  {
    id: "Imbiribeira",
    label: "Imbiribeira",
    path: "M 210,295 L 245,285 L 325,290 L 340,310 L 310,340 L 295,400 L 250,390 L 210,360 L 175,320 Z",
    labelPos: { x: 268, y: 340 },
  },
  {
    id: "IPSEP",
    label: "IPSEP",
    path: "M 210,360 L 250,390 L 260,440 L 220,460 L 180,430 L 170,390 Z",
    labelPos: { x: 215, y: 415 },
  },
  {
    id: "Ibura",
    label: "Ibura",
    path: "M 100,370 L 130,350 L 175,320 L 210,360 L 170,390 L 180,430 L 150,460 L 110,450 L 80,420 L 70,390 Z",
    labelPos: { x: 140, y: 400 },
  },
  {
    id: "Jordão",
    label: "Jordão",
    path: "M 150,460 L 180,430 L 220,460 L 240,500 L 210,530 L 170,520 L 140,495 Z",
    labelPos: { x: 190, y: 490 },
  },
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
      {/* SVG Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa de Calor — Recife
          </CardTitle>
          <CardDescription>Concentração de projetos por bairro. Cores representam o tipo predominante de projeto.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map */}
            <div className="relative flex-1 max-w-xl mx-auto w-full">
              <svg viewBox="-10 -10 500 560" className="w-full h-auto" style={{ maxHeight: "520px" }}>
                {/* Ocean background on the right */}
                <rect x="430" y="-10" width="80" height="580" fill="hsl(210 60% 90%)" opacity="0.4" rx="4" />
                <text x="460" y="280" fill="hsl(210 50% 65%)" fontSize="12" fontWeight="500" textAnchor="middle" transform="rotate(90, 460, 280)">
                  Oceano Atlântico
                </text>

                {/* Bairro polygons */}
                {bairroShapes.map((bairro) => {
                  const data = bairroDataMap[bairro.id];
                  const total = data?.projetos || 0;
                  const color = data ? getColorForBairro(data.porTipo, total, maxProjetos) : "hsl(var(--muted-foreground))";
                  const opacity = data ? getOpacityForBairro(total, maxProjetos) : 0.08;
                  const isHovered = hoveredBairro === bairro.id;
                  const hasData = total > 0;

                  return (
                    <g
                      key={bairro.id}
                      onMouseEnter={() => setHoveredBairro(bairro.id)}
                      onMouseLeave={() => setHoveredBairro(null)}
                      className="cursor-pointer transition-all"
                    >
                      <path
                        d={bairro.path}
                        fill={color}
                        fillOpacity={opacity}
                        stroke={isHovered ? "hsl(var(--foreground))" : hasData ? color : "hsl(var(--border))"}
                        strokeWidth={isHovered ? 2.5 : 1}
                        strokeOpacity={isHovered ? 1 : hasData ? 0.6 : 0.3}
                        style={{ transition: "all 0.15s ease" }}
                      />
                      {/* Bairro label */}
                      <text
                        x={bairro.labelPos.x}
                        y={bairro.labelPos.y - (hasData ? 6 : 0)}
                        textAnchor="middle"
                        fontSize={hasData ? 9 : 7.5}
                        fontWeight={hasData ? "600" : "400"}
                        fill={hasData ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                        opacity={hasData ? 1 : 0.5}
                      >
                        {bairro.label}
                      </text>
                      {/* Project count */}
                      {hasData && (
                        <>
                          <circle
                            cx={bairro.labelPos.x}
                            cy={bairro.labelPos.y + 10}
                            r={Math.max(10, Math.min(16, 10 + (total / maxProjetos) * 6))}
                            fill={color}
                            opacity={0.9}
                            stroke="white"
                            strokeWidth={1.5}
                          />
                          <text
                            x={bairro.labelPos.x}
                            y={bairro.labelPos.y + 14}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight="700"
                            fill="white"
                          >
                            {total}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
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
