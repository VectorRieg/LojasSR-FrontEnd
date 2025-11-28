import { Produto } from './produto';

export interface Item {
  id?: number;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal?: number;
  dataAdicao?: Date;
}
