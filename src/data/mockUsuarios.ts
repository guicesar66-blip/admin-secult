// Mock data: Usuários — todo cadastro no app é um usuário

export interface Usuario {
  id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  genero: string;
  raca_cor: string;
  municipio: string;
  codigo_municipio: string;
  distrito?: string;
  endereco?: string;
  bairro?: string;
  cep?: string;
  estado: string;
  foto?: string;
  categorias_interesse: string[];
  created_at: string;
}

export const usuariosMock: Usuario[] = [
  {
    id: "u1", nome_completo: "Ana Cristina Lima", email: "anacristina@email.com",
    telefone: "(81) 99900-1234", cpf: "123.000.000-45", nascimento: "1988-03-12",
    genero: "Mulher cis", raca_cor: "Parda", municipio: "Recife",
    codigo_municipio: "2611606", distrito: "Recife",
    endereco: "Rua do Sol, 100", bairro: "Boa Vista", cep: "50030-220", estado: "PE",
    categorias_interesse: ["Cultura Popular", "Dança", "Percussão"],
    created_at: "2022-01-15",
  },
  {
    id: "u2", nome_completo: "João Pedro Barros", email: "joao.barros@email.com",
    telefone: "(81) 99800-5678", cpf: "456.000.000-78", nascimento: "1995-07-22",
    genero: "Homem cis", raca_cor: "Preta", municipio: "Recife",
    codigo_municipio: "2611606", distrito: "Recife",
    bairro: "Ibura", estado: "PE",
    categorias_interesse: ["Dança", "Percussão"],
    created_at: "2022-03-10",
  },
  {
    id: "u3", nome_completo: "Carla Souza", email: "carla.souza@email.com",
    telefone: "(81) 99700-9012", cpf: "789.000.000-12", nascimento: "1992-11-05",
    genero: "Mulher cis", raca_cor: "Branca", municipio: "Olinda",
    codigo_municipio: "2609600", distrito: "Olinda",
    bairro: "Carmo", estado: "PE",
    categorias_interesse: ["Artes Visuais", "Figurino"],
    created_at: "2022-06-01",
  },
  {
    id: "u4", nome_completo: "Lucas Fernandes", email: "lucas.f@email.com",
    telefone: "(81) 99100-0001", cpf: "111.000.000-01", nascimento: "1998-01-15",
    genero: "Homem cis", raca_cor: "Preta", municipio: "Olinda",
    codigo_municipio: "2609600", distrito: "Olinda",
    bairro: "Rio Doce", estado: "PE",
    categorias_interesse: ["Literatura", "Slam"],
    created_at: "2021-06-10",
  },
  {
    id: "u5", nome_completo: "Mariana Costa", email: "mariana.c@email.com",
    telefone: "(81) 99100-0002", cpf: "111.000.000-02", nascimento: "2001-05-22",
    genero: "Mulher cis", raca_cor: "Parda", municipio: "Olinda",
    codigo_municipio: "2609600", distrito: "Olinda",
    bairro: "Peixinhos", estado: "PE",
    categorias_interesse: ["Literatura", "Teatro"],
    created_at: "2022-01-20",
  },
  {
    id: "u6", nome_completo: "Rafael Oliveira", email: "rafael.o@email.com",
    telefone: "(81) 99100-0003", cpf: "111.000.000-03", nascimento: "1993-11-08",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Recife",
    codigo_municipio: "2611606", distrito: "Recife",
    bairro: "Afogados", estado: "PE",
    categorias_interesse: ["Literatura", "Música", "Produção"],
    created_at: "2021-06-10",
  },
  {
    id: "u7", nome_completo: "Tatiana Reis", email: "tatiana.r@email.com",
    telefone: "(81) 99100-0004", cpf: "111.000.000-04", nascimento: "1990-07-30",
    genero: "Mulher cis", raca_cor: "Preta", municipio: "Olinda",
    codigo_municipio: "2609600", distrito: "Olinda",
    bairro: "Varadouro", estado: "PE",
    categorias_interesse: ["Literatura", "Cultura Popular"],
    created_at: "2022-02-15",
  },
  {
    id: "u8", nome_completo: "Fernanda Alves", email: "fernanda.a@email.com",
    telefone: "(81) 99200-0001", cpf: "222.000.000-01", nascimento: "1987-04-10",
    genero: "Mulher cis", raca_cor: "Branca", municipio: "Caruaru",
    codigo_municipio: "2604106", distrito: "Caruaru",
    bairro: "Maurício de Nassau", estado: "PE",
    categorias_interesse: ["Dança", "Artes Cênicas"],
    created_at: "2017-01-20",
  },
  {
    id: "u9", nome_completo: "Diego Santos", email: "diego.s@email.com",
    telefone: "(81) 99200-0002", cpf: "222.000.000-02", nascimento: "1996-09-18",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Caruaru",
    codigo_municipio: "2604106", distrito: "Caruaru",
    bairro: "Centro", estado: "PE",
    categorias_interesse: ["Dança", "Música"],
    created_at: "2018-05-10",
  },
  {
    id: "u10", nome_completo: "Patrícia Lima", email: "patricia.l@email.com",
    telefone: "(81) 99200-0003", cpf: "222.000.000-03", nascimento: "2000-02-25",
    genero: "Mulher cis", raca_cor: "Preta", municipio: "Caruaru",
    codigo_municipio: "2604106", distrito: "Caruaru",
    bairro: "Petrópolis", estado: "PE",
    categorias_interesse: ["Dança"],
    created_at: "2021-03-15",
  },
  {
    id: "u11", nome_completo: "Marcos Vieira", email: "marcos.v@email.com",
    telefone: "(81) 99200-0004", cpf: "222.000.000-04", nascimento: "1985-12-01",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Caruaru",
    bairro: "Boa Vista", estado: "PE",
    categorias_interesse: ["Dança", "Teatro", "Artes Visuais"],
    created_at: "2017-01-20",
  },
  {
    id: "u12", nome_completo: "Thiago Ribeiro", email: "thiago.r@email.com",
    telefone: "(87) 99300-0001", cpf: "333.000.000-01", nascimento: "1994-06-14",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Petrolina",
    bairro: "Centro", estado: "PE",
    categorias_interesse: ["Audiovisual", "Música"],
    created_at: "2023-04-01",
  },
  {
    id: "u13", nome_completo: "Juliana Mendes", email: "juliana.m@email.com",
    telefone: "(87) 99300-0002", cpf: "333.000.000-02", nascimento: "1999-03-20",
    genero: "Mulher cis", raca_cor: "Branca", municipio: "Petrolina",
    bairro: "Areia Branca", estado: "PE",
    categorias_interesse: ["Audiovisual", "Artes Visuais"],
    created_at: "2023-04-01",
  },
  {
    id: "u14", nome_completo: "Pedro Nascimento", email: "pedro.n@email.com",
    telefone: "(87) 99300-0003", cpf: "333.000.000-03", nascimento: "1991-10-05",
    genero: "Homem cis", raca_cor: "Preta", municipio: "Petrolina",
    bairro: "Jardim Maravilha", estado: "PE",
    categorias_interesse: ["Audiovisual"],
    created_at: "2023-04-01",
  },
  {
    id: "u15", nome_completo: "Roberto Cavalcanti", email: "roberto.c@email.com",
    telefone: "(81) 99400-0001", cpf: "444.000.000-01", nascimento: "1975-08-20",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Recife",
    bairro: "Recife Antigo", estado: "PE",
    categorias_interesse: ["Música", "Cultura Popular"],
    created_at: "2019-08-12",
  },
  {
    id: "u16", nome_completo: "Sandra Moreira", email: "sandra.m@email.com",
    telefone: "(81) 99400-0002", cpf: "444.000.000-02", nascimento: "1982-11-14",
    genero: "Mulher cis", raca_cor: "Preta", municipio: "Recife",
    bairro: "Espinheiro", estado: "PE",
    categorias_interesse: ["Música"],
    created_at: "2019-08-12",
  },
  {
    id: "u17", nome_completo: "André Batista", email: "andre.b@email.com",
    telefone: "(81) 99400-0003", cpf: "444.000.000-03", nascimento: "1997-03-28",
    genero: "Homem cis", raca_cor: "Parda", municipio: "Recife",
    bairro: "Casa Amarela", estado: "PE",
    categorias_interesse: ["Música", "Percussão"],
    created_at: "2020-02-15",
  },
  {
    id: "u18", nome_completo: "Cláudia Freitas", email: "claudia.f@email.com",
    telefone: "(81) 99400-0004", cpf: "444.000.000-04", nascimento: "1989-07-03",
    genero: "Mulher cis", raca_cor: "Branca", municipio: "Recife",
    bairro: "Derby", estado: "PE",
    categorias_interesse: ["Música"],
    created_at: "2019-08-12",
  },
];
