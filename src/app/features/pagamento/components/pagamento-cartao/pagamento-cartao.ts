import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pagamento-cartao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="cartao-container">
      <h3>Pagamento com Cartão de Crédito</h3>

      <form [formGroup]="cartaoForm" (ngSubmit)="processar()">
        <div class="form-group">
          <label>Número do Cartão</label>
          <input
            type="text"
            formControlName="numeroCartao"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
          />
        </div>

        <div class="form-group">
          <label>Nome no Cartão</label>
          <input
            type="text"
            formControlName="nomeCartao"
            placeholder="Como está impresso no cartão"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Validade</label>
            <input type="text" formControlName="validade" placeholder="MM/AA" maxlength="5" />
          </div>

          <div class="form-group">
            <label>CVV</label>
            <input type="text" formControlName="cvv" placeholder="000" maxlength="3" />
          </div>
        </div>

        <div class="form-group">
          <label>Parcelas</label>
          <select formControlName="parcelas">
            <option value="1">1x sem juros</option>
            <option value="2">2x sem juros</option>
            <option value="3">3x sem juros</option>
            <option value="6">6x com juros</option>
            <option value="12">12x com juros</option>
          </select>
        </div>

        <button type="submit" [disabled]="cartaoForm.invalid || loading">
          {{ loading ? 'Processando...' : 'Confirmar Pagamento' }}
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .cartao-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      h3 {
        margin-bottom: 1.5rem;
      }
      .form-group {
        margin-bottom: 1.5rem;
      }
      .form-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }
      input,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }
      input:focus,
      select:focus {
        outline: none;
        border-color: #667eea;
      }
      button {
        width: 100%;
        padding: 1rem;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover:not(:disabled) {
        background: #218838;
      }
      button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    `,
  ],
})
export class PagamentoCartaoComponent {
  private fb = inject(FormBuilder);
  @Output() pagamentoRealizado = new EventEmitter<number>();

  cartaoForm: FormGroup;
  loading: boolean = false;

  constructor() {
    this.cartaoForm = this.fb.group({
      numeroCartao: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nomeCartao: ['', Validators.required],
      validade: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      parcelas: ['1', Validators.required],
    });
  }

  processar(): void {
    if (this.cartaoForm.valid) {
      this.loading = true;

      setTimeout(() => {
        alert('Pagamento aprovado!');
        this.loading = false;
        this.pagamentoRealizado.emit(1);
      }, 2000);
    }
  }
}
