import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile, ProfileUpdate } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { User, MapPin, Briefcase, FileText, Save, Loader2 } from "lucide-react";

const areasArtisticas = [
  "Música",
  "Teatro",
  "Dança",
  "Artes Visuais",
  "Literatura",
  "Audiovisual",
  "Circo",
  "Cultura Popular",
  "Cultura Digital",
  "Patrimônio Cultural",
  "Artesanato",
  "Outro",
];

const tiposAtuacao = [
  "Artista Individual",
  "Coletivo/Grupo",
  "Produtor Cultural",
  "Gestor Cultural",
  "Técnico",
  "Educador",
  "Pesquisador",
  "Outro",
];

const temposAtuacao = [
  "Menos de 1 ano",
  "1 a 3 anos",
  "3 a 5 anos",
  "5 a 10 anos",
  "Mais de 10 anos",
];

const situacoesFormalizacao = [
  "Pessoa Física",
  "MEI",
  "Empresa Individual",
  "EIRELI",
  "Sociedade Limitada",
  "Associação",
  "Cooperativa",
  "Outro",
];

const opcoesRenda = [
  "Cultura é minha única fonte de renda",
  "Cultura é minha principal fonte de renda",
  "Cultura é uma fonte complementar de renda",
  "Cultura não é fonte de renda",
];

const experienciasEditais = [
  "Nunca participei",
  "Já participei, mas nunca fui contemplado",
  "Já fui contemplado 1 vez",
  "Já fui contemplado 2 a 5 vezes",
  "Já fui contemplado mais de 5 vezes",
];

const necessidadesOpcoes = [
  "Formação artística",
  "Formação em gestão e produção",
  "Acesso a editais e oportunidades",
  "Formalização (MEI, CNPJ)",
  "Acesso a espaços culturais",
  "Equipamentos e materiais",
  "Networking e parcerias",
  "Divulgação do trabalho",
  "Apoio financeiro",
  "Mentoria",
];

