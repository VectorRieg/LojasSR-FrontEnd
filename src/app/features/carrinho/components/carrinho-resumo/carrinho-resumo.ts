import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Carrinho } from '../../../../core/models/carrinho';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-carrinho-resumo',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="resumo-card">
      <h2>Resumo do Pedido</h2>

      <div class="resumo-linha">
        <span>Subtotal ({{ totalItens }} itens)</span>
        <span class="valor">{{ subtotal | customCurrency }}</span>
      </div>

      <div class="resumo-linha">
        <span>Frete</span>
        <span class="valor">{{ frete | customCurrency }}</span>
      </div>

      <div class="resumo-linha desconto" *ngIf="desconto > 0">
        <span>Desconto</span>
        <span class="valor">-{{ desconto | customCurrency }}</span>
      </div>

      <hr />

      <div class="resumo-linha total">
        <span>Total</span>
        <span class="valor">{{ total | customCurrency }}</span>
      </div>

      <button class="btn-finalizar" (click)="onFinalizarCompra()">Finalizar Compra</button>

      <button class="btn-continuar" routerLink="/produtos">Continuar Comprando</button>

      <div class="info-seguranca">
        <p>Compra 100% segura</p>
        <p>Entrega garantida</p>
      </div>
    </div>
  `,
  styles: [
    `
      .resumo-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1.5rem;
        position: sticky;
        top: 20px;
      }
      h2 {
        font-size: 1.3rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #667eea;
        padding-bottom: 0.5rem;
      }
      .resumo-linha {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-size: 0.95rem;
      }
      .resumo-linha.desconto {
        color: #28a745;
      }
      .resumo-linha.total {
        font-size: 1.3rem;
        font-weight: bold;
        margin-top: 1rem;
      }
      .resumo-linha.total .valor {
        color: #28a745;
      }
      hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 1rem 0;
      }
      button {
        width: 100%;
        padding: 1rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 0.75rem;
      }
      .btn-finalizar {
        background: #28a745;
        color: white;
      }
      .btn-finalizar:hover {
        background: #218838;
        transform: translateY(-2px);
      }
      .btn-continuar {
        background: #6c757d;
        color: white;
      }
      .btn-continuar:hover {
        background: #5a6268;
      }
      .info-seguranca {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #ddd;
        text-align: center;
      }
      .info-seguranca p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: #666;
      }
    `,
  ],
})
export class CarrinhoResumoComponent {
  @Input() carrinho!: Carrinho;
  @Output() finalizarCompra = new EventEmitter<void>();

  get totalItens(): number {
    return this.carrinho?.itens.reduce((acc, item) => acc + item.quantidade, 0) || 0;
  }

  get subtotal(): number {
    return (
      this.carrinho?.itens.reduce((acc, item) => acc + item.precoUnitario * item.quantidade, 0) || 0
    );
  }

  get frete(): number {
    // Lógica de cálculo de frete
    return this.subtotal > 500 ? 0 : 30;
  }

  get desconto(): number {
    // Lógica de desconto
    return 0;
  }

  get total(): number {
    return this.subtotal + this.frete - this.desconto;
  }

  onFinalizarCompra(): void {
    this.finalizarCompra.emit();
  }
}
