export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  cpf?: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  ativo?: boolean;
  dataCadastro?: Date;
}
