import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo">
          <a routerLink="/">Lojas SR</a>
        </div>

        <nav class="nav">
          <a routerLink="/" routerLinkActive="active">Home</a>
          <a routerLink="/produtos" routerLinkActive="active">Produtos</a>

          <ng-container *ngIf="isAuthenticated">
            <a routerLink="/carrinho" routerLinkActive="active">Carrinho</a>
            <a routerLink="/perfil" routerLinkActive="active">Perfil</a>
            <button (click)="logout()">Sair</button>
          </ng-container>

          <ng-container *ngIf="!isAuthenticated">
            <a routerLink="/auth/login" routerLinkActive="active">Login</a>
            <a routerLink="/auth/registro" routerLinkActive="active">Cadastrar</a>
          </ng-container>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        background: #333;
        color: white;
        padding: 1rem 0;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
      }
      .logo a {
        color: white;
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .nav {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .nav a,
      .nav button {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background 0.3s;
      }
      .nav a:hover,
      .nav button:hover {
        background: #555;
      }
      .nav a.active {
        background: #555;
      }
      button {
        background: #dc3545;
        border: none;
        cursor: pointer;
      }
    `,
  ],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
