import { Routes } from '@angular/router';
import { PagamentoFormComponent } from './components/pagamento-form/pagamento-form';
import { PagamentoConfirmacaoComponent } from './components/pagamento-confirmacao/pagamento-confirmacao';

export const PAGAMENTO_ROUTES: Routes = [
  {
    path: '',
    component: PagamentoFormComponent,
  },
  {
    path: 'confirmacao/:id',
    component: PagamentoConfirmacaoComponent,
  },
];
