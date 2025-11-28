import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="registro-container">
      <h2>Criar Conta</h2>

      <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" formControlName="nome" placeholder="Seu nome completo" />
          <div
            *ngIf="registroForm.get('nome')?.invalid && registroForm.get('nome')?.touched"
            class="error"
          >
            Nome é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="seu@email.com" />
          <div
            *ngIf="registroForm.get('email')?.invalid && registroForm.get('email')?.touched"
            class="error"
          >
            Email válido é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label>CPF</label>
          <input type="text" formControlName="cpf" placeholder="000.000.000-00" />
        </div>

        <div class="form-group">
          <label>Telefone</label>
          <input type="text" formControlName="telefone" placeholder="(00) 00000-0000" />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input type="password" formControlName="senha" placeholder="Mínimo 6 caracteres" />
          <div
            *ngIf="registroForm.get('senha')?.invalid && registroForm.get('senha')?.touched"
            class="error"
          >
            Senha deve ter no mínimo 6 caracteres
          </div>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" [disabled]="registroForm.invalid || loading">
          {{ loading ? 'Criando conta...' : 'Criar Conta' }}
        </button>

        <p class="login-link">Já tem conta? <a routerLink="/auth/login">Faça login</a></p>
      </form>
    </div>
  `,
  styles: [
    `
      .registro-container {
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
      .login-link {
        text-align: center;
        margin-top: 1rem;
        color: #666;
      }
      .login-link a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }
    `,
  ],
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registroForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor() {
    this.registroForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      telefone: [''],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      this.authService.registrar(this.registroForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erro ao criar conta';
          console.error('Erro no registro:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
