export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidatura_historico: {
        Row: {
          candidatura_id: string
          data_mudanca: string
          id: string
          observacao: string | null
          status: string
          usuario_id: string | null
        }
        Insert: {
          candidatura_id: string
          data_mudanca?: string
          id?: string
          observacao?: string | null
          status: string
          usuario_id?: string | null
        }
        Update: {
          candidatura_id?: string
          data_mudanca?: string
          id?: string
          observacao?: string | null
          status?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidatura_historico_candidatura_id_fkey"
            columns: ["candidatura_id"]
            isOneToOne: false
            referencedRelation: "candidaturas_com_oportunidade"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidatura_historico_candidatura_id_fkey"
            columns: ["candidatura_id"]
            isOneToOne: false
            referencedRelation: "oportunidade_interessados"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_financeiros: {
        Row: {
          categoria: string | null
          created_at: string
          criador_id: string
          data: string
          descricao: string
          id: string
          oficina_id: string | null
          oportunidade_id: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          criador_id: string
          data: string
          descricao: string
          id?: string
          oficina_id?: string | null
          oportunidade_id?: string | null
          status?: string
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          criador_id?: string
          data?: string
          descricao?: string
          id?: string
          oficina_id?: string | null
          oportunidade_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_financeiros_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_com_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_vitrine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_com_interesse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_financeiros_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_vitrine"
            referencedColumns: ["id"]
          },
        ]
      }
      oficina_inscricoes: {
        Row: {
          created_at: string
          id: string
          oficina_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          oficina_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          oficina_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oficina_inscricoes_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oficina_inscricoes_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_com_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oficina_inscricoes_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_vitrine"
            referencedColumns: ["id"]
          },
        ]
      }
      oficinas: {
        Row: {
          area_artistica: string
          canais_divulgacao: string[] | null
          captacao_atual: number | null
          carga_horaria: number
          categoria: string
          cobertura_evento: string[] | null
          created_at: string
          criador_id: string | null
          data_evento_final: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          descricao_acolhimento: string | null
          descricao_divulgacao: string | null
          dias_semana: string[]
          emite_certificado: boolean | null
          endereco_completo: string | null
          equipamentos_materiais: Json | null
          equipe_apoio: Json | null
          equipe_instrutores: Json | null
          estrategia_campanha: string | null
          etapas_encontros: Json | null
          exibir_vitrine: boolean | null
          facilitador_avatar: string | null
          facilitador_bio: string | null
          facilitador_nome: string
          faixa_etaria_max: number | null
          faixa_etaria_min: number | null
          horario: string
          id: string
          imagem: string | null
          indicadores_sucesso: Json | null
          inscricao_fim: string
          itens_custo: Json | null
          justificativa: string | null
          linguagem_artistica: string | null
          local: string | null
          marcas_parceiras: Json | null
          meta_captacao: number | null
          metodologia_descricao: string | null
          modalidade: string
          mostrar_progresso: boolean | null
          nivel: string
          num_encontros: number
          objetivo_geral: string | null
          objetivos_especificos: Json | null
          orcamento_total: number | null
          organizacao: string
          parcerias_midia: Json | null
          perfil_participante: string | null
          periodo_inscricoes_fim: string | null
          periodo_inscricoes_inicio: string | null
          periodo_oficinas_fim: string | null
          periodo_oficinas_inicio: string | null
          periodo_producao_fim: string | null
          periodo_producao_inicio: string | null
          prerequisitos: string | null
          publico_alvo: string | null
          quantidade_participantes: number | null
          recursos_acessibilidade: string[] | null
          reserva_tecnica_percentual: number | null
          resultados_qualitativos: string | null
          resultados_quantitativos: Json | null
          status: string
          status_wizard: string | null
          step_atual: number | null
          tamanho_grupos: number | null
          territorios: string[] | null
          titulo: string
          updated_at: string
          vagas_total: number
        }
        Insert: {
          area_artistica: string
          canais_divulgacao?: string[] | null
          captacao_atual?: number | null
          carga_horaria: number
          categoria: string
          cobertura_evento?: string[] | null
          created_at?: string
          criador_id?: string | null
          data_evento_final?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          descricao_acolhimento?: string | null
          descricao_divulgacao?: string | null
          dias_semana: string[]
          emite_certificado?: boolean | null
          endereco_completo?: string | null
          equipamentos_materiais?: Json | null
          equipe_apoio?: Json | null
          equipe_instrutores?: Json | null
          estrategia_campanha?: string | null
          etapas_encontros?: Json | null
          exibir_vitrine?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome: string
          faixa_etaria_max?: number | null
          faixa_etaria_min?: number | null
          horario: string
          id?: string
          imagem?: string | null
          indicadores_sucesso?: Json | null
          inscricao_fim: string
          itens_custo?: Json | null
          justificativa?: string | null
          linguagem_artistica?: string | null
          local?: string | null
          marcas_parceiras?: Json | null
          meta_captacao?: number | null
          metodologia_descricao?: string | null
          modalidade: string
          mostrar_progresso?: boolean | null
          nivel: string
          num_encontros: number
          objetivo_geral?: string | null
          objetivos_especificos?: Json | null
          orcamento_total?: number | null
          organizacao: string
          parcerias_midia?: Json | null
          perfil_participante?: string | null
          periodo_inscricoes_fim?: string | null
          periodo_inscricoes_inicio?: string | null
          periodo_oficinas_fim?: string | null
          periodo_oficinas_inicio?: string | null
          periodo_producao_fim?: string | null
          periodo_producao_inicio?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          quantidade_participantes?: number | null
          recursos_acessibilidade?: string[] | null
          reserva_tecnica_percentual?: number | null
          resultados_qualitativos?: string | null
          resultados_quantitativos?: Json | null
          status?: string
          status_wizard?: string | null
          step_atual?: number | null
          tamanho_grupos?: number | null
          territorios?: string[] | null
          titulo: string
          updated_at?: string
          vagas_total?: number
        }
        Update: {
          area_artistica?: string
          canais_divulgacao?: string[] | null
          captacao_atual?: number | null
          carga_horaria?: number
          categoria?: string
          cobertura_evento?: string[] | null
          created_at?: string
          criador_id?: string | null
          data_evento_final?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          descricao_acolhimento?: string | null
          descricao_divulgacao?: string | null
          dias_semana?: string[]
          emite_certificado?: boolean | null
          endereco_completo?: string | null
          equipamentos_materiais?: Json | null
          equipe_apoio?: Json | null
          equipe_instrutores?: Json | null
          estrategia_campanha?: string | null
          etapas_encontros?: Json | null
          exibir_vitrine?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome?: string
          faixa_etaria_max?: number | null
          faixa_etaria_min?: number | null
          horario?: string
          id?: string
          imagem?: string | null
          indicadores_sucesso?: Json | null
          inscricao_fim?: string
          itens_custo?: Json | null
          justificativa?: string | null
          linguagem_artistica?: string | null
          local?: string | null
          marcas_parceiras?: Json | null
          meta_captacao?: number | null
          metodologia_descricao?: string | null
          modalidade?: string
          mostrar_progresso?: boolean | null
          nivel?: string
          num_encontros?: number
          objetivo_geral?: string | null
          objetivos_especificos?: Json | null
          orcamento_total?: number | null
          organizacao?: string
          parcerias_midia?: Json | null
          perfil_participante?: string | null
          periodo_inscricoes_fim?: string | null
          periodo_inscricoes_inicio?: string | null
          periodo_oficinas_fim?: string | null
          periodo_oficinas_inicio?: string | null
          periodo_producao_fim?: string | null
          periodo_producao_inicio?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          quantidade_participantes?: number | null
          recursos_acessibilidade?: string[] | null
          reserva_tecnica_percentual?: number | null
          resultados_qualitativos?: string | null
          resultados_quantitativos?: Json | null
          status?: string
          status_wizard?: string | null
          step_atual?: number | null
          tamanho_grupos?: number | null
          territorios?: string[] | null
          titulo?: string
          updated_at?: string
          vagas_total?: number
        }
        Relationships: []
      }
      oportunidade_interessados: {
        Row: {
          created_at: string
          id: string
          mensagem: string | null
          motivo_reprovacao: string | null
          oportunidade_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mensagem?: string | null
          motivo_reprovacao?: string | null
          oportunidade_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mensagem?: string | null
          motivo_reprovacao?: string | null
          oportunidade_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_com_interesse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_vitrine"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          area_cultural: string | null
          captacao_atual: number | null
          cena_coins: number | null
          created_at: string
          criador_contato: string | null
          criador_id: string | null
          criador_nome: string
          data_evento: string | null
          descricao: string | null
          duracao: string
          exibir_vitrine: boolean | null
          horario: string | null
          id: string
          imagem: string | null
          local: string | null
          meta_captacao: number | null
          mostrar_progresso: boolean | null
          municipio: string | null
          prazo_inscricao: string | null
          remuneracao: number | null
          requisitos: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          vagas: number | null
        }
        Insert: {
          area_cultural?: string | null
          captacao_atual?: number | null
          cena_coins?: number | null
          created_at?: string
          criador_contato?: string | null
          criador_id?: string | null
          criador_nome: string
          data_evento?: string | null
          descricao?: string | null
          duracao: string
          exibir_vitrine?: boolean | null
          horario?: string | null
          id?: string
          imagem?: string | null
          local?: string | null
          meta_captacao?: number | null
          mostrar_progresso?: boolean | null
          municipio?: string | null
          prazo_inscricao?: string | null
          remuneracao?: number | null
          requisitos?: string | null
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          vagas?: number | null
        }
        Update: {
          area_cultural?: string | null
          captacao_atual?: number | null
          cena_coins?: number | null
          created_at?: string
          criador_contato?: string | null
          criador_id?: string | null
          criador_nome?: string
          data_evento?: string | null
          descricao?: string | null
          duracao?: string
          exibir_vitrine?: boolean | null
          horario?: string | null
          id?: string
          imagem?: string | null
          local?: string | null
          meta_captacao?: number | null
          mostrar_progresso?: boolean | null
          municipio?: string | null
          prazo_inscricao?: string | null
          remuneracao?: number | null
          requisitos?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          vagas?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area_artistica: string | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          como_conheceu: string | null
          cpf: string | null
          created_at: string
          cultura_renda: string | null
          estado: string | null
          experiencia_editais: string | null
          id: string
          municipio: string | null
          nome_artistico: string | null
          nome_coletivo: string | null
          nome_completo: string
          numero: string | null
          principais_necessidades: string[] | null
          rua: string | null
          situacao_formalizacao: string | null
          telefone: string | null
          tempo_atuacao: string | null
          tipo_atuacao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area_artistica?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          como_conheceu?: string | null
          cpf?: string | null
          created_at?: string
          cultura_renda?: string | null
          estado?: string | null
          experiencia_editais?: string | null
          id?: string
          municipio?: string | null
          nome_artistico?: string | null
          nome_coletivo?: string | null
          nome_completo: string
          numero?: string | null
          principais_necessidades?: string[] | null
          rua?: string | null
          situacao_formalizacao?: string | null
          telefone?: string | null
          tempo_atuacao?: string | null
          tipo_atuacao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area_artistica?: string | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          como_conheceu?: string | null
          cpf?: string | null
          created_at?: string
          cultura_renda?: string | null
          estado?: string | null
          experiencia_editais?: string | null
          id?: string
          municipio?: string | null
          nome_artistico?: string | null
          nome_coletivo?: string | null
          nome_completo?: string
          numero?: string | null
          principais_necessidades?: string[] | null
          rua?: string | null
          situacao_formalizacao?: string | null
          telefone?: string | null
          tempo_atuacao?: string | null
          tipo_atuacao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      propostas_investimento: {
        Row: {
          contrapartidas_desejadas: string[] | null
          created_at: string | null
          criador_id: string
          descricao_servico: string | null
          id: string
          investidor_id: string
          mensagem: string | null
          motivo_rejeicao: string | null
          oficina_id: string | null
          oportunidade_id: string | null
          proposta_pai_id: string | null
          status: Database["public"]["Enums"]["status_proposta"] | null
          tipo_apoio: Database["public"]["Enums"]["tipo_apoio"]
          updated_at: string | null
          valor_financeiro: number | null
        }
        Insert: {
          contrapartidas_desejadas?: string[] | null
          created_at?: string | null
          criador_id: string
          descricao_servico?: string | null
          id?: string
          investidor_id: string
          mensagem?: string | null
          motivo_rejeicao?: string | null
          oficina_id?: string | null
          oportunidade_id?: string | null
          proposta_pai_id?: string | null
          status?: Database["public"]["Enums"]["status_proposta"] | null
          tipo_apoio: Database["public"]["Enums"]["tipo_apoio"]
          updated_at?: string | null
          valor_financeiro?: number | null
        }
        Update: {
          contrapartidas_desejadas?: string[] | null
          created_at?: string | null
          criador_id?: string
          descricao_servico?: string | null
          id?: string
          investidor_id?: string
          mensagem?: string | null
          motivo_rejeicao?: string | null
          oficina_id?: string | null
          oportunidade_id?: string | null
          proposta_pai_id?: string | null
          status?: Database["public"]["Enums"]["status_proposta"] | null
          tipo_apoio?: Database["public"]["Enums"]["tipo_apoio"]
          updated_at?: string | null
          valor_financeiro?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "propostas_investimento_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_com_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_vitrine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_com_interesse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_vitrine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_investimento_proposta_pai_id_fkey"
            columns: ["proposta_pai_id"]
            isOneToOne: false
            referencedRelation: "propostas_investimento"
            referencedColumns: ["id"]
          },
        ]
      }
      repasses_colaboradores: {
        Row: {
          colaborador_id: string | null
          colaborador_nome: string
          created_at: string
          criador_id: string
          data_pagamento: string | null
          id: string
          oficina_id: string | null
          oportunidade_id: string | null
          status: string
          updated_at: string
          valor: number
        }
        Insert: {
          colaborador_id?: string | null
          colaborador_nome: string
          created_at?: string
          criador_id: string
          data_pagamento?: string | null
          id?: string
          oficina_id?: string | null
          oportunidade_id?: string | null
          status?: string
          updated_at?: string
          valor: number
        }
        Update: {
          colaborador_id?: string | null
          colaborador_nome?: string
          created_at?: string
          criador_id?: string
          data_pagamento?: string | null
          id?: string
          oficina_id?: string | null
          oportunidade_id?: string | null
          status?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "repasses_colaboradores_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_colaboradores_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_com_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_colaboradores_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas_vitrine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_colaboradores_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_colaboradores_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_com_interesse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_colaboradores_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_vitrine"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      candidaturas_com_oportunidade: {
        Row: {
          area_cultural: string | null
          created_at: string | null
          criador_contato: string | null
          criador_nome: string | null
          data_evento: string | null
          descricao: string | null
          duracao: string | null
          horario: string | null
          id: string | null
          imagem: string | null
          local: string | null
          mensagem: string | null
          motivo_reprovacao: string | null
          municipio: string | null
          oportunidade_id: string | null
          prazo_inscricao: string | null
          remuneracao: number | null
          requisitos: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          trocados: number | null
          updated_at: string | null
          user_id: string | null
          vagas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_com_interesse"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidade_interessados_oportunidade_id_fkey"
            columns: ["oportunidade_id"]
            isOneToOne: false
            referencedRelation: "oportunidades_vitrine"
            referencedColumns: ["id"]
          },
        ]
      }
      oficinas_com_vagas: {
        Row: {
          area_artistica: string | null
          carga_horaria: number | null
          categoria: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          dias_semana: string[] | null
          emite_certificado: boolean | null
          facilitador_avatar: string | null
          facilitador_bio: string | null
          facilitador_nome: string | null
          horario: string | null
          id: string | null
          imagem: string | null
          inscricao_fim: string | null
          local: string | null
          modalidade: string | null
          nivel: string | null
          num_encontros: number | null
          organizacao: string | null
          prerequisitos: string | null
          publico_alvo: string | null
          status: string | null
          titulo: string | null
          updated_at: string | null
          vagas_disponiveis: number | null
          vagas_total: number | null
        }
        Insert: {
          area_artistica?: string | null
          carga_horaria?: number | null
          categoria?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          dias_semana?: string[] | null
          emite_certificado?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          inscricao_fim?: string | null
          local?: string | null
          modalidade?: string | null
          nivel?: string | null
          num_encontros?: number | null
          organizacao?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          vagas_disponiveis?: never
          vagas_total?: number | null
        }
        Update: {
          area_artistica?: string | null
          carga_horaria?: number | null
          categoria?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          dias_semana?: string[] | null
          emite_certificado?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          inscricao_fim?: string | null
          local?: string | null
          modalidade?: string | null
          nivel?: string | null
          num_encontros?: number | null
          organizacao?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          status?: string | null
          titulo?: string | null
          updated_at?: string | null
          vagas_disponiveis?: never
          vagas_total?: number | null
        }
        Relationships: []
      }
      oficinas_vitrine: {
        Row: {
          area_artistica: string | null
          captacao_atual: number | null
          carga_horaria: number | null
          categoria: string | null
          created_at: string | null
          criador_id: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          dias_semana: string[] | null
          emite_certificado: boolean | null
          exibir_vitrine: boolean | null
          facilitador_avatar: string | null
          facilitador_bio: string | null
          facilitador_nome: string | null
          horario: string | null
          id: string | null
          imagem: string | null
          inscricao_fim: string | null
          local: string | null
          meta_captacao: number | null
          modalidade: string | null
          mostrar_progresso: boolean | null
          nivel: string | null
          num_encontros: number | null
          organizacao: string | null
          prerequisitos: string | null
          publico_alvo: string | null
          status: string | null
          titulo: string | null
          total_propostas: number | null
          updated_at: string | null
          vagas_total: number | null
          valor_captado: number | null
        }
        Insert: {
          area_artistica?: string | null
          captacao_atual?: number | null
          carga_horaria?: number | null
          categoria?: string | null
          created_at?: string | null
          criador_id?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          dias_semana?: string[] | null
          emite_certificado?: boolean | null
          exibir_vitrine?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          inscricao_fim?: string | null
          local?: string | null
          meta_captacao?: number | null
          modalidade?: string | null
          mostrar_progresso?: boolean | null
          nivel?: string | null
          num_encontros?: number | null
          organizacao?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          status?: string | null
          titulo?: string | null
          total_propostas?: never
          updated_at?: string | null
          vagas_total?: number | null
          valor_captado?: never
        }
        Update: {
          area_artistica?: string | null
          captacao_atual?: number | null
          carga_horaria?: number | null
          categoria?: string | null
          created_at?: string | null
          criador_id?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          dias_semana?: string[] | null
          emite_certificado?: boolean | null
          exibir_vitrine?: boolean | null
          facilitador_avatar?: string | null
          facilitador_bio?: string | null
          facilitador_nome?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          inscricao_fim?: string | null
          local?: string | null
          meta_captacao?: number | null
          modalidade?: string | null
          mostrar_progresso?: boolean | null
          nivel?: string | null
          num_encontros?: number | null
          organizacao?: string | null
          prerequisitos?: string | null
          publico_alvo?: string | null
          status?: string | null
          titulo?: string | null
          total_propostas?: never
          updated_at?: string | null
          vagas_total?: number | null
          valor_captado?: never
        }
        Relationships: []
      }
      oportunidades_com_interesse: {
        Row: {
          area_cultural: string | null
          cena_coins: number | null
          created_at: string | null
          criador_contato: string | null
          criador_id: string | null
          criador_nome: string | null
          data_evento: string | null
          descricao: string | null
          duracao: string | null
          horario: string | null
          id: string | null
          imagem: string | null
          local: string | null
          municipio: string | null
          prazo_inscricao: string | null
          remuneracao: number | null
          requisitos: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          total_aceitos: number | null
          total_interessados: number | null
          updated_at: string | null
          vagas: number | null
        }
        Insert: {
          area_cultural?: string | null
          cena_coins?: number | null
          created_at?: string | null
          criador_contato?: string | null
          criador_id?: string | null
          criador_nome?: string | null
          data_evento?: string | null
          descricao?: string | null
          duracao?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          local?: string | null
          municipio?: string | null
          prazo_inscricao?: string | null
          remuneracao?: number | null
          requisitos?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          total_aceitos?: never
          total_interessados?: never
          updated_at?: string | null
          vagas?: number | null
        }
        Update: {
          area_cultural?: string | null
          cena_coins?: number | null
          created_at?: string | null
          criador_contato?: string | null
          criador_id?: string | null
          criador_nome?: string | null
          data_evento?: string | null
          descricao?: string | null
          duracao?: string | null
          horario?: string | null
          id?: string | null
          imagem?: string | null
          local?: string | null
          municipio?: string | null
          prazo_inscricao?: string | null
          remuneracao?: number | null
          requisitos?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          total_aceitos?: never
          total_interessados?: never
          updated_at?: string | null
          vagas?: number | null
        }
        Relationships: []
      }
      oportunidades_vitrine: {
        Row: {
          area_cultural: string | null
          captacao_atual: number | null
          cena_coins: number | null
          created_at: string | null
          criador_contato: string | null
          criador_id: string | null
          criador_nome: string | null
          criador_nome_artistico: string | null
          criador_nome_completo: string | null
          data_evento: string | null
          descricao: string | null
          duracao: string | null
          exibir_vitrine: boolean | null
          horario: string | null
          id: string | null
          imagem: string | null
          local: string | null
          meta_captacao: number | null
          mostrar_progresso: boolean | null
          municipio: string | null
          prazo_inscricao: string | null
          remuneracao: number | null
          requisitos: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          total_propostas: number | null
          updated_at: string | null
          vagas: number | null
          valor_captado: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "app" | "admin"
      status_proposta:
        | "pendente"
        | "aprovada"
        | "rejeitada"
        | "contraproposta"
        | "cancelada"
      tipo_apoio: "financeiro" | "servico" | "patrocinio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["app", "admin"],
      status_proposta: [
        "pendente",
        "aprovada",
        "rejeitada",
        "contraproposta",
        "cancelada",
      ],
      tipo_apoio: ["financeiro", "servico", "patrocinio"],
    },
  },
} as const
