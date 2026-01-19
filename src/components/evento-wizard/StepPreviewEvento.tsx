import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Calendar, MapPin, Users, DollarSign, Music, Accessibility } from "lucide-react";
import { EventoWizardData, hasVagasParaArtistas } from "@/types/evento-wizard";

interface StepPreviewEventoProps {
  data: EventoWizardData;
  onChange: (updates: Partial<EventoWizardData>) => void;
  exibirVitrine: boolean;
  setExibirVitrine: (v: boolean) => void;
  mostrarProgresso: boolean;
  setMostrarProgresso: (v: boolean) => void;
}

export function StepPreviewEvento({ data, exibirVitrine, setExibirVitrine, mostrarProgresso, setMostrarProgresso }: StepPreviewEventoProps) {
  const temVagas = hasVagasParaArtistas(data);
  const dataEvento = data.formato_duracao === "unico_dia" ? data.data_evento : `${data.data_inicio} a ${data.data_fim}`;
  const totalCustos = data.itens_custo.reduce((acc, i) => acc + i.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-green-500/10"><Eye className="h-6 w-6 text-green-600" /></div>
        <div><h2 className="text-xl font-semibold">Preview e Publicação</h2><p className="text-muted-foreground mt-1">Revise as informações antes de publicar.</p></div>
      </div>

      {/* Card Preview */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
          <span className="text-white text-4xl">🎭</span>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{data.nome_evento || "Nome do Evento"}</h3>
              <p className="text-muted-foreground">{data.tipo_evento}</p>
            </div>
            <div className="flex gap-2">
              <Badge>{data.linguagem_principal}</Badge>
              {!data.evento_com_ingresso && <Badge className="bg-green-600">Gratuito</Badge>}
              {temVagas && <Badge className="bg-amber-600">Vagas Abertas</Badge>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" />{dataEvento || "Data não definida"}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{data.nome_local || data.modalidade}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />{data.publico_esperado} pessoas</div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Music className="h-4 w-4" /> Programação</h4>
            <p className="text-sm text-muted-foreground">{data.atracoes.length + data.palcos.reduce((a, p) => a + p.atracoes.length, 0)} atração(ões)</p>
            {temVagas && <p className="text-sm text-amber-600">{data.vagas_artistas.length} vaga(s) para artistas CENA</p>}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Orçamento</h4>
            <p className="text-2xl font-bold">R$ {totalCustos.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Accessibility className="h-4 w-4" /> Acessibilidade</h4>
            <p className="text-sm text-muted-foreground">{data.recursos_acessibilidade.length} recurso(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-3">
            <h4 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Equipe</h4>
            <p className="text-sm text-muted-foreground">{data.equipe_producao.length + data.equipe_tecnica.length + data.equipe_apoio.length} pessoa(s)</p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Opções de Publicação */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">Opções de Publicação</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div><Label>Publicar no Feed do App</Label><p className="text-xs text-muted-foreground">O evento aparecerá no feed de oportunidades</p></div>
            <Switch checked={true} disabled />
          </div>
          {temVagas && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><Label>Publicar Vagas para Artistas</Label><p className="text-xs text-muted-foreground">Artistas compatíveis receberão notificação</p></div>
              <Switch checked={true} disabled />
            </div>
          )}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div><Label>Publicar na Vitrine de Investidores</Label><p className="text-xs text-muted-foreground">Permite receber propostas de patrocínio</p></div>
            <Switch checked={exibirVitrine} onCheckedChange={setExibirVitrine} />
          </div>
          {exibirVitrine && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div><Label>Mostrar Progresso de Captação</Label><p className="text-xs text-muted-foreground">Exibe barra de progresso para investidores</p></div>
              <Switch checked={mostrarProgresso} onCheckedChange={setMostrarProgresso} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
