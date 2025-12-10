import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plug, Mail, MessageSquare, CreditCard, Cloud, Database, Link2, CheckCircle2, XCircle, Settings, ExternalLink, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const integracoes = [
  {
    id: "email",
    nome: "Email (SMTP)",
    descricao: "Envio de emails transacionais e notificações",
    icon: Mail,
    status: "conectado",
    categoria: "comunicacao"
  },
  {
    id: "whatsapp",
    nome: "WhatsApp Business",
    descricao: "Notificações e comunicação via WhatsApp",
    icon: MessageSquare,
    status: "desconectado",
    categoria: "comunicacao"
  },
  {
    id: "pagamento",
    nome: "Gateway de Pagamento",
    descricao: "Processamento de pagamentos PIX e Boleto",
    icon: CreditCard,
    status: "conectado",
    categoria: "financeiro"
  },
  {
    id: "storage",
    nome: "Armazenamento Cloud",
    descricao: "Armazenamento de arquivos e mídia",
    icon: Cloud,
    status: "conectado",
    categoria: "infraestrutura"
  },
  {
    id: "analytics",
    nome: "Google Analytics",
    descricao: "Análise de tráfego e comportamento de usuários",
    icon: Database,
    status: "desconectado",
    categoria: "analytics"
  },
  {
    id: "webhook",
    nome: "Webhooks",
    descricao: "Integração com sistemas externos via webhooks",
    icon: Link2,
    status: "parcial",
    categoria: "infraestrutura"
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  conectado: { label: "Conectado", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  desconectado: { label: "Desconectado", color: "bg-gray-100 text-gray-700", icon: XCircle },
  parcial: { label: "Parcial", color: "bg-yellow-100 text-yellow-700", icon: Settings },
};

export default function ConfiguracoesIntegracoes() {
  const { toast } = useToast();
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integracoes[0] | null>(null);

  const handleConfigurar = (integracao: typeof integracoes[0]) => {
    setSelectedIntegration(integracao);
    setConfigDialogOpen(true);
  };

  const handleSalvar = () => {
    toast({
      title: "Configuração salva",
      description: `A integração ${selectedIntegration?.nome} foi configurada com sucesso.`
    });
    setConfigDialogOpen(false);
  };

  const conectadas = integracoes.filter(i => i.status === "conectado").length;
  const desconectadas = integracoes.filter(i => i.status === "desconectado").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte a plataforma com serviços externos e APIs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conectadas</p>
                  <p className="text-2xl font-bold text-foreground">{conectadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Desconectadas</p>
                  <p className="text-2xl font-bold text-foreground">{desconectadas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plug className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Disponíveis</p>
                  <p className="text-2xl font-bold text-foreground">{integracoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Chaves de API
            </CardTitle>
            <CardDescription>
              Gerencie suas chaves de API para integração com sistemas externos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">API Key de Produção</p>
                  <p className="text-sm text-muted-foreground font-mono">ck_live_••••••••••••••••</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Copiar</Button>
                  <Button variant="outline" size="sm">Regenerar</Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium">API Key de Teste</p>
                  <p className="text-sm text-muted-foreground font-mono">ck_test_••••••••••••••••</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Copiar</Button>
                  <Button variant="outline" size="sm">Regenerar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integracoes.map((integracao) => {
            const status = statusConfig[integracao.status];
            const StatusIcon = status.icon;
            return (
              <Card key={integracao.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <integracao.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{integracao.nome}</CardTitle>
                  <CardDescription>{integracao.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant={integracao.status === "conectado" ? "outline" : "default"} 
                      className="flex-1"
                      onClick={() => handleConfigurar(integracao)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    {integracao.status === "conectado" && (
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Config Dialog */}
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurar {selectedIntegration?.nome}</DialogTitle>
              <DialogDescription>
                {selectedIntegration?.descricao}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedIntegration?.id === "email" && (
                <>
                  <div className="space-y-2">
                    <Label>Servidor SMTP</Label>
                    <Input placeholder="smtp.exemplo.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Porta</Label>
                      <Input placeholder="587" />
                    </div>
                    <div className="space-y-2">
                      <Label>Segurança</Label>
                      <Input placeholder="TLS" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Usuário</Label>
                    <Input placeholder="usuario@exemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </>
              )}
              {selectedIntegration?.id === "whatsapp" && (
                <>
                  <div className="space-y-2">
                    <Label>Token de Acesso</Label>
                    <Input placeholder="EAAxxxxxxxxxx..." />
                  </div>
                  <div className="space-y-2">
                    <Label>ID do Telefone</Label>
                    <Input placeholder="5511999999999" />
                  </div>
                </>
              )}
              {selectedIntegration?.id === "pagamento" && (
                <>
                  <div className="space-y-2">
                    <Label>Client ID</Label>
                    <Input placeholder="APP-xxxxx-xxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Client Secret</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Ambiente</Label>
                    <Input placeholder="Produção" disabled />
                  </div>
                </>
              )}
              {selectedIntegration?.id === "analytics" && (
                <>
                  <div className="space-y-2">
                    <Label>ID de Medição</Label>
                    <Input placeholder="G-XXXXXXXXXX" />
                  </div>
                </>
              )}
              {(selectedIntegration?.id === "storage" || selectedIntegration?.id === "webhook") && (
                <div className="space-y-2">
                  <Label>URL da API</Label>
                  <Input placeholder="https://api.exemplo.com" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSalvar}>Salvar Configuração</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}