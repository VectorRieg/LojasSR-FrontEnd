import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagamento-confirmacao',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmacao-container">
      <div class="confirmacao-card">
        <div class="sucesso-icon">✓</div>

        <h1>Pagamento Confirmado!</h1>
        <p class="mensagem">Seu pedido foi realizado com sucesso</p>

        <div class="pedido-info">
          <p><strong>Número do Pedido:</strong> #{{ pedidoId }}</p>
          <p><strong>Data:</strong> {{ dataAtual }}</p>
        </div>

        <div class="proximos-passos">
          <h3>Próximos Passos:</h3>
          <ol>
            <li>Você receberá um email com os detalhes do pedido</li>
            <li>Acompanhe o status na página "Meus Pedidos"</li>
            <li>O prazo de entrega é de 5-7 dias úteis</li>
          </ol>
        </div>

        <div class="acoes">
          <button routerLink="/perfil/pedidos" class="btn-pedidos">Ver Meus Pedidos</button>
          <button routerLink="/produtos" class="btn-continuar">Continuar Comprando</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .confirmacao-container {
        min-height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
      .confirmacao-card {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 600px;
        width: 100%;
      }
      .sucesso-icon {
        width: 80px;
        height: 80px;
        background: #28a745;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        margin: 0 auto 2rem;
      }
      h1 {
        color: #28a745;
        margin-bottom: 0.5rem;
      }
      .mensagem {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
      .pedido-info {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: left;
      }
      .pedido-info p {
        margin: 0.5rem 0;
      }
      .proximos-passos {
        text-align: left;
        margin-bottom: 2rem;
      }
      .proximos-passos h3 {
        margin-bottom: 1rem;
      }
      .proximos-passos ol {
        padding-left: 1.5rem;
      }
      .proximos-passos li {
        margin-bottom: 0.75rem;
        line-height: 1.6;
      }
      .acoes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 2rem;
      }
      .acoes button {
        padding: 1rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }
      .btn-pedidos {
        background: #667eea;
        color: white;
      }
      .btn-pedidos:hover {
        background: #5568d3;
      }
      .btn-continuar {
        background: #28a745;
        color: white;
      }
      .btn-continuar:hover {
        background: #218838;
      }
    `,
  ],
})
export class PagamentoConfirmacaoComponent implements OnInit {
  private route = inject(ActivatedRoute);

  pedidoId: string = '';

  get dataAtual(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') || '12345';
  }
}
