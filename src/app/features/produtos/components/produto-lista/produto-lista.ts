import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { Produto } from '../../../../core/models/produto';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-produto-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="produtos-lista">
      <h1>Produtos</h1>

      <div class="produtos-grid">
        <div *ngFor="let produto of produtos" class="produto-card">
          <img [src]="produto.imagemPrincipal || 'assets/placeholder.jpg'" [alt]="produto.nome" />
          <h3>{{ produto.nome }}</h3>
          <p class="preco">{{ produto.preco | customCurrency }}</p>
          <button [routerLink]="['/produtos', produto.id]">Ver Detalhes</button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Carregando produtos...</div>
      <div *ngIf="!loading && produtos.length === 0" class="empty">Nenhum produto encontrado</div>
    </div>
  `,
  styles: [
    `
      .produtos-lista {
        padding: 2rem 0;
      }
      h1 {
        margin-bottom: 2rem;
      }
      .produtos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 2rem;
      }
      .produto-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        transition: transform 0.3s;
      }
      .produto-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      .produto-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
      .produto-card h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      .preco {
        font-size: 1.5rem;
        color: #28a745;
        font-weight: bold;
        margin: 1rem 0;
      }
      button {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
      }
      button:hover {
        background: #5568d3;
      }
      .loading,
      .empty {
        text-align: center;
        padding: 3rem;
        color: #666;
      }
    `,
  ],
})
export class ProdutoListaComponent implements OnInit {
  private produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listarTodos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.loading = false;
      },
    });
  }
}
