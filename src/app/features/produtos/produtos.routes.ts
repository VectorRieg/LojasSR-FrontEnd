import { Routes } from '@angular/router';
import { ProdutoListaComponent } from './components/produto-lista/produto-lista';
import { ProdutoDetalheComponent } from './components/produto-detalhe/produto-detalhe';

export const PRODUTOS_ROUTES: Routes = [
  {
    path: '',
    component: ProdutoListaComponent,
  },
  {
    path: ':id',
    component: ProdutoDetalheComponent,
  },
];
