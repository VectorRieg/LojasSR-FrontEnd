import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho';
import { AuthService } from '../../../../core/services/auth';
import { Carrinho } from '../../../../core/models/carrinho';
import { CarrinhoItemComponent } from '../carrinho-item/carrinho-item';
import { CarrinhoResumoComponent } from '../carrinho-resumo/carrinho-resumo';

@Component({
  selector: 'app-carrinho-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, CarrinhoItemComponent, CarrinhoResumoComponent],
  template: `
    <div class="carrinho-container">
      <h1>Meu Carrinho</h1>

      <div *ngIf="loading" class="loading">
        <p>Carregando carrinho...</p>
      </div>

      <div *ngIf="!loading && carrinho" class="carrinho-content">
        <div *ngIf="carrinho.itens.length === 0" class="carrinho-vazio">
          <p>Seu carrinho está vazio</p>
          <button routerLink="/produtos" class="btn-continuar">Continuar Comprando</button>
        </div>

        <div *ngIf="carrinho.itens.length > 0" class="carrinho-grid">
          <div class="itens-lista">
            <app-carrinho-item
              *ngFor="let item of carrinho.itens"
              [item]="item"
              (quantidadeAlterada)="onQuantidadeAlterada($event)"
              (itemRemovido)="onItemRemovido($event)"
            >
            </app-carrinho-item>

            <div class="acoes-carrinho">
              <button (click)="limparCarrinho()" class="btn-limpar">Limpar Carrinho</button>
              <button routerLink="/produtos" class="btn-continuar">Continuar Comprando</button>
            </div>
          </div>

          <div class="resumo-container">
            <app-carrinho-resumo [carrinho]="carrinho" (finalizarCompra)="finalizarCompra()">
            </app-carrinho-resumo>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .carrinho-container {
        padding: 2rem 0;
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        margin-bottom: 2rem;
        font-size: 2rem;
      }
      .loading {
        text-align: center;
        padding: 3rem;
      }
      .carrinho-vazio {
        text-align: center;
        padding: 3rem;
        background: #f8f9fa;
        border-radius: 8px;
      }
      .carrinho-vazio p {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 1.5rem;
      }
      .carrinho-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
      }
      .itens-lista {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .acoes-carrinho {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }
      .btn-limpar {
        background: #dc3545;
        color: white;
      }
      .btn-limpar:hover {
        background: #c82333;
      }
      .btn-continuar {
        background: #6c757d;
        color: white;
      }
      .btn-continuar:hover {
        background: #5a6268;
      }
      @media (max-width: 768px) {
        .carrinho-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CarrinhoListaComponent implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private authService = inject(AuthService);

  carrinho: Carrinho | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    const usuario = this.authService.getUsuario();
    if (usuario?.userId) {
      this.carrinhoService.buscarCarrinho(usuario.userId).subscribe({
        next: (carrinho) => {
          this.carrinho = carrinho;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar carrinho:', error);
          this.loading = false;
        },
      });
    }
  }

  onQuantidadeAlterada(event: { itemId: number; quantidade: number }): void {
    this.carrinhoService.atualizarQuantidade(event.itemId, event.quantidade).subscribe({
      next: () => {
        this.carregarCarrinho();
      },
      error: (error) => {
        console.error('Erro ao atualizar quantidade:', error);
      },
    });
  }

  onItemRemovido(itemId: number): void {
    if (confirm('Deseja realmente remover este item?')) {
      this.carrinhoService.removerItem(itemId).subscribe({
        next: () => {
          this.carregarCarrinho();
        },
        error: (error) => {
          console.error('Erro ao remover item:', error);
        },
      });
    }
  }

  limparCarrinho(): void {
    if (confirm('Deseja realmente limpar todo o carrinho?')) {
      if (this.carrinho?.id) {
        this.carrinhoService.limparCarrinho(this.carrinho.id).subscribe({
          next: () => {
            this.carregarCarrinho();
          },
          error: (error) => {
            console.error('Erro ao limpar carrinho:', error);
          },
        });
      }
    }
  }

  finalizarCompra(): void {
    console.log('Finalizar compra');
    // Navegar para página de pagamento
  }
}
