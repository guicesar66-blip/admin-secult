import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, MapPin, Users, TrendingUp, TrendingDown, DollarSign, Target, BarChart3, PieChart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const analyticsCards = [
  {
    title: "Análise Financeira",
    description: "ROI, investimentos e métricas financeiras dos programas",
    icon: DollarSign,
    path: "/analise-financeira",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    metrics: [
      { label: "ROI Médio", value: "285%", trend: "+12%" },
      { label: "Investimento Total", value: "R$ 2.5M", trend: "+8%" },
    ]
  },
  {
    title: "Análise Territorial",
    description: "Mapa de calor e distribuição geográfica das oportunidades",
    icon: MapPin,
    path: "/analise-territorial",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    metrics: [
      { label: "Regiões Ativas", value: "15", trend: "+3" },
      { label: "Cobertura", value: "78%", trend: "+5%" },
    ]
  },
  {
    title: "Análise de Pessoas",
    description: "Impacto social e desenvolvimento de artistas",
    icon: Users,
    path: "/analise-artistas",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    metrics: [
      { label: "Artistas Ativos", value: "1.234", trend: "+156" },
      { label: "Taxa de Sucesso", value: "89%", trend: "+4%" },
    ]
  },
];

const quickStats = [
  { label: "Oportunidades Ativas", value: "24", icon: Target, trend: "+5" },
  { label: "Incubações em Andamento", value: "8", icon: BarChart3, trend: "+2" },
  { label: "Investimento Mensal", value: "R$ 125K", icon: DollarSign, trend: "+15%" },
  { label: "Taxa de Conversão", value: "67%", icon: PieChart, trend: "+8%" },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas e análises da plataforma
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend} este mês
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsCards.map((card) => (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
                <CardTitle className="mt-4">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {card.metrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-lg font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {metric.trend}
                      </p>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to={card.path}>
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Performance</CardTitle>
            <CardDescription>Comparativo do período atual vs anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-foreground">R$ 485.000</p>
                <div className="flex items-center gap-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+23% vs mês anterior</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Novos Artistas</p>
                <p className="text-2xl font-bold text-foreground">156</p>
                <div className="flex items-center gap-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18% vs mês anterior</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Projetos Concluídos</p>
                <p className="text-2xl font-bold text-foreground">42</p>
                <div className="flex items-center gap-1 text-green-500 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8% vs mês anterior</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Engajamento</p>
                <p className="text-2xl font-bold text-foreground">89%</p>
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <TrendingDown className="h-4 w-4" />
                  <span>-2% vs mês anterior</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}