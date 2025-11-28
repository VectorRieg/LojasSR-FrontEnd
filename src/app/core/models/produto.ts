export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  precoPromocional?: number;
  estoque: number;
  imagemPrincipal?: string;
  imagensAdicionais?: string[];
  categoria?: string;
  marca?: string;
  sku?: string;
  ativo?: boolean;
  destaque?: boolean;
  emPromocao?: boolean;
  dataCadastro?: Date;
}
