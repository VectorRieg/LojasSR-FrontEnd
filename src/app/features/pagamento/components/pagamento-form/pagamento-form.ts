import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagamentoPixComponent } from '../pagamento-pix/pagamento-pix';
import { PagamentoCartaoComponent } from '../pagamento-cartao/pagamento-cartao';
import { PagamentoBoletoComponent } from '../pagamento-boleto/pagamento-boleto';

@Component({
  selector: 'app-pagamento-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PagamentoPixComponent,
    PagamentoCartaoComponent,
    PagamentoBoletoComponent,
  ],
  template: `
    <div class="pagamento-container">
      <h1>Finalizar Pagamento</h1>

      <div class="pagamento-grid">
        <div class="metodos-pagamento">
          <h2>Escolha o método de pagamento</h2>

          <div
            class="metodo-card"
            [class.selected]="metodoSelecionado === 'PIX'"
            (click)="selecionarMetodo('PIX')"
          >
            <input type="radio" name="metodo" [checked]="metodoSelecionado === 'PIX'" />
            <div class="metodo-info">
              <h3>PIX</h3>
              <p>Pagamento instantâneo</p>
            </div>
          </div>

          <div
            class="metodo-card"
            [class.selected]="metodoSelecionado === 'CARTAO_CREDITO'"
            (click)="selecionarMetodo('CARTAO_CREDITO')"
          >
            <input type="radio" name="metodo" [checked]="metodoSelecionado === 'CARTAO_CREDITO'" />
            <div class="metodo-info">
              <h3>Cartão de Crédito</h3>
              <p>Parcele em até 12x</p>
            </div>
          </div>

          <div
            class="metodo-card"
            [class.selected]="metodoSelecionado === 'BOLETO'"
            (click)="selecionarMetodo('BOLETO')"
          >
            <input type="radio" name="metodo" [checked]="metodoSelecionado === 'BOLETO'" />
            <div class="metodo-info">
              <h3>Boleto Bancário</h3>
              <p>Vencimento em 3 dias</p>
            </div>
          </div>
        </div>

        <div class="form-pagamento">
          <app-pagamento-pix
            *ngIf="metodoSelecionado === 'PIX'"
            (pagamentoRealizado)="onPagamentoRealizado($event)"
          >
          </app-pagamento-pix>

          <app-pagamento-cartao
            *ngIf="metodoSelecionado === 'CARTAO_CREDITO'"
            (pagamentoRealizado)="onPagamentoRealizado($event)"
          >
          </app-pagamento-cartao>

          <app-pagamento-boleto
            *ngIf="metodoSelecionado === 'BOLETO'"
            (pagamentoRealizado)="onPagamentoRealizado($event)"
          >
          </app-pagamento-boleto>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .pagamento-container {
        padding: 2rem 0;
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        margin-bottom: 2rem;
        font-size: 2rem;
      }
      .pagamento-grid {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 2rem;
      }
      h2 {
        font-size: 1.3rem;
        margin-bottom: 1.5rem;
      }
      .metodo-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        margin-bottom: 1rem;
        cursor: pointer;
        transition: all 0.3s;
      }
      .metodo-card:hover {
        border-color: #667eea;
        background: #f8f9ff;
      }
      .metodo-card.selected {
        border-color: #667eea;
        background: #f8f9ff;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
      }
      .metodo-card input[type='radio'] {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
      .metodo-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
      }
      .metodo-info p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }
      @media (max-width: 768px) {
        .pagamento-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PagamentoFormComponent {
  metodoSelecionado: string = 'PIX';

  selecionarMetodo(metodo: string): void {
    this.metodoSelecionado = metodo;
  }

  onPagamentoRealizado(pagamentoId: number): void {
    console.log('Pagamento realizado:', pagamentoId);
    // Navegar para confirmação
  }
}
