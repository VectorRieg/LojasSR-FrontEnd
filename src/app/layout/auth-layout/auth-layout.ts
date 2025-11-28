import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-container">
        <div class="auth-logo">
          <h1>Lojas SR</h1>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .auth-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 400px;
      }
      .auth-logo {
        text-align: center;
        margin-bottom: 2rem;
      }
      .auth-logo h1 {
        color: #667eea;
        margin: 0;
      }
    `,
  ],
})
export class AuthLayoutComponent {}
