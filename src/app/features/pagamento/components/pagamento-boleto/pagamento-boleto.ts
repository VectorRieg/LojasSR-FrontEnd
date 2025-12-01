import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagamentoService } from '../../services/pagamento';
import { CarrinhoService } from '../../../carrinho/services/carrinho';
import { MetodoPagamento, StatusPagamento } from '../../../../core/models/pagamento';

@Component({
  selector: 'app-pagamento-boleto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boleto-container">
      <h3>Pagamento via Boleto Bancário</h3>

      <div class="boleto-info">
        <p><strong>Vencimento:</strong> {{ dataVencimento }}</p>
        <p><strong>Valor:</strong> R$ 150,00</p>
      </div>

      <div class="codigo-barras">
        <label>Código de Barras:</label>
        <input
          type="text"
          value="34191.79001 01043.510047 91020.150008 1 84750000015000"
          readonly
        />
        <button (click)="copiarCodigo()">Copiar</button>
      </div>

      <div class="instrucoes">
        <h4>Instruções:</h4>
        <ul>
          <li>O boleto vence em 3 dias úteis</li>
          <li>Após o pagamento, pode levar até 2 dias úteis para compensação</li>
          <li>Você pode pagar em qualquer banco, lotérica ou internet banking</li>
        </ul>
      </div>

      <div class="acoes">
        <button class="btn-imprimir" (click)="imprimirBoleto()">🖨️ Imprimir Boleto</button>
        <button class="btn-simular" (click)="simularPagamento()">Simular Pagamento (Teste)</button>
      </div>
    </div>
  `,
  styles: [
    `
      .boleto-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      h3 {
        margin-bottom: 1.5rem;
        color: #ff6b35;
      }
      .boleto-info {
        background: #fff8e1;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
      }
      .boleto-info p {
        margin: 0.5rem 0;
      }
      .codigo-barras {
        margin-bottom: 2rem;
      }
      .codigo-barras label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      .codigo-barras input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
        margin-bottom: 0.5rem;
      }
      .codigo-barras button {
        padding: 0.5rem 1rem;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .instrucoes {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
      }
      .instrucoes h4 {
        margin-bottom: 1rem;
      }
      .instrucoes ul {
        margin: 0;
        padding-left: 1.5rem;
      }
      .instrucoes li {
        margin-bottom: 0.5rem;
      }
      .acoes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .acoes button {
        padding: 1rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
      }
      .btn-imprimir {
        background: #6c757d;
        color: white;
      }
      .btn-imprimir:hover {
        background: #5a6268;
      }
      .btn-simular {
        background: #667eea;
        color: white;
      }
      .btn-simular:hover {
        background: #5568d3;
      }
    `,
  ],
})
export class PagamentoBoletoComponent implements OnInit {
  private pagamentoService = inject(PagamentoService);
  private carrinhoService = inject(CarrinhoService);
  @Output() pagamentoRealizado = new EventEmitter<number>();

  codigoBarras = '34191.79001 01043.510047 91020.150008 1 84190026000';
  loading = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.gerarBoleto();
  }

  get dataVencimento(): string {
    const data = new Date();
    data.setDate(data.getDate() + 3);
    return data.toLocaleDateString('pt-BR');
  }

  gerarBoleto(): void {
    const carrinho = this.carrinhoService.obterCarrinho();
    const dataVenc = new Date();
    dataVenc.setDate(dataVenc.getDate() + 3);

    const pagamento = {
      metodo: MetodoPagamento.BOLETO,
      status: StatusPagamento.PENDENTE,
      valor: carrinho.valorTotal,
      dataVencimento: dataVenc,
    };

    this.pagamentoService.criar(pagamento).subscribe({
      next: (pagamentoCriado) => {
        if (pagamentoCriado.codigoBarras) {
          this.codigoBarras = pagamentoCriado.codigoBarras;
        }
      },
      error: (erro) => {
        this.mensagemErro = 'Erro ao gerar boleto';
      },
    });
  }

  copiarCodigo(): void {
    navigator.clipboard.writeText(this.codigoBarras);
  }

  imprimirBoleto(): void {
    window.print();
  }

  simularPagamento(): void {
    this.loading = true;
    this.mensagemErro = '';

    const carrinho = this.carrinhoService.obterCarrinho();
    const dataVenc = new Date();
    dataVenc.setDate(dataVenc.getDate() + 3);

    const pagamento = {
      metodo: MetodoPagamento.BOLETO,
      status: StatusPagamento.PENDENTE,
      valor: carrinho.valorTotal,
      codigoBarras: this.codigoBarras,
      dataVencimento: dataVenc,
    };

    this.pagamentoService.criar(pagamento).subscribe({
      next: (pagamentoCriado) => {
        if (pagamentoCriado.id) {
          this.pagamentoService.processar(pagamentoCriado.id).subscribe({
            next: (pagamentoProcessado) => {
              this.loading = false;
              if (pagamentoCriado.id) {
                this.pagamentoRealizado.emit(pagamentoCriado.id);
              }
            },
            error: (erro) => {
              this.loading = false;
              this.mensagemErro = 'Erro ao processar pagamento via Boleto';
            },
          });
        }
      },
      error: (erro) => {
        this.loading = false;
        this.mensagemErro = 'Erro ao criar pagamento via Boleto';
      },
    });
  }
}
