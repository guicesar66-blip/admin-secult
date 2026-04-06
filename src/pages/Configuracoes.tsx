import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";
import { toast } from "@/hooks/use-toast";
import { Upload, RotateCcw, Palette, Image, Building2, CreditCard, Check, Crown, Zap, Sparkles, Bell, User, Shield, FileText, QrCode, Coins, TrendingUp, TrendingDown, ShoppingCart, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const colorPresets = [
  { name: "Cenna (Padrão)", primary: "0 66% 48%", secondary: "24 77% 57%", sidebar: "215 30% 12%" },
  { name: "Azul Corporativo", primary: "217 91% 60%", secondary: "199 89% 48%", sidebar: "222 47% 11%" },
  { name: "Verde Natureza", primary: "142 76% 36%", secondary: "158 64% 52%", sidebar: "144 30% 10%" },
  { name: "Roxo Criativo", primary: "262 83% 58%", secondary: "280 73% 60%", sidebar: "263 35% 12%" },
  { name: "Laranja Energia", primary: "25 95% 53%", secondary: "38 92% 50%", sidebar: "20 30% 12%" },
  { name: "Rosa Moderno", primary: "330 81% 60%", secondary: "340 75% 55%", sidebar: "330 30% 12%" },
];

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
    ],
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
      "White-label básico",
      "API de integração",
    ],
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
      "White-label completo",
      "SSO / SAML",
      "SLA garantido",
    ],
  },
];

const billingHistory = [
  { date: "01/12/2024", plan: "Professional", amount: 249, status: "Pago", metodo: "PIX" },
  { date: "01/11/2024", plan: "Professional", amount: 249, status: "Pago", metodo: "Boleto" },
  { date: "01/10/2024", plan: "Professional", amount: 249, status: "Pago", metodo: "PIX" },
  { date: "01/09/2024", plan: "Starter", amount: 99, status: "Pago", metodo: "PIX" },
];

// Dados de Trocados
const pacotesTrocados = [
  { id: 1, trocados: 500, preco: 2.50, popular: false },
  { id: 2, trocados: 1000, preco: 5.00, popular: true },
  { id: 3, trocados: 2500, preco: 12.50, popular: false },
  { id: 4, trocados: 5000, preco: 25.00, popular: false },
];

const trocadosStats = {
  emCirculacao: 8350,
  totalDistribuido: 12650,
  totalResgatado: 4300,
  recompensas: 5,
};

