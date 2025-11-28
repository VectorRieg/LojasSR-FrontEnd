import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item } from '../../../../core/models/item';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-carrinho-item',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="item-card">
      <div class="item-imagem">
        <img
          [src]="item.produto.imagemPrincipal || 'assets/placeholder.jpg'"
          [alt]="item.produto.nome"
        />
      </div>

      <div class="item-info">
        <h3>{{ item.produto.nome }}</h3>
        <p class="item-preco">{{ item.precoUnitario | customCurrency }}</p>
      </div>

      <div class="item-quantidade">
        <label>Quantidade:</label>
        <div class="quantidade-controle">
          <button (click)="diminuirQuantidade()" [disabled]="item.quantidade <= 1">-</button>
          <input
            type="number"
            [(ngModel)]="item.quantidade"
            (change)="atualizarQuantidade()"
            min="1"
            [max]="item.produto.estoque"
          />
          <button
            (click)="aumentarQuantidade()"
            [disabled]="item.quantidade >= item.produto.estoque"
          >
            +
          </button>
        </div>
      </div>

      <div class="item-subtotal">
        <p>Subtotal</p>
        <p class="valor">{{ calcularSubtotal() | customCurrency }}</p>
      </div>

      <div class="item-acoes">
        <button (click)="remover()" class="btn-remover" title="Remover item">🗑️</button>
      </div>
    </div>
  `,
  styles: [
    `
      .item-card {
        display: grid;
        grid-template-columns: 100px 1fr auto auto auto;
        gap: 1.5rem;
        align-items: center;
        padding: 1.5rem;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        transition: box-shadow 0.3s;
      }
      .item-card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .item-imagem img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 4px;
      }
      .item-info h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      .item-preco {
        color: #666;
        font-size: 0.9rem;
      }
      .item-quantidade label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: #666;
      }
      .quantidade-controle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .quantidade-controle button {
        width: 32px;
        height: 32px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .quantidade-controle button:hover:not(:disabled) {
        background: #f0f0f0;
      }
      .quantidade-controle button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .quantidade-controle input {
        width: 60px;
        padding: 0.5rem;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .item-subtotal {
        text-align: right;
      }
      .item-subtotal p {
        margin: 0;
      }
      .item-subtotal .valor {
        font-size: 1.3rem;
        font-weight: bold;
        color: #28a745;
        margin-top: 0.25rem;
      }
      .btn-remover {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: background 0.3s;
      }
      .btn-remover:hover {
        background: #c82333;
      }
      @media (max-width: 768px) {
        .item-card {
          grid-template-columns: 1fr;
          text-align: center;
        }
      }
    `,
  ],
})
export class CarrinhoItemComponent {
  @Input() item!: Item;
  @Output() quantidadeAlterada = new EventEmitter<{ itemId: number; quantidade: number }>();
  @Output() itemRemovido = new EventEmitter<number>();

  calcularSubtotal(): number {
    return this.item.precoUnitario * this.item.quantidade;
  }

  aumentarQuantidade(): void {
    if (this.item.quantidade < this.item.produto.estoque) {
      this.item.quantidade++;
      this.atualizarQuantidade();
    }
  }

  diminuirQuantidade(): void {
    if (this.item.quantidade > 1) {
      this.item.quantidade--;
      this.atualizarQuantidade();
    }
  }

  atualizarQuantidade(): void {
    if (this.item.id) {
      this.quantidadeAlterada.emit({
        itemId: this.item.id,
        quantidade: this.item.quantidade,
      });
    }
  }

  remover(): void {
    if (this.item.id) {
      this.itemRemovido.emit(this.item.id);
    }
  }
}
