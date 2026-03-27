import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
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

// Coordenadas aproximadas dos bairros de Recife em uma grade SVG (0-100)
const bairroPositions: Record<string, { x: number; y: number; rpa: string }> = {
  "Recife Antigo": { x: 42, y: 28, rpa: "RPA 1" },
  "Santo Amaro": { x: 38, y: 35, rpa: "RPA 1" },
  "Boa Vista": { x: 44, y: 38, rpa: "RPA 1" },
  "São José": { x: 46, y: 32, rpa: "RPA 1" },
  "Cabanga": { x: 35, y: 42, rpa: "RPA 1" },
  "Arruda": { x: 50, y: 20, rpa: "RPA 2" },
  "Campo Grande": { x: 55, y: 25, rpa: "RPA 2" },
  "Encruzilhada": { x: 52, y: 30, rpa: "RPA 2" },
  "Água Fria": { x: 58, y: 18, rpa: "RPA 2" },
  "Beberibe": { x: 62, y: 15, rpa: "RPA 2" },
  "Casa Forte": { x: 40, y: 48, rpa: "RPA 3" },
  "Espinheiro": { x: 48, y: 42, rpa: "RPA 3" },
  "Aflitos": { x: 44, y: 50, rpa: "RPA 3" },
  "Derby": { x: 42, y: 44, rpa: "RPA 3" },
  "Graças": { x: 46, y: 46, rpa: "RPA 3" },
  "Parnamirim": { x: 38, y: 52, rpa: "RPA 3" },
  "Apipucos": { x: 32, y: 56, rpa: "RPA 3" },
  "Jaqueira": { x: 42, y: 52, rpa: "RPA 3" },
  "Madalena": { x: 36, y: 58, rpa: "RPA 4" },
  "Torre": { x: 38, y: 62, rpa: "RPA 4" },
  "Cordeiro": { x: 32, y: 64, rpa: "RPA 4" },
  "Iputinga": { x: 28, y: 60, rpa: "RPA 4" },
  "Várzea": { x: 22, y: 68, rpa: "RPA 4" },
  "Afogados": { x: 30, y: 70, rpa: "RPA 5" },
  "Areias": { x: 26, y: 74, rpa: "RPA 5" },
  "Barro": { x: 22, y: 78, rpa: "RPA 5" },
  "Tejipió": { x: 18, y: 76, rpa: "RPA 5" },
  "Boa Viagem": { x: 52, y: 68, rpa: "RPA 6" },
  "Pina": { x: 50, y: 55, rpa: "RPA 6" },
  "Imbiribeira": { x: 48, y: 75, rpa: "RPA 6" },
  "Ibura": { x: 42, y: 82, rpa: "RPA 6" },
  "Brasília Teimosa": { x: 55, y: 48, rpa: "RPA 6" },
  "IPSEP": { x: 46, y: 78, rpa: "RPA 6" },
  "Jordão": { x: 40, y: 86, rpa: "RPA 6" },
};

const tipoColors: Record<string, string> = {
  evento: "#3b82f6",     // blue
  vaga: "#10b981",       // emerald
  oficina: "#f59e0b",    // amber
  projeto_bairro: "#8b5cf6", // purple
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

// Simplified Recife outline (SVG path)
const RECIFE_OUTLINE = "M 15,10 C 20,5 35,3 50,8 C 60,10 65,12 70,10 C 72,15 68,22 65,28 C 62,35 58,40 60,48 C 58,55 55,60 56,68 C 54,75 50,82 48,88 C 45,92 40,95 35,90 C 30,85 25,80 20,78 C 15,75 12,70 14,65 C 16,58 18,52 15,48 C 12,42 10,35 12,28 C 14,20 15,15 15,10 Z";

export function MapaCalorRecife({ dados }: MapaCalorRecifeProps) {
  const maxProjetos = Math.max(...dados.map(d => d.projetos), 1);

  // Build chart data for stacked bar
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

  // Get dominant type for color
  const getDominantType = (porTipo: Record<string, number>): string => {
    let maxType = "evento";
    let maxCount = 0;
    Object.entries(porTipo).forEach(([tipo, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = tipo;
      }
    });
    return maxType;
  };

  // Build pie segments for a bairro circle
  const renderBairroCircle = (bairro: BairroData, pos: { x: number; y: number }) => {
    const radius = Math.max(8, Math.min(22, (bairro.projetos / maxProjetos) * 22));
    const tipos = Object.entries(bairro.porTipo);
    const total = bairro.projetos;

    if (tipos.length === 1) {
      return (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={radius}
          fill={tipoColors[tipos[0][0]] || "#6b7280"}
          opacity={0.85}
          stroke="white"
          strokeWidth={1.5}
        />
      );
    }

    // Multi-type: render pie segments
    let startAngle = -90;
    const segments = tipos.map(([tipo, count]) => {
      const angle = (count / total) * 360;
      const endAngle = startAngle + angle;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const largeArc = angle > 180 ? 1 : 0;

      const x1 = pos.x + radius * Math.cos(startRad);
      const y1 = pos.y + radius * Math.sin(startRad);
      const x2 = pos.x + radius * Math.cos(endRad);
      const y2 = pos.y + radius * Math.sin(endRad);

      const path = `M ${pos.x} ${pos.y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      startAngle = endAngle;

      return (
        <path
          key={tipo}
          d={path}
          fill={tipoColors[tipo] || "#6b7280"}
          opacity={0.85}
          stroke="white"
          strokeWidth={0.5}
        />
      );
    });

    return <>{segments}</>;
  };

  return (
    <div className="space-y-6">
      {/* SVG Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Mapa de Calor — Recife
          </CardTitle>
          <CardDescription>Concentração de projetos por bairro com cores por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[4/5] max-w-lg mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background outline of Recife */}
              <path
                d={RECIFE_OUTLINE}
                fill="hsl(var(--muted) / 0.3)"
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
              />

              {/* Grid dots for empty bairros */}
              {Object.entries(bairroPositions).map(([nome, pos]) => {
                const bairroData = dados.find(d => d.nome === nome);
                if (bairroData) return null;
                return (
                  <g key={nome}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={3}
                      fill="hsl(var(--muted-foreground) / 0.2)"
                      stroke="hsl(var(--border))"
                      strokeWidth={0.3}
                    />
                    <title>{nome}</title>
                  </g>
                );
              })}

              {/* Active bairros with data */}
              {dados.map((bairro) => {
                const pos = bairroPositions[bairro.nome];
                if (!pos) return null;

                return (
                  <g key={bairro.nome} className="cursor-pointer">
                    {renderBairroCircle(bairro, pos)}
                    <text
                      x={pos.x}
                      y={pos.y + Math.max(8, Math.min(22, (bairro.projetos / maxProjetos) * 22)) + 4}
                      textAnchor="middle"
                      fontSize={3.2}
                      fill="hsl(var(--foreground))"
                      fontWeight="600"
                    >
                      {bairro.nome}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      fontSize={4}
                      fill="white"
                      fontWeight="700"
                    >
                      {bairro.projetos}
                    </text>
                    <title>{`${bairro.nome}: ${bairro.projetos} projeto(s)`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {Object.entries(tipoColors).map(([tipo, color]) => (
              <div key={tipo} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {tipoIcons[tipo]}
                  {tipoLabels[tipo]}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 ml-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <div className="w-4 h-4 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="text-xs text-muted-foreground">Tamanho = quantidade</span>
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
                  <Bar dataKey="evento" stackId="a" fill={tipoColors.evento} name="evento" radius={[0, 0, 0, 0]} />
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