const comoConheceuOpcoes = [
  "Redes sociais",
  "Indicação de amigo/conhecido",
  "Evento cultural",
  "Pesquisa na internet",
  "Instituição/organização parceira",
  "Outro",
];

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function MeuPerfil() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useUserProfile();
  
  const [formData, setFormData] = useState<ProfileUpdate>({
    nome_completo: "",
    nome_artistico: "",
    cpf: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    municipio: "",
    estado: "",
    area_artistica: "",
    tipo_atuacao: "",
    tempo_atuacao: "",
    nome_coletivo: "",
    situacao_formalizacao: "",
    cultura_renda: "",
    experiencia_editais: "",
    principais_necessidades: [],
    como_conheceu: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nome_completo: profile.nome_completo || "",
        nome_artistico: profile.nome_artistico || "",
        cpf: profile.cpf || "",
        telefone: profile.telefone || "",
        cep: profile.cep || "",
        rua: profile.rua || "",
        numero: profile.numero || "",
        bairro: profile.bairro || "",
        cidade: profile.cidade || "",
        municipio: profile.municipio || "",
        estado: profile.estado || "",
        area_artistica: profile.area_artistica || "",
        tipo_atuacao: profile.tipo_atuacao || "",
        tempo_atuacao: profile.tempo_atuacao || "",
        nome_coletivo: profile.nome_coletivo || "",
        situacao_formalizacao: profile.situacao_formalizacao || "",
        cultura_renda: profile.cultura_renda || "",
        experiencia_editais: profile.experiencia_editais || "",
        principais_necessidades: profile.principais_necessidades || [],
        como_conheceu: profile.como_conheceu || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof ProfileUpdate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNecessidadesChange = (necessidade: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.principais_necessidades || [];
      if (checked) {
        return { ...prev, principais_necessidades: [...current, necessidade] };
      } else {
        return { ...prev, principais_necessidades: current.filter((n) => n !== necessidade) };
      }
    });
  };

  const handleSubmit = () => {
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e profissionais
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>

        <Tabs defaultValue="pessoal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="pessoal" className="gap-2">
              <User className="h-4 w-4 hidden sm:inline" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="endereco" className="gap-2">
              <MapPin className="h-4 w-4 hidden sm:inline" />
              Endereço
            </TabsTrigger>
            <TabsTrigger value="profissional" className="gap-2">
              <Briefcase className="h-4 w-4 hidden sm:inline" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="adicional" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:inline" />
              Adicional
            </TabsTrigger>
          </TabsList>

          {/* Dados Pessoais */}
          <TabsContent value="pessoal">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações básicas de identificação
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo *</Label>
                  <Input
                    id="nome_completo"
                    value={formData.nome_completo || ""}
                    onChange={(e) => handleInputChange("nome_completo", e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_artistico">Nome Artístico</Label>
                  <Input
                    id="nome_artistico"
                    value={formData.nome_artistico || ""}
                    onChange={(e) => handleInputChange("nome_artistico", e.target.value)}
                    placeholder="Como você é conhecido no meio cultural"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf || ""}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ""}
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endereço */}
          <TabsContent value="endereco">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Informações de localização
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep || ""}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="rua">Rua/Logradouro</Label>
                  <Input
                    id="rua"
                    value={formData.rua || ""}
                    onChange={(e) => handleInputChange("rua", e.target.value)}
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero || ""}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    placeholder="Nº"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro || ""}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade || ""}
                    onChange={(e) => handleInputChange("cidade", e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipio">Município</Label>
                  <Input
                    id="municipio"
                    value={formData.municipio || ""}
                    onChange={(e) => handleInputChange("municipio", e.target.value)}
                    placeholder="Município"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado || ""}
                    onValueChange={(value) => handleInputChange("estado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profissional */}
          <TabsContent value="profissional">
            <Card>
              <CardHeader>
                <CardTitle>Informações Profissionais</CardTitle>
                <CardDescription>
                  Dados sobre sua atuação cultural
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="area_artistica">Área Artística Principal</Label>
                  <Select
                    value={formData.area_artistica || ""}
                    onValueChange={(value) => handleInputChange("area_artistica", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areasArtisticas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_atuacao">Tipo de Atuação</Label>
                  <Select
                    value={formData.tipo_atuacao || ""}
                    onValueChange={(value) => handleInputChange("tipo_atuacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAtuacao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempo_atuacao">Tempo de Atuação</Label>
                  <Select
                    value={formData.tempo_atuacao || ""}
                    onValueChange={(value) => handleInputChange("tempo_atuacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {temposAtuacao.map((tempo) => (
                        <SelectItem key={tempo} value={tempo}>
                          {tempo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_coletivo">Nome do Coletivo/Grupo</Label>
                  <Input
                    id="nome_coletivo"
                    value={formData.nome_coletivo || ""}
                    onChange={(e) => handleInputChange("nome_coletivo", e.target.value)}
                    placeholder="Se aplicável"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situacao_formalizacao">Situação de Formalização</Label>
                  <Select
                    value={formData.situacao_formalizacao || ""}
                    onValueChange={(value) => handleInputChange("situacao_formalizacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {situacoesFormalizacao.map((sit) => (
                        <SelectItem key={sit} value={sit}>
                          {sit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cultura_renda">Cultura como Fonte de Renda</Label>
                  <Select
                    value={formData.cultura_renda || ""}
                    onValueChange={(value) => handleInputChange("cultura_renda", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {opcoesRenda.map((opcao) => (
                        <SelectItem key={opcao} value={opcao}>
                          {opcao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="experiencia_editais">Experiência com Editais</Label>
                  <Select
                    value={formData.experiencia_editais || ""}
                    onValueChange={(value) => handleInputChange("experiencia_editais", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienciasEditais.map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Adicional */}
          <TabsContent value="adicional">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Principais Necessidades</CardTitle>
                  <CardDescription>
                    Selecione as áreas onde você mais precisa de apoio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {necessidadesOpcoes.map((necessidade) => (
                      <div key={necessidade} className="flex items-center space-x-2">
                        <Checkbox
                          id={necessidade}
                          checked={(formData.principais_necessidades || []).includes(necessidade)}
                          onCheckedChange={(checked) =>
                            handleNecessidadesChange(necessidade, checked as boolean)
                          }
                        />
                        <Label htmlFor={necessidade} className="text-sm font-normal cursor-pointer">
                          {necessidade}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Como nos conheceu?</CardTitle>
                  <CardDescription>
                    Ajude-nos a entender como você chegou até aqui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.como_conheceu || ""}
                    onValueChange={(value) => handleInputChange("como_conheceu", value)}
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {comoConheceuOpcoes.map((opcao) => (
                        <SelectItem key={opcao} value={opcao}>
                          {opcao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
