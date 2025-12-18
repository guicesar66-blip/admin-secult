import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Megaphone,
  Users,
  DollarSign,
  Briefcase,
  MessageSquare,
  Heart,
  Clock,
  MapPin,
  Star,
  Send,
  Eye,
  UserPlus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Image,
  Calendar,
  Target,
  FileText,
  X,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
}

interface FaseDivulgacaoProps {
  projeto: Projeto;
}

// Mock data do projeto para a página do marketplace
const projetoMarketplace = {
  titulo: "Festival de Cinema Independente 2024",
  subtitulo: "Uma celebração do cinema autoral brasileiro",
  descricao: "O Festival de Cinema Independente 2024 é uma iniciativa que visa promover e celebrar o cinema autoral brasileiro. Durante 5 dias, exibiremos mais de 30 filmes de novos talentos, com sessões de debate, masterclasses e encontros entre cineastas.",
  categoria: "Festival",
  local: "São Paulo, SP",
  dataInicio: "15/03/2024",
  dataFim: "20/03/2024",
  metaFinanciamento: 50000,
  arrecadado: 23000,
  imagens: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  profissionaisNecessarios: [
    { cargo: "Diretor de Produção", quantidade: 1, status: "aberto" },
    { cargo: "Técnico de Som", quantidade: 2, status: "1 confirmado" },
    { cargo: "Iluminador", quantidade: 2, status: "aberto" },
    { cargo: "Assistente de Produção", quantidade: 4, status: "2 confirmados" },
  ],
  retornoEsperado: "Alcançar 5.000 espectadores e gerar cobertura em mídias especializadas",
  impactoCultural: "Fomentar a produção audiovisual independente e criar oportunidades para novos talentos",
};

const investidoresInteressados = [
  { id: "1", nome: "Instituto Cultural ABC", tipo: "Patrocinador", valor: "R$ 15.000", status: "negociando" },
  { id: "2", nome: "Fundação Arte Viva", tipo: "Apoiador", valor: "R$ 8.000", status: "aprovado" },
  { id: "3", nome: "Empresa XYZ", tipo: "Patrocinador", valor: "R$ 25.000", status: "pendente" },
];

const candidatosTrabalhadores = [
  { id: "1", nome: "Carlos Diretor", funcao: "Diretor de Fotografia", experiencia: "5 anos", local: "São Paulo, SP", avaliacao: 4.8 },
  { id: "2", nome: "Marina Som", funcao: "Técnica de Som", experiencia: "3 anos", local: "Rio de Janeiro, RJ", avaliacao: 4.5 },
  { id: "3", nome: "Roberto Luz", funcao: "Iluminador", experiencia: "7 anos", local: "Belo Horizonte, MG", avaliacao: 4.9 },
  { id: "4", nome: "Patrícia Prod", funcao: "Assistente de Produção", experiencia: "2 anos", local: "São Paulo, SP", avaliacao: 4.3 },
];

