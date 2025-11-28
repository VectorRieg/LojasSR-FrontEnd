import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { CarrinhoService } from '../../../carrinho/services/carrinho';
import { Produto } from '../../../../core/models/produto';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="produto-detalhe" *ngIf="produto">
      <div class="produto-imagem">
        <img [src]="produto.imagemPrincipal || 'assets/placeholder.jpg'" [alt]="produto.nome" />
      </div>

      <div class="produto-info">
        <h1>{{ produto.nome }}</h1>
        <p class="descricao">{{ produto.descricao }}</p>

        <div class="preco">
          <span class="preco-atual">{{ produto.preco | customCurrency }}</span>
          <span *ngIf="produto.precoPromocional" class="preco-antigo">
            {{ produto.precoPromocional | customCurrency }}
          </span>
        </div>

        <div class="estoque">
          <span *ngIf="produto.estoque > 0" class="disponivel">
            Em estoque ({{ produto.estoque }} unidades)
          </span>
          <span *ngIf="produto.estoque === 0" class="indisponivel"> Produto esgotado </span>
        </div>

        <div class="acoes">
          <button
            class="btn-comprar"
            [disabled]="produto.estoque === 0"
            (click)="adicionarAoCarrinho()"
          >
            Adicionar ao Carrinho
          </button>
          <button class="btn-voltar" (click)="voltar()">Voltar</button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading">Carregando...</div>
  `,
  styles: [
    `
      .produto-detalhe {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        padding: 2rem 0;
      }
      .produto-imagem img {
        width: 100%;
        border-radius: 8px;
      }
      .produto-info h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .descricao {
        color: #666;
        line-height: 1.6;
        margin-bottom: 2rem;
      }
      .preco {
        margin: 2rem 0;
      }
      .preco-atual {
        font-size: 2.5rem;
        color: #28a745;
        font-weight: bold;
      }
      .preco-antigo {
        font-size: 1.5rem;
        color: #999;
        text-decoration: line-through;
        margin-left: 1rem;
      }
      .estoque {
        margin: 1rem 0;
      }
      .disponivel {
        color: #28a745;
        font-weight: 500;
      }
      .indisponivel {
        color: #dc3545;
        font-weight: 500;
      }
      .acoes {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
      button {
        padding: 1rem 2rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }
      .btn-comprar {
        background: #28a745;
        color: white;
        flex: 1;
      }
      .btn-comprar:hover:not(:disabled) {
        background: #218838;
      }
      .btn-comprar:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      .btn-voltar {
        background: #6c757d;
        color: white;
      }
      .btn-voltar:hover {
        background: #5a6268;
      }
      .loading {
        text-align: center;
        padding: 3rem;
      }
      @media (max-width: 768px) {
        .produto-detalhe {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProdutoDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private produtoService = inject(ProdutoService);
  private carrinhoService = inject(CarrinhoService);

  produto?: Produto;
  loading: boolean = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(+id);
    }
  }

  carregarProduto(id: number): void {
    this.produtoService.buscarPorId(id).subscribe({
      next: (produto) => {
        this.produto = produto;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto:', error);
        this.loading = false;
        this.router.navigate(['/produtos']);
      },
    });
  }

  adicionarAoCarrinho(): void {
    if (this.produto) {
      this.carrinhoService.adicionarItem(this.produto, 1);
    }
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }
}
