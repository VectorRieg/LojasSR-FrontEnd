import { Routes } from '@angular/router';
import { PerfilDadosComponent } from './components/perfil-dados/perfil-dados';
import { PerfilPedidosComponent } from './components/perfil-pedidos/perfil-pedidos';
import { PerfilEnderecosComponent } from './components/perfil-enderecos/perfil-enderecos';

export const PERFIL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dados',
    pathMatch: 'full',
  },
  {
    path: 'dados',
    component: PerfilDadosComponent,
  },
  {
    path: 'pedidos',
    component: PerfilPedidosComponent,
  },
  {
    path: 'enderecos',
    component: PerfilEnderecosComponent,
  },
];
