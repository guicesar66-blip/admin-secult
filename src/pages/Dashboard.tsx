import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Award,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data para o jornal digital
const manchetePrincipal = {
  categoria: "RESULTADO DESTAQUE",
  titulo: "Festival Vozes da Periferia reúne mais de 5.000 pessoas e revela novos talentos",
  subtitulo: "Evento realizado na Várzea celebra a conclusão do programa de incubação com apresentações de 12 artistas formados pela plataforma",
  imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  data: "15 Dez 2025",
  autor: "Equipe Caran",
  leitura: "5 min",
};

const oportunidadesDestaque = [
  {
    id: 1,
    tipo: "Edital",
    titulo: "Edital de Fomento à Música Independente 2025",
    valor: "R$ 50.000",
    prazo: "30 Dez",
    vagas: 20,
    inscritos: 145,
  },
  {
    id: 2,
    tipo: "Show",
    titulo: "Apresentação no Palco Principal - Réveillon Cultural",
    valor: "R$ 3.500",
    prazo: "22 Dez",
    vagas: 8,
    inscritos: 34,
  },
  {
    id: 3,
    tipo: "Residência",
    titulo: "Residência Artística - Centro Cultural Recife",
    valor: "R$ 8.000",
    prazo: "15 Jan",
    vagas: 4,
    inscritos: 28,
  },
];

const resultadosComunidade = [
  {
    id: 1,
    tipo: "Conquista",
    titulo: "MC Lua conquista prêmio de Revelação no Prêmio da Música PE",
    resumo: "Artista incubada pela plataforma em 2024 foi reconhecida pelo trabalho autoral",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    data: "12 Dez",
  },
  {
    id: 2,
    tipo: "Projeto",
    titulo: "Coletivo Raízes lança documentário sobre cultura de rua",
    resumo: "Produção financiada pelo programa de fomento estreia em circuito alternativo",
    imagem: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    data: "10 Dez",
  },
  {
    id: 3,
    tipo: "Milestone",
    titulo: "500 artistas formados desde o início do programa",
    resumo: "Marco histórico celebra impacto do programa de incubação na comunidade",
    imagem: "https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=400&q=80",
    data: "8 Dez",
  },
];

const pesquisasComunidade = [
  {
    id: 1,
    titulo: "Mapeamento de Espaços Culturais",
    participantes: 234,
    prazo: "Em andamento",
    progresso: 67,
  },
  {
    id: 2,
    titulo: "Demandas de Formação 2025",
    participantes: 189,
    prazo: "Encerra em 5 dias",
    progresso: 85,
  },
];

const galeriaArtes = [
  {
    id: 1,
    artista: "Ana Terra",
    titulo: "Cores da Várzea",
    tipo: "Pintura Digital",
    imagem: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80",
    likes: 234,
    comentarios: 18,
  },
  {
    id: 2,
    artista: "DJ Storm",
    titulo: "Beat Urbano #47",
    tipo: "Música",
    imagem: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80",
    likes: 456,
    comentarios: 32,
  },
  {
    id: 3,
    artista: "Coletivo Visual",
    titulo: "Murais do Centro",
    tipo: "Fotografia",
    imagem: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80",
    likes: 189,
    comentarios: 24,
  },
  {
    id: 4,
    artista: "Maria Flor",
    titulo: "Poesia Marginal",
    tipo: "Literatura",
    imagem: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&q=80",
    likes: 312,
    comentarios: 45,
  },
];

