import { Pedido } from './pedido';

export enum MetodoPagamento {
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  BOLETO = 'BOLETO',
}
export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  APROVADO = 'APROVADO',
  RECUSADO = 'RECUSADO',
  CANCELADO = 'CANCELADO',
}

export interface Pagamento {
  id?: number;
  pedido?: Pedido;
  metodo: MetodoPagamento;
  status: StatusPagamento;
  valor: number;
  numeroCartao?: string;
  bandeiraCartao?: string;
  parcelas?: number;
  codigoPix?: string;
  qrCodePix?: string;
  codigoBarras?: string;
  linkBoleto?: string;
  dataVencimento?: Date;
  transacaoId?: string;
  comprovante?: string;
  dataPagamento?: Date;
  dataConfirmacao?: Date;
  observacoes?: string;
}
