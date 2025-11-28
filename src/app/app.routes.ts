import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./features/produtos/produtos.routes').then((m) => m.PRODUTOS_ROUTES),
      },
      {
        path: 'carrinho',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/carrinho/carrinho.routes').then((m) => m.CARRINHO_ROUTES),
      },
      {
        path: 'pagamento',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/pagamento/pagamento.routes').then((m) => m.PAGAMENTO_ROUTES),
      },
      {
        path: 'perfil',
        canActivate: [authGuard],
        loadChildren: () => import('./features/perfil/perfil.routes').then((m) => m.PERFIL_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
