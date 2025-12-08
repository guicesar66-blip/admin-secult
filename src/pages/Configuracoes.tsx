import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWhiteLabel } from "@/contexts/WhiteLabelContext";
import { toast } from "@/hooks/use-toast";
import { Upload, RotateCcw, Palette, Image, Building2 } from "lucide-react";

const colorPresets = [
  { name: "Cenna (Padrão)", primary: "0 66% 48%", secondary: "24 77% 57%", sidebar: "215 30% 12%" },
  { name: "Azul Corporativo", primary: "217 91% 60%", secondary: "199 89% 48%", sidebar: "222 47% 11%" },
  { name: "Verde Natureza", primary: "142 76% 36%", secondary: "158 64% 52%", sidebar: "144 30% 10%" },
  { name: "Roxo Criativo", primary: "262 83% 58%", secondary: "280 73% 60%", sidebar: "263 35% 12%" },
  { name: "Laranja Energia", primary: "25 95% 53%", secondary: "38 92% 50%", sidebar: "20 30% 12%" },
  { name: "Rosa Moderno", primary: "330 81% 60%", secondary: "340 75% 55%", sidebar: "330 30% 12%" },
];

export default function Configuracoes() {
  const { config, updateConfig, resetConfig } = useWhiteLabel();
  const [clientName, setClientName] = useState(config.clientName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor);
  const [sidebarBackground, setSidebarBackground] = useState(config.sidebarBackground);
  
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
          <h1 className="text-2xl font-bold text-foreground">Configurações White Label</h1>
          <p className="text-muted-foreground">
            Personalize a plataforma com as cores e identidade visual do seu cliente.
          </p>
        </div>

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
      </div>
    </DashboardLayout>
  );
}
