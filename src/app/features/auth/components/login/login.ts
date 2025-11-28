import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="seu@email.com" />
          <div
            *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            class="error"
          >
            Email é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input type="password" formControlName="senha" placeholder="Sua senha" />
          <div
            *ngIf="loginForm.get('senha')?.invalid && loginForm.get('senha')?.touched"
            class="error"
          >
            Senha é obrigatória
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" [disabled]="loginForm.invalid || loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="register-link">Não tem conta? <a routerLink="/auth/registro">Cadastre-se</a></p>
      </form>
    </div>
  `,
  styles: [
    `
      .login-container {
        width: 100%;
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #555;
        font-weight: 500;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      input:focus {
        outline: none;
        border-color: #667eea;
      }
      .error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
      .error-message {
        background: #f8d7da;
        color: #721c24;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover:not(:disabled) {
        background: #5568d3;
      }
      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .register-link {
        text-align: center;
        margin-top: 1rem;
        color: #666;
      }
      .register-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Email ou senha incorretos';
          console.error('Erro no login:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