const incubacoesAndamento = [
  {
    id: 1,
    nome: "Turma Vozes Urbanas 2025",
    fase: "Formação Técnica",
    progresso: 45,
    participantes: 15,
    proximaAtividade: "Workshop de Produção Musical",
    dataAtividade: "18 Dez",
  },
  {
    id: 2,
    nome: "Programa Jovens Produtores",
    fase: "Mentoria Individual",
    progresso: 72,
    participantes: 8,
    proximaAtividade: "Sessão com Mentor Convidado",
    dataAtividade: "20 Dez",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho do Jornal */}
        <div className="border-b-4 border-foreground pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                Jornal da Comunidade
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Edição de {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground">Plataforma Caran</p>
              <p className="text-lg font-semibold text-foreground">2.847 membros ativos</p>
            </div>
          </div>
        </div>

        {/* Manchete Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <article className="group cursor-pointer">
              <Badge variant="destructive" className="mb-3 text-xs font-semibold">
                {manchetePrincipal.categoria}
              </Badge>
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={manchetePrincipal.imagem} 
                  alt={manchetePrincipal.titulo}
                  className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                    {manchetePrincipal.titulo}
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground text-base mb-3 leading-relaxed">
                {manchetePrincipal.subtitulo}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {manchetePrincipal.data}
                </span>
                <span>Por {manchetePrincipal.autor}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {manchetePrincipal.leitura} de leitura
                </span>
              </div>
            </article>
          </div>

          {/* Coluna Lateral - Oportunidades em Destaque */}
          <div className="border-l-0 lg:border-l-2 border-border lg:pl-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <Sparkles className="h-4 w-4 text-primary" />
                Oportunidades Abertas
              </h3>
              <Link to="/oportunidades" className="text-xs text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {oportunidadesDestaque.map((op) => (
                <Link 
                  key={op.id} 
                  to={`/oportunidades/${op.id}`}
                  className="block p-4 rounded-lg border border-border bg-card hover:shadow-elevated transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {op.tipo}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">{op.valor}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {op.titulo}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Até {op.prazo}
                    </span>
                    <span>{op.inscritos}/{op.vagas} vagas</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divisor Editorial */}
        <div className="border-t-2 border-b-2 border-foreground py-2">
          <div className="flex items-center justify-center gap-8 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Resultados</span>
            <span className="text-foreground">•</span>
            <span>Pesquisas</span>
            <span className="text-foreground">•</span>
            <span>Galeria</span>
            <span className="text-foreground">•</span>
            <span>Incubações</span>
          </div>
        </div>

        {/* Resultados da Comunidade */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Award className="h-6 w-6 text-warning" />
              Resultados da Comunidade
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resultadosComunidade.map((resultado, index) => (
              <article 
                key={resultado.id} 
                className={`group cursor-pointer ${index === 0 ? 'md:row-span-2' : ''}`}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img 
                    src={resultado.imagem} 
                    alt={resultado.titulo}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${index === 0 ? 'h-[280px]' : 'h-[160px]'}`}
                  />
                  <Badge 
                    className="absolute top-3 left-3 text-xs"
                    variant={resultado.tipo === 'Conquista' ? 'default' : resultado.tipo === 'Projeto' ? 'secondary' : 'outline'}
                  >
                    {resultado.tipo}
                  </Badge>
                </div>
                <h4 className={`font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors ${index === 0 ? 'text-lg' : 'text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
                  {resultado.titulo}
                </h4>
                <p className={`text-muted-foreground mb-2 line-clamp-2 ${index === 0 ? 'text-sm' : 'text-xs'}`}>
                  {resultado.resumo}
                </p>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {resultado.data}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* Grid: Pesquisas + Incubações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pesquisas da Comunidade */}
          <section className="border-t-4 border-primary pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <BarChart3 className="h-5 w-5 text-primary" />
                Pesquisas Ativas
              </h3>
            </div>
            <div className="space-y-4">
              {pesquisasComunidade.map((pesquisa) => (
                <div 
                  key={pesquisa.id}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-card transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-card-foreground mb-2">{pesquisa.titulo}</h4>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {pesquisa.participantes} participantes
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {pesquisa.prazo}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${pesquisa.progresso}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">{pesquisa.progresso}% completa</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Participar de Pesquisas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </section>

          {/* Incubações em Andamento */}
          <section className="border-t-4 border-secondary pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
                <TrendingUp className="h-5 w-5 text-secondary" />
                Incubações em Andamento
              </h3>
              <Link to="/incubacoes" className="text-xs text-primary hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-4">
              {incubacoesAndamento.map((incubacao) => (
                <Link 
                  key={incubacao.id}
                  to={`/incubacoes/${incubacao.id}`}
                  className="block p-4 rounded-lg border border-border bg-card hover:shadow-card transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-card-foreground">{incubacao.nome}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {incubacao.fase}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {incubacao.participantes} participantes
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-3">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all"
                      style={{ width: `${incubacao.progresso}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Próximo: <span className="text-foreground font-medium">{incubacao.proximaAtividade}</span>
                    </span>
                    <span className="text-primary font-medium">{incubacao.dataAtividade}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Galeria de Artes */}
        <section className="border-t-4 border-foreground pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Star className="h-6 w-6 text-warning" />
              Galeria da Comunidade
            </h3>
            <Button variant="outline" size="sm">
              Ver galeria completa
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galeriaArtes.map((arte) => (
              <div 
                key={arte.id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg mb-2 aspect-square">
                  <img 
                    src={arte.imagem} 
                    alt={arte.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-4 text-white">
                      <span className="flex items-center gap-1 text-sm">
                        <Heart className="h-4 w-4" />
                        {arte.likes}
                      </span>
                      <span className="flex items-center gap-1 text-sm">
                        <MessageCircle className="h-4 w-4" />
                        {arte.comentarios}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    className="absolute top-2 right-2 text-xs opacity-90"
                    variant="secondary"
                  >
                    {arte.tipo}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm text-card-foreground truncate">{arte.titulo}</h4>
                <p className="text-xs text-muted-foreground">por {arte.artista}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rodapé do Jornal */}
        <div className="border-t-2 border-foreground pt-4 mt-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>© 2025 Jornal da Comunidade Caran - Todos os direitos reservados</p>
            <p>Próxima edição: {new Date(Date.now() + 86400000).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