export const FaseDivulgacao = ({ projeto }: FaseDivulgacaoProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [editData, setEditData] = useState(projetoMarketplace);
  const [validationChecks, setValidationChecks] = useState({
    infoCompleta: false,
    imagensAdicionadas: false,
    metaDefinida: false,
    profissionaisListados: false,
    termoAceito: false,
  });

  const percentArrecadado = (editData.arrecadado / editData.metaFinanciamento) * 100;
  const allChecksComplete = Object.values(validationChecks).every(Boolean);

  const handleSaveEdits = () => {
    setIsEditing(false);
    toast.success("Alterações salvas com sucesso!");
  };

  const handlePublish = () => {
    if (!allChecksComplete) {
      toast.error("Complete todos os itens de validação antes de publicar");
      return;
    }
    setShowPublishDialog(false);
    toast.success("Projeto publicado no marketplace CENA!");
  };

  return (
    <div className="space-y-6">
      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview da Página
          </TabsTrigger>
          <TabsTrigger value="investidores" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Investidores
          </TabsTrigger>
          <TabsTrigger value="trabalhadores" className="gap-2">
            <Users className="h-4 w-4" />
            Trabalhadores
          </TabsTrigger>
        </TabsList>

        {/* Preview da página do marketplace */}
        <TabsContent value="preview" className="mt-6 space-y-6">
          {/* Ações de edição */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Preview da Página no Marketplace</h3>
              <p className="text-sm text-muted-foreground">
                Veja como seu projeto aparecerá para investidores e profissionais
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdits}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Página
                </Button>
              )}
            </div>
          </div>

          {/* Card de preview da página */}
          <Card className="overflow-hidden border-2">
            {/* Banner/Imagens */}
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center">
                {isEditing ? (
                  <Button variant="outline" className="gap-2">
                    <Image className="h-4 w-4" />
                    Alterar Imagem de Capa
                  </Button>
                ) : (
                  <div className="text-center">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mt-2">Imagem de capa do projeto</p>
                  </div>
                )}
              </div>
              <Badge className="absolute top-4 right-4">{editData.categoria}</Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Título e subtítulo */}
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Título do Projeto</Label>
                      <Input
                        value={editData.titulo}
                        onChange={(e) => setEditData({ ...editData, titulo: e.target.value })}
                        className="text-2xl font-bold"
                      />
                    </div>
                    <div>
                      <Label>Subtítulo</Label>
                      <Input
                        value={editData.subtitulo}
                        onChange={(e) => setEditData({ ...editData, subtitulo: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{editData.titulo}</h1>
                    <p className="text-muted-foreground mt-1">{editData.subtitulo}</p>
                  </>
                )}
              </div>

              {/* Info básica */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {isEditing ? (
                    <Input
                      value={editData.local}
                      onChange={(e) => setEditData({ ...editData, local: e.target.value })}
                      className="w-40 h-8"
                    />
                  ) : (
                    editData.local
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {editData.dataInicio} - {editData.dataFim}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Sobre o Projeto
                </h3>
                {isEditing ? (
                  <Textarea
                    value={editData.descricao}
                    onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{editData.descricao}</p>
                )}
              </div>

              {/* Meta de financiamento */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    Meta de Financiamento
                  </h3>
                  {isEditing && (
                    <Input
                      type="number"
                      value={editData.metaFinanciamento}
                      onChange={(e) => setEditData({ ...editData, metaFinanciamento: Number(e.target.value) })}
                      className="w-32 h-8"
                    />
                  )}
                </div>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-2xl font-bold text-emerald-500">
                      R$ {editData.arrecadado.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      de R$ {editData.metaFinanciamento.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <p className="font-semibold">{percentArrecadado.toFixed(0)}%</p>
                </div>
                <Progress value={percentArrecadado} className="h-2" />
              </div>

              {/* Profissionais necessários */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profissionais Necessários
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {editData.profissionaisNecessarios.map((prof, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{prof.cargo}</span>
                        <Badge variant="outline">{prof.quantidade}x</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{prof.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retorno e impacto */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Retorno Esperado
                  </h4>
                  {isEditing ? (
                    <Textarea
                      value={editData.retornoEsperado}
                      onChange={(e) => setEditData({ ...editData, retornoEsperado: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{editData.retornoEsperado}</p>
                  )}
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Impacto Cultural
                  </h4>
                  {isEditing ? (
                    <Textarea
                      value={editData.impactoCultural}
                      onChange={(e) => setEditData({ ...editData, impactoCultural: e.target.value })}
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{editData.impactoCultural}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de validação e publicação */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Validação para Publicação
              </CardTitle>
              <CardDescription>
                Revise e confirme os itens abaixo antes de publicar no marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="infoCompleta"
                    checked={validationChecks.infoCompleta}
                    onCheckedChange={(checked) =>
                      setValidationChecks({ ...validationChecks, infoCompleta: checked as boolean })
                    }
                  />
                  <Label htmlFor="infoCompleta" className="flex items-center gap-2">
                    Todas as informações do projeto estão completas e atualizadas
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="imagensAdicionadas"
                    checked={validationChecks.imagensAdicionadas}
                    onCheckedChange={(checked) =>
                      setValidationChecks({ ...validationChecks, imagensAdicionadas: checked as boolean })
                    }
                  />
                  <Label htmlFor="imagensAdicionadas" className="flex items-center gap-2">
                    Imagens de capa e galeria foram adicionadas
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="metaDefinida"
                    checked={validationChecks.metaDefinida}
                    onCheckedChange={(checked) =>
                      setValidationChecks({ ...validationChecks, metaDefinida: checked as boolean })
                    }
                  />
                  <Label htmlFor="metaDefinida" className="flex items-center gap-2">
                    Meta de financiamento está definida corretamente
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="profissionaisListados"
                    checked={validationChecks.profissionaisListados}
                    onCheckedChange={(checked) =>
                      setValidationChecks({ ...validationChecks, profissionaisListados: checked as boolean })
                    }
                  />
                  <Label htmlFor="profissionaisListados" className="flex items-center gap-2">
                    Lista de profissionais necessários está completa
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="termoAceito"
                    checked={validationChecks.termoAceito}
                    onCheckedChange={(checked) =>
                      setValidationChecks({ ...validationChecks, termoAceito: checked as boolean })
                    }
                  />
                  <Label htmlFor="termoAceito" className="flex items-center gap-2">
                    Concordo com os termos de publicação do marketplace CENA
                  </Label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {allChecksComplete ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm text-emerald-500 font-medium">Pronto para publicar</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <span className="text-sm text-amber-500 font-medium">
                          {Object.values(validationChecks).filter(Boolean).length}/5 itens validados
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => setShowPublishDialog(true)}
                    disabled={!allChecksComplete}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publicar no Marketplace
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de investidores */}
        <TabsContent value="investidores" className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1.2k</p>
                    <p className="text-sm text-muted-foreground">Visualizações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-sm text-muted-foreground">Interessados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Investidores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Candidatos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meta de financiamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Meta de Financiamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-emerald-500">
                      R$ {editData.arrecadado.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-muted-foreground">
                      de R$ {editData.metaFinanciamento.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">{percentArrecadado.toFixed(0)}%</p>
                </div>
                <Progress value={percentArrecadado} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Lista de investidores */}
          <Card>
            <CardHeader>
              <CardTitle>Investidores Interessados</CardTitle>
              <CardDescription>
                Gerencie as propostas de patrocínio e apoio ao projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investidoresInteressados.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{inv.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{inv.nome}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          {inv.tipo}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-emerald-500">{inv.valor}</p>
                        <Badge
                          variant={
                            inv.status === "aprovado"
                              ? "default"
                              : inv.status === "negociando"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de trabalhadores */}
        <TabsContent value="trabalhadores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatos para o Projeto</CardTitle>
              <CardDescription>
                Profissionais interessados em participar do projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidatosTrabalhadores.map((cand) => (
                  <div key={cand.id} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{cand.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{cand.nome}</p>
                          <p className="text-sm text-primary">{cand.funcao}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{cand.avaliacao}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {cand.experiencia}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cand.local}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1">
                        Convidar
                      </Button>
                      <Button size="sm" variant="outline">
                        Ver perfil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmação de publicação */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              Publicar Projeto no Marketplace
            </DialogTitle>
            <DialogDescription>
              Seu projeto será publicado na vitrine do CENA e ficará visível para investidores e profissionais culturais de toda a plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-semibold">{editData.titulo}</h4>
              <p className="text-sm text-muted-foreground">{editData.subtitulo}</p>
              <div className="flex gap-2 mt-3">
                <Badge>{editData.categoria}</Badge>
                <Badge variant="outline">{editData.local}</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Revisar novamente
            </Button>
            <Button onClick={handlePublish} className="gap-2">
              <Send className="h-4 w-4" />
              Confirmar Publicação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
