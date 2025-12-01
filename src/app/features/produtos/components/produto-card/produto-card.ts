import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../../../core/models/produto';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './produto-card.html',
  styleUrl: './produto-card.css',
})
export class ProdutoCardComponent {
  @Input() produto!: Produto;
  @Output() adicionarCarrinho = new EventEmitter<Produto>();

  onAdicionarCarrinho(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.adicionarCarrinho.emit(this.produto);
  }

  getImagemProduto(): string {
    if (this.produto.imagens && this.produto.imagens.length > 0) {
      return this.produto.imagens[0];
    }
    return 'assets/images/produto-placeholder.png';
  }

  isPromocao(): boolean {
    return !!(this.produto.precoPromocional && this.produto.precoPromocional < this.produto.preco);
  }

  getDesconto(): number {
    if (this.isPromocao() && this.produto.precoPromocional) {
      const desconto = ((this.produto.preco - this.produto.precoPromocional) / this.produto.preco) * 100;
      return Math.round(desconto);
    }
    return 0;
  }

  isDisponivel(): boolean {
    return this.produto.estoque > 0 && this.produto.ativo;
  }
}
