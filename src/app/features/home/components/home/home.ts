import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../../produtos/services/produto';
import { Produto } from '../../../../core/models/produto';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <div class="home">
      <section class="hero">
        <h1>Bem-vindo à Lojas SR</h1>
        <p>Os melhores produtos com os melhores preços</p>
        <button routerLink="/produtos">Ver Produtos</button>
      </section>

      <section class="destaques">
        <h2>Produtos em Destaque</h2>
        <div class="produtos-grid">
          <div *ngFor="let produto of produtosDestaque" class="produto-card">
            <img [src]="produto.imagemPrincipal || 'assets/placeholder.jpg'" [alt]="produto.nome" />
            <h3>{{ produto.nome }}</h3>
            <p class="preco">{{ produto.preco | customCurrency }}</p>
            <button [routerLink]="['/produtos', produto.id]">Ver Detalhes</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home {
        padding: 2rem 0;
      }
      .hero {
        text-align: center;
        padding: 4rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px;
        margin-bottom: 3rem;
      }
      .hero h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      .hero p {
        font-size: 1.5rem;
        margin-bottom: 2rem;
      }
      .hero button {
        background: white;
        color: #667eea;
        border: none;
        padding: 1rem 2rem;
        font-size: 1.1rem;
        font-weight: 500;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.3s;
      }
      .hero button:hover {
        transform: scale(1.05);
      }
      .destaques h2 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2rem;
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
    `,
  ],
})
export class HomeComponent implements OnInit {
  private produtoService = inject(ProdutoService);

  produtosDestaque: Produto[] = [];

  ngOnInit(): void {
    this.carregarDestaques();
  }

  carregarDestaques(): void {
    this.produtoService.listarDestaques().subscribe({
      next: (produtos) => {
        this.produtosDestaque = produtos.slice(0, 4);
      },
      error: (error) => {
        console.error('Erro ao carregar destaques:', error);
      },
    });
  }
}
