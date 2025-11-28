import { Usuario } from './usuario';
import { Item } from './item';

export enum StatusPedido {
  AGUARDANDO_PAGAMENTO = 'AGUARDANDO_PAGAMENTO',
  PAGAMENTO_CONFIRMADO = 'PAGAMENTO_CONFIRMADO',
  EM_SEPARACAO = 'EM_SEPARACAO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export interface Pedido {
  id?: number;
  usuario?: Usuario;
  itens: Item[];
  numeroPedido: string;
  subtotal: number;
  valorFrete: number;
  desconto?: number;
  valorTotal: number;
  enderecoEntrega?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  dataPedido?: Date;
  dataPrevisaoEntrega?: Date;
  dataEntrega?: Date;
  status: StatusPedido;
  observacoes?: string;
}
