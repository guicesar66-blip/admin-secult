import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Check, Crown, Zap, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: React.ElementType;
  popular?: boolean;
  current?: boolean;
  features: string[];
  limits: {
    users: number | string;
    projects: number | string;
    storage: string;
    support: string;
  };
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal para pequenas organizações iniciando na gestão cultural",
    price: 99,
    period: "mês",
    icon: Zap,
    features: [
      "Até 3 usuários",
      "10 projetos ativos",
      "5GB de armazenamento",
      "Relatórios básicos",
      "Suporte por email",
      "Dashboard básico",
    ],
    limits: {
      users: 3,
      projects: 10,
      storage: "5GB",
      support: "Email",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Para organizações em crescimento com necessidades avançadas",
    price: 249,
    period: "mês",
    icon: Crown,
    popular: true,
    current: true,
    features: [
      "Até 15 usuários",
      "50 projetos ativos",
      "50GB de armazenamento",
      "Relatórios avançados",
      "Suporte prioritário",
      "Dashboard completo",
      "Análise territorial",
      "White-label básico",
      "API de integração",
    ],
    limits: {
      users: 15,
      projects: 50,
      storage: "50GB",
      support: "Prioritário",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Solução completa para grandes organizações e secretarias",
    price: 599,
    period: "mês",
    icon: Building2,
    features: [
      "Usuários ilimitados",
      "Projetos ilimitados",
      "500GB de armazenamento",
      "Relatórios personalizados",
      "Suporte 24/7 dedicado",
      "Dashboard personalizado",
      "Análise territorial avançada",
      "White-label completo",
      "API de integração",
      "SSO / SAML",
      "Backup dedicado",
      "SLA garantido",
    ],
    limits: {
      users: "Ilimitado",
      projects: "Ilimitado",
      storage: "500GB",
      support: "24/7 Dedicado",
    },
  },
];

export default function GestaoPagamento() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan?.current) {
      toast({
        title: "Plano atual",
        description: "Você já está inscrito neste plano.",
      });
      return;
    }
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = plans.find(p => p.id === selectedPlan);
    
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação para o plano ${plan?.name} foi recebida. Entraremos em contato em breve.`,
    });
    
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Pagamento</h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e veja as opções disponíveis para sua organização.
          </p>
        </div>

        {/* Current Plan Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Plano Atual: Professional</CardTitle>
                  <CardDescription>Renovação automática em 15 dias</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Ativo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Usuários ativos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-2xl font-bold text-foreground">38</p>
                <p className="text-xs text-muted-foreground">Projetos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-2xl font-bold text-foreground">23.5GB</p>
                <p className="text-xs text-muted-foreground">Armazenamento usado</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-2xl font-bold text-foreground">R$ 249</p>
                <p className="text-xs text-muted-foreground">Valor mensal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Planos Disponíveis</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <Card 
                  key={plan.id}
                  className={cn(
                    "relative transition-all duration-200 cursor-pointer hover:shadow-lg",
                    plan.popular && "border-primary shadow-md",
                    isSelected && "ring-2 ring-primary",
                    plan.current && "bg-muted/30"
                  )}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Sparkles className="h-3 w-3" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">Plano Atual</Badge>
                    </div>
                  )}

                  <CardHeader className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        plan.popular ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">
                        R$ {plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>

                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.current ? "outline" : plan.popular ? "default" : "secondary"}
                      disabled={plan.current}
                    >
                      {plan.current ? "Plano Atual" : isSelected ? "Selecionado" : "Selecionar"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Action */}
        {selectedPlan && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Alterar para o plano {plans.find(p => p.id === selectedPlan)?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A mudança será aplicada imediatamente. Você será cobrado proporcionalmente.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubscribe} disabled={isProcessing}>
                    {isProcessing ? "Processando..." : "Confirmar Alteração"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Faturamento</CardTitle>
            <CardDescription>Suas últimas faturas e pagamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "01/12/2024", plan: "Professional", amount: 249, status: "Pago" },
                { date: "01/11/2024", plan: "Professional", amount: 249, status: "Pago" },
                { date: "01/10/2024", plan: "Professional", amount: 249, status: "Pago" },
                { date: "01/09/2024", plan: "Starter", amount: 99, status: "Pago" },
              ].map((invoice, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{invoice.date}</p>
                      <p className="text-muted-foreground">Plano {invoice.plan}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">R$ {invoice.amount}</span>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div>
                <h3 className="font-semibold text-foreground">Precisa de um plano personalizado?</h3>
                <p className="text-sm text-muted-foreground">
                  Entre em contato com nossa equipe para uma solução sob medida para sua organização.
                </p>
              </div>
              <Button variant="outline">Falar com Vendas</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
