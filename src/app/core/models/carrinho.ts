import { Item } from './item';
import { Usuario } from './usuario';

export interface Carrinho {
  id?: number;
  usuario?: Usuario;
  itens: Item[];
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
