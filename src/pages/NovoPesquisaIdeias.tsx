import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TipoPesquisa = "pergunta" | "votacao" | "solucao";

const TIPOS_PESQUISA = {
  pergunta: { label: "Pergunta Aberta", descricao: "Usuários respondem livremente", icon: "❓" },
  votacao: { label: "Votação", descricao: "Usuários votam entre opções", icon: "🗳️" },
  solucao: { label: "Solução de Problema", descricao: "Usuários propõem soluções", icon: "💡" },
} as const;

const DURACAO_OPTIONS = [
  { value: "7", label: "7 dias" },
  { value: "15", label: "15 dias" },
  { value: "30", label: "30 dias" },
  { value: "60", label: "60 dias" },
];

const PUBLICO_OPTIONS = [
  { value: "geral", label: "Toda plataforma" },
  { value: "artistas", label: "Artistas" },
  { value: "coletivos", label: "Coletivos" },
  { value: "produtoras", label: "Produtoras" },
  { value: "espacos", label: "Espaços Culturais" },
];

export default function NovoPesquisaIdeias() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [processando, setProcessando] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  const [tipo, setTipo] = useState<TipoPesquisa>("pergunta");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [contexto, setContexto] = useState("");
  const [publico, setPublico] = useState("geral");
  const [duracao, setDuracao] = useState("30");

  const validarEtapa = (n: number) => {
    if (n === 1) return true;
    if (n === 2) return titulo.length > 0 && descricao.length >= 20 && contexto.length >= 20;
    return true;
  };

  const handleProxima = () => {
    if (!validarEtapa(etapa)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    setEtapa(etapa + 1);
  };

  const handlePublicar = async () => {
    setProcessando(true);
    await new Promise((r) => setTimeout(r, 800));
    setProtocolo(`PE-${Date.now()}`);
    setShowSucesso(true);
    setProcessando(false);
    toast.success("Pesquisa publicada!");
  };

  const renderEtapa = () => {
    if (etapa === 1) {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold">Qual tipo?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.entries(TIPOS_PESQUISA) as [TipoPesquisa, typeof TIPOS_PESQUISA[TipoPesquisa]][]).map(([key, cfg]) => (
              <Card key={key} className={cn("cursor-pointer border-2", tipo === key ? "border-violet-600 bg-violet-50" : "border-gray-200")} onClick={() => setTipo(key)}>
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl mb-2">{cfg.icon}</div>
                  <h4 className="font-semibold text-sm">{cfg.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{cfg.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (etapa === 2) {
      return (
        <div className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <Badge className="mt-2 bg-violet-600">{TIPOS_PESQUISA[tipo].label}</Badge>
          </div>
          <div>
            <Label>Título *</Label>
            <Input placeholder="Título da pesquisa" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Descrição *</Label>
            <Textarea placeholder="Descreva a pesquisa" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Mínimo 20 caracteres</p>
          </div>
          <div>
            <Label>Contexto *</Label>
            <Textarea placeholder="Por que essa pesquisa?" value={contexto} onChange={(e) => setContexto(e.target.value)} rows={3} className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Mínimo 20 caracteres</p>
          </div>
        </div>
      );
    }

    if (etapa === 3) {
      return (
        <div className="space-y-4">
          <div>
            <Label>Público-alvo</Label>
            <Select value={publico} onValueChange={setPublico}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PUBLICO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Duração</Label>
            <Select value={duracao} onValueChange={setDuracao}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DURACAO_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 text-sm">
        <div><span className="font-semibold">Tipo:</span> {TIPOS_PESQUISA[tipo].label}</div>
        <div><span className="font-semibold">Título:</span> {titulo}</div>
        <div><span className="font-semibold">Descrição:</span> {descricao}</div>
        <div><span className="font-semibold">Contexto:</span> {contexto}</div>
        <div className="pt-2 border-t grid grid-cols-2 gap-2">
          <div><span className="font-semibold text-xs">Público:</span> {PUBLICO_OPTIONS.find(o => o.value === publico)?.label}</div>
          <div><span className="font-semibold text-xs">Duração:</span> {DURACAO_OPTIONS.find(o => o.value === duracao)?.label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Pesquisa & Ideias</h1>
            <p className="text-sm text-gray-600">Etapa {etapa}/4</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={cn("flex-1 h-1 rounded transition-colors", n <= etapa ? (n < etapa ? "bg-emerald-500" : "bg-violet-600") : "bg-gray-200")} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {["Escolha o tipo", "Preencha dados", "Configure", "Revise"][etapa - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderEtapa()}</CardContent>
          <div className="flex gap-2 justify-between p-4 border-t bg-gray-50">
            <Button variant="outline" onClick={() => etapa > 1 && setEtapa(etapa - 1)} disabled={etapa === 1}>
              Anterior
            </Button>
            {etapa < 4 ? (
              <Button onClick={handleProxima} className="bg-violet-600 hover:bg-violet-700">
                Próxima
              </Button>
            ) : (
              <Button onClick={handlePublicar} disabled={processando} className="bg-emerald-600 hover:bg-emerald-700">
                {processando ? "Publicando..." : "Publicar"}
              </Button>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={showSucesso} onOpenChange={setShowSucesso}>
        <DialogContent className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
          <DialogTitle>Pesquisa Publicada!</DialogTitle>
          <DialogDescription className="mt-2">
            Protocolo: <span className="font-mono font-bold">{protocolo}</span>
          </DialogDescription>
          <Button onClick={() => navigate("/oportunidades")} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Voltar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