export default function Configuracoes() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'geral';
  
  const { config, updateConfig, resetConfig } = useWhiteLabel();
  const [clientName, setClientName] = useState(config.clientName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor);
  const [sidebarBackground, setSidebarBackground] = useState(config.sidebarBackground);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estado Trocados
  const [compraDialogOpen, setCompraDialogOpen] = useState(false);
  const [compraStep, setCompraStep] = useState<'pacote' | 'pagamento' | 'confirmacao'>('pacote');
  const [pacoteSelecionado, setPacoteSelecionado] = useState<number | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'boleto' | null>(null);
  
  const logoMainRef = useRef<HTMLInputElement>(null);
  const logoHorizontalRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (type: 'main' | 'horizontal', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'main') {
        updateConfig({ logoMain: reader.result as string });
      } else {
        updateConfig({ logoHorizontal: reader.result as string });
      }
      toast({
        title: "Logo atualizada",
        description: `A logo ${type === 'main' ? 'principal' : 'horizontal'} foi atualizada com sucesso.`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveColors = () => {
    updateConfig({
      clientName,
      primaryColor,
      secondaryColor,
      sidebarBackground,
    });
    toast({
      title: "Configurações salvas",
      description: "As cores da plataforma foram atualizadas com sucesso.",
    });
  };

  const handleApplyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setSidebarBackground(preset.sidebar);
    updateConfig({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      sidebarBackground: preset.sidebar,
    });
    toast({
      title: "Tema aplicado",
      description: `O tema "${preset.name}" foi aplicado com sucesso.`,
    });
  };

  const handleReset = () => {
    resetConfig();
    setClientName('Cenna');
    setPrimaryColor('0 66% 48%');
    setSecondaryColor('24 77% 57%');
    setSidebarBackground('215 30% 12%');
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para o padrão.",
    });
  };

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
    await new Promise(resolve => setTimeout(resolve, 2000));
    const plan = plans.find(p => p.id === selectedPlan);
    toast({
      title: "Solicitação enviada!",
      description: `Sua solicitação para o plano ${plan?.name} foi recebida. Você receberá o boleto ou código PIX por email.`,
    });
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  const handleConfirmarCompra = () => {
    const pacote = pacotesTrocados.find(p => p.id === pacoteSelecionado);
    toast({
      title: "Pedido realizado!",
      description: `Compra de ${pacote?.trocados.toLocaleString()} trocados via ${metodoPagamento === 'pix' ? 'PIX' : 'Boleto'} registrada.`
    });
    resetCompraDialog();
  };

  const resetCompraDialog = () => {
    setCompraDialogOpen(false);
    setCompraStep('pacote');
    setPacoteSelecionado(null);
    setMetodoPagamento(null);
  };

  const hslToHex = (hsl: string): string => {
    const parts = hsl.split(' ');
    if (parts.length < 3) return '#000000';
    const h = parseFloat(parts[0]) / 360;
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0% 0%';
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da plataforma, personalização e pagamentos.
          </p>
        </div>

        <Tabs defaultValue={tabFromUrl} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="whitelabel" className="gap-2">
              <Palette className="h-4 w-4" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Pagamento
            </TabsTrigger>
            <TabsTrigger value="geral" className="gap-2">
              <User className="h-4 w-4" />
              Geral
            </TabsTrigger>
          </TabsList>

          {/* Tab White Label */}
          <TabsContent value="whitelabel" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Identidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Identidade
                  </CardTitle>
                  <CardDescription>
                    Nome e informações básicas do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nome da empresa"
                    />
                  </div>
                  <Button onClick={handleSaveColors} className="w-full">
                    Salvar Identidade
                  </Button>
                </CardContent>
              </Card>

              {/* Logos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Logos
                  </CardTitle>
                  <CardDescription>
                    Upload das logos do cliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo Principal (Login)</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                        {config.logoMain ? (
                          <img src={config.logoMain} alt="Logo principal" className="h-full w-full object-contain" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        ref={logoMainRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload('main', e.target.files[0])}
                      />
                      <Button variant="outline" onClick={() => logoMainRef.current?.click()}>
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Logo Horizontal (Header/Sidebar)</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted">
                        {config.logoHorizontal ? (
                          <img src={config.logoHorizontal} alt="Logo horizontal" className="h-full w-full object-contain" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        ref={logoHorizontalRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleLogoUpload('horizontal', e.target.files[0])}
                      />
                      <Button variant="outline" onClick={() => logoHorizontalRef.current?.click()}>
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cores Personalizadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Cores Personalizadas
                  </CardTitle>
                  <CardDescription>
                    Defina as cores da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hslToHex(primaryColor)}
                        onChange={(e) => setPrimaryColor(hexToHsl(e.target.value))}
                        className="h-10 w-14 cursor-pointer rounded border-0"
                      />
                      <Input
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="0 66% 48%"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hslToHex(secondaryColor)}
                        onChange={(e) => setSecondaryColor(hexToHsl(e.target.value))}
                        className="h-10 w-14 cursor-pointer rounded border-0"
                      />
                      <Input
                        id="secondaryColor"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="24 77% 57%"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebarBackground">Fundo do Sidebar</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={hslToHex(sidebarBackground)}
                        onChange={(e) => setSidebarBackground(hexToHsl(e.target.value))}
                        className="h-10 w-14 cursor-pointer rounded border-0"
                      />
                      <Input
                        id="sidebarBackground"
                        value={sidebarBackground}
                        onChange={(e) => setSidebarBackground(e.target.value)}
                        placeholder="215 30% 12%"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveColors} className="w-full">
                    Aplicar Cores
                  </Button>
                </CardContent>
              </Card>

              {/* Temas Pré-definidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Temas Pré-definidos
                  </CardTitle>
                  <CardDescription>
                    Escolha um tema pronto para aplicar rapidamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset)}
                      className="flex w-full items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex gap-1">
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.primary})` }}
                        />
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.secondary})` }}
                        />
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{ backgroundColor: `hsl(${preset.sidebar})` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualize como ficará a plataforma com as configurações atuais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Botão Primário</p>
                    <Button>Ação Principal</Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Botão Secundário</p>
                    <Button variant="secondary">Ação Secundária</Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Gradiente</p>
                    <div className="h-10 w-full rounded-md gradient-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resetar */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Restaurar Padrão
              </Button>
            </div>
          </TabsContent>

          {/* Tab Pagamento */}
          <TabsContent value="pagamento" className="space-y-6">
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

            {/* Sistema de Trocados */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Sistema de Trocados</h2>
                  <p className="text-sm text-muted-foreground">Moeda virtual da plataforma</p>
                </div>
                <Dialog open={compraDialogOpen} onOpenChange={(open) => open ? setCompraDialogOpen(true) : resetCompraDialog()}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Comprar Trocados
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {compraStep === 'pacote' && 'Escolha um pacote'}
                        {compraStep === 'pagamento' && 'Método de pagamento'}
                        {compraStep === 'confirmacao' && 'Confirmar compra'}
                      </DialogTitle>
                      <DialogDescription>
                        {compraStep === 'pacote' && 'Selecione a quantidade de trocados que deseja comprar'}
                        {compraStep === 'pagamento' && 'Como você prefere pagar?'}
                        {compraStep === 'confirmacao' && 'Revise os detalhes da sua compra'}
                      </DialogDescription>
                    </DialogHeader>

                    {compraStep === 'pacote' && (
                      <div className="grid grid-cols-2 gap-3 py-4">
                        {pacotesTrocados.map((pacote) => (
                          <div
                            key={pacote.id}
                            onClick={() => setPacoteSelecionado(pacote.id)}
                            className={cn(
                              "relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                              pacoteSelecionado === pacote.id ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                            )}
                          >
                            {pacote.popular && (
                              <Badge className="absolute -top-2 right-2 bg-primary">Popular</Badge>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Coins className="h-5 w-5 text-primary" />
                              <span className="font-bold text-lg">{pacote.trocados.toLocaleString()}</span>
                            </div>
                            <p className="text-xl font-bold text-foreground">R$ {pacote.preco.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">
                              R$ {(pacote.preco / pacote.trocados * 100).toFixed(2)} / 100 trocados
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {compraStep === 'pagamento' && (
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div
                          onClick={() => setMetodoPagamento('pix')}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3",
                            metodoPagamento === 'pix' ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                          )}
                        >
                          <QrCode className="h-10 w-10 text-primary" />
                          <span className="font-medium">PIX</span>
                          <span className="text-xs text-muted-foreground text-center">Aprovação instantânea</span>
                        </div>
                        <div
                          onClick={() => setMetodoPagamento('boleto')}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary flex flex-col items-center gap-3",
                            metodoPagamento === 'boleto' ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border"
                          )}
                        >
                          <FileText className="h-10 w-10 text-primary" />
                          <span className="font-medium">Boleto</span>
                          <span className="text-xs text-muted-foreground text-center">Até 3 dias úteis</span>
                        </div>
                      </div>
                    )}

                    {compraStep === 'confirmacao' && (
                      <div className="py-4 space-y-4">
                        <Card>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Pacote</span>
                              <span className="font-medium flex items-center gap-1">
                                <Coins className="h-4 w-4 text-primary" />
                                {pacotesTrocados.find(p => p.id === pacoteSelecionado)?.trocados.toLocaleString()} trocados
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Pagamento</span>
                              <span className="font-medium flex items-center gap-1">
                                {metodoPagamento === 'pix' ? <QrCode className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                {metodoPagamento === 'pix' ? 'PIX' : 'Boleto'}
                              </span>
                            </div>
                            <div className="border-t pt-3 flex justify-between items-center">
                              <span className="font-medium">Total</span>
                              <span className="text-xl font-bold text-primary">
                                R$ {pacotesTrocados.find(p => p.id === pacoteSelecionado)?.preco.toFixed(2)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <DialogFooter className="gap-2">
                      {compraStep !== 'pacote' && (
                        <Button variant="outline" onClick={() => setCompraStep(compraStep === 'confirmacao' ? 'pagamento' : 'pacote')}>
                          Voltar
                        </Button>
                      )}
                      {compraStep === 'pacote' && (
                        <Button onClick={() => setCompraStep('pagamento')} disabled={!pacoteSelecionado}>
                          Continuar
                        </Button>
                      )}
                      {compraStep === 'pagamento' && (
                        <Button onClick={() => setCompraStep('confirmacao')} disabled={!metodoPagamento}>
                          Continuar
                        </Button>
                      )}
                      {compraStep === 'confirmacao' && (
                        <Button onClick={handleConfirmarCompra} className="gap-2">
                          <Check className="h-4 w-4" />
                          Confirmar Compra
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Em Circulação</CardTitle>
                    <Coins className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{trocadosStats.emCirculacao.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">trocados ativos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Distribuído</CardTitle>
                    <TrendingUp className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{trocadosStats.totalDistribuido.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">trocados creditados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Resgatado</CardTitle>
                    <TrendingDown className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{trocadosStats.totalResgatado.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">trocados utilizados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Recompensas</CardTitle>
                    <Gift className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{trocadosStats.recompensas}</div>
                    <p className="text-xs text-muted-foreground">itens no catálogo</p>
                  </CardContent>
                </Card>
              </div>
            </div>

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
                        Pagamento via PIX ou Boleto. Você receberá as instruções por email.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSubscribe} disabled={isProcessing} className="gap-2">
                        <QrCode className="h-4 w-4" />
                        {isProcessing ? "Processando..." : "Gerar Pagamento"}
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
                <CardDescription>Suas últimas faturas e pagamentos (PIX e Boleto)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingHistory.map((invoice, index) => (
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
                        <Badge variant="outline" className="text-xs">
                          {invoice.metodo}
                        </Badge>
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
          </TabsContent>

          {/* Tab Geral */}
          <TabsContent value="geral" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Perfil */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Perfil do Administrador
                  </CardTitle>
                  <CardDescription>
                    Suas informações pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="joao@cenna.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input defaultValue="(81) 99999-0000" />
                  </div>
                  <Button className="w-full">Salvar Alterações</Button>
                </CardContent>
              </Card>

              {/* Notificações */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Configure suas preferências de notificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Notificações por Email</p>
                      <p className="text-xs text-muted-foreground">Receber atualizações por email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Alertas de Pagamento</p>
                      <p className="text-xs text-muted-foreground">Receber lembretes de vencimento</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Novas Oportunidades</p>
                      <p className="text-xs text-muted-foreground">Alertas sobre novas oportunidades</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Relatórios Semanais</p>
                      <p className="text-xs text-muted-foreground">Resumo semanal por email</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Configurações de segurança da conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Alterar Senha</p>
                      <p className="text-xs text-muted-foreground">Última alteração: 30 dias atrás</p>
                    </div>
                    <Button variant="outline" size="sm">Alterar</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Sessões Ativas</p>
                      <p className="text-xs text-muted-foreground">2 dispositivos conectados</p>
                    </div>
                    <Button variant="outline" size="sm">Gerenciar</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Exportar Dados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Dados e Exportação
                  </CardTitle>
                  <CardDescription>
                    Exporte seus dados da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Exportar Relatórios</p>
                      <p className="text-xs text-muted-foreground">Baixar todos os relatórios em PDF</p>
                    </div>
                    <Button variant="outline" size="sm">Exportar</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">Backup de Dados</p>
                      <p className="text-xs text-muted-foreground">Último backup: 2 horas atrás</p>
                    </div>
                    <Button variant="outline" size="sm">Baixar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}