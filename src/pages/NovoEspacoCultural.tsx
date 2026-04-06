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

type TipoEspaco = "teatro" | "museu" | "biblioteca" | "galeria" | "estudio" | "outro";

const TIPOS_ESPACO = {
  teatro: { label: "Teatro", descricao: "Espaço para apresentações teatrais", icon: "🎭" },
  museu: { label: "Museu", descricao: "Espaço para exposições", icon: "🖼️" },
  biblioteca: { label: "Biblioteca", descricao: "Acervo de livros e documentação", icon: "📚" },
  galeria: { label: "Galeria", descricao: "Espaço de artes visuais", icon: "🎨" },
  estudio: { label: "Estúdio", descricao: "Espaço de criação e ensaio", icon: "🎪" },
  outro: { label: "Outro", descricao: "Espaço de uso cultural", icon: "🏛️" },
} as const;

const ACESSIBILIDADE_OPTIONS = [
  { value: "totalmente", label: "Totalmente acessível" },
  { value: "parcialmente", label: "Parcialmente acessível" },
  { value: "nao", label: "Não acessível" },
];

const CONSERVACAO_OPTIONS = [
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
  { value: "regular", label: "Regular" },
  { value: "precario", label: "Precário" },
];

const ESTADOS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function NovoEspacoCultural() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(1);
  const [processando, setProcessando] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [protocolo, setProtocolo] = useState("");

  const [tipo, setTipo] = useState<TipoEspaco>("teatro");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [estado, setEstado] = useState("PE");
  const [horarios, setHorarios] = useState("");
  const [acessibilidade, setAcessibilidade] = useState("parcialmente");
  const [conservacao, setConservacao] = useState("bom");

  const validarEtapa = (n: number) => {
    if (n === 1) return true;
    if (n === 2) return nome.length > 0 && descricao.length >= 20 && cnpj.length >= 10 && email.length > 0;
    if (n === 3) return endereco.length > 0 && horarios.length > 0;
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
    setProtocolo(`ESP-${Date.now()}`);
    setShowSucesso(true);
    setProcessando(false);
    toast.success("Espaço cultural registrado!");
  };

  const renderEtapa = () => {
    if (etapa === 1) {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold">Que tipo de espaço cultural?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.entries(TIPOS_ESPACO) as [TipoEspaco, typeof TIPOS_ESPACO[TipoEspaco]][]).map(([key, cfg]) => (
              <Card key={key} className={cn("cursor-pointer border-2", tipo === key ? "border-violet-600 bg-violet-50" : "border-border")} onClick={() => setTipo(key)}>
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl mb-2">{cfg.icon}</div>
                  <h4 className="font-semibold text-sm">{cfg.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{cfg.descricao}</p>
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
            <Badge className="mt-2 bg-violet-600">{TIPOS_ESPACO[tipo].label}</Badge>
          </div>
          <div>
            <Label>Nome do Espaço *</Label>
            <Input placeholder="Ex: Teatro Santa Isabel" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Descrição *</Label>
            <Textarea placeholder="Descreva o espaço, sua história e importância cultural" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="mt-1" />
            <p className="text-xs text-muted-foreground mt-1">Mínimo 20 caracteres</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CNPJ *</Label>
              <Input placeholder="00.000.000/0001-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((est) => (
                    <SelectItem key={est} value={est}>{est}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email *</Label>
              <Input type="email" placeholder="contato@espaco.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input placeholder="(81) 3000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1" />
            </div>
          </div>
        </div>
      );
    }

    if (etapa === 3) {
      return (
        <div className="space-y-4">
          <div>
            <Label>Endereço *</Label>
            <Textarea placeholder="Rua, número, bairro, complemento" value={endereco} onChange={(e) => setEndereco(e.target.value)} rows={3} className="mt-1" />
          </div>
          <div>
            <Label>Horários de Funcionamento *</Label>
            <Textarea placeholder="Ex: Seg-Sex 10h-18h | Sáb 14h-20h | Dom fechado" value={horarios} onChange={(e) => setHorarios(e.target.value)} rows={2} className="mt-1" />
          </div>
          <div>
            <Label>Acessibilidade</Label>
            <Select value={acessibilidade} onValueChange={setAcessibilidade}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACESSIBILIDADE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Estado de Conservação</Label>
            <Select value={conservacao} onValueChange={setConservacao}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONSERVACAO_OPTIONS.map((o) => (
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
        <div><span className="font-semibold">Tipo:</span> {TIPOS_ESPACO[tipo].label}</div>
        <div><span className="font-semibold">Nome:</span> {nome}</div>
        <div><span className="font-semibold">Descrição:</span> {descricao}</div>
        <div className="pt-2 border-t grid grid-cols-2 gap-2">
          <div><span className="font-semibold text-xs">CNPJ:</span> {cnpj}</div>
          <div><span className="font-semibold text-xs">Estado:</span> {estado}</div>
        </div>
        <div><span className="font-semibold text-xs">Email:</span> {email}</div>
        <div className="pt-2 border-t grid grid-cols-2 gap-2">
          <div><span className="font-semibold text-xs">Acessibilidade:</span> {ACESSIBILIDADE_OPTIONS.find(o => o.value === acessibilidade)?.label}</div>
          <div><span className="font-semibold text-xs">Conservação:</span> {CONSERVACAO_OPTIONS.find(o => o.value === conservacao)?.label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Registrar Espaço Cultural</h1>
            <p className="text-sm text-muted-foreground">Etapa {etapa}/4</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={cn("flex-1 h-1 rounded transition-colors", n <= etapa ? (n < etapa ? "bg-emerald-500" : "bg-violet-600") : "bg-neutral-200")} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {["Tipo", "Dados Básicos", "Configurações", "Revise"][etapa - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>{renderEtapa()}</CardContent>
          <div className="flex gap-2 justify-between p-4 border-t bg-neutral-50">
            <Button variant="outline" onClick={() => etapa > 1 && setEtapa(etapa - 1)} disabled={etapa === 1}>
              Anterior
            </Button>
            {etapa < 4 ? (
              <Button onClick={handleProxima} className="bg-violet-600 hover:bg-violet-700">
                Próxima
              </Button>
            ) : (
              <Button onClick={handlePublicar} disabled={processando} className="bg-emerald-600 hover:bg-emerald-700">
                {processando ? "Registrando..." : "Registrar"}
              </Button>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={showSucesso} onOpenChange={setShowSucesso}>
        <DialogContent className="text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
          <DialogTitle>Espaço Registrado!</DialogTitle>
          <DialogDescription className="mt-2">
            Seu espaço cultural foi registrado com sucesso.
            <br />
            Protocolo: <span className="font-mono font-bold">{protocolo}</span>
          </DialogDescription>
          <Button onClick={() => navigate("/projetos")} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Voltar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
