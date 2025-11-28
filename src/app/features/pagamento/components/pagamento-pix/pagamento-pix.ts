import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagamentoService } from '../../services/pagamento';
import { CarrinhoService } from '../../../carrinho/services/carrinho';
import { MetodoPagamento, StatusPagamento } from '../../../../core/models/pagamento';

@Component({
  selector: 'app-pagamento-pix',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pix-container">
      <h3>Pagamento via PIX</h3>

      <div class="pix-info">
        <p>Escaneie o QR Code ou copie o código PIX</p>
      </div>

      <div class="qrcode">
        <div class="qrcode-placeholder">
          <p>QR CODE</p>
        </div>
      </div>

      <div class="codigo-pix">
        <input type="text" value="00020126580014br.gov.bcb.pix..." readonly />
        <button (click)="copiarCodigo()">Copiar Código</button>
      </div>

      <div class="instrucoes">
        <h4>Como pagar:</h4>
        <ol>
          <li>Abra o app do seu banco</li>
          <li>Escolha pagar com PIX</li>
          <li>Escaneie o QR Code ou cole o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>

      <button class="btn-simular" (click)="simularPagamento()">Simular Pagamento (Teste)</button>
    </div>
  `,
  styles: [
    `
      .pix-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      h3 {
        margin-bottom: 1.5rem;
        color: #32bcad;
      }
      .pix-info {
        text-align: center;
        margin-bottom: 2rem;
        color: #666;
      }
      .qrcode {
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
      }
      .qrcode-placeholder {
        width: 250px;
        height: 250px;
        border: 2px dashed #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: #f8f9fa;
      }
      .codigo-pix {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .codigo-pix input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
      }
      .codigo-pix button {
        padding: 0.75rem 1.5rem;
        background: #32bcad;
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
      .instrucoes ol {
        margin: 0;
        padding-left: 1.5rem;
      }
      .instrucoes li {
        margin-bottom: 0.5rem;
      }
      .btn-simular {
        width: 100%;
        padding: 1rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
      }
      .btn-simular:hover {
        background: #5568d3;
      }
    `,
  ],
})
export class PagamentoPixComponent implements OnInit {
  private pagamentoService = inject(PagamentoService);
  private carrinhoService = inject(CarrinhoService);
  @Output() pagamentoRealizado = new EventEmitter<number>();

  codigoPix = '00020126580014br.gov.bcb.pix...';
  loading = false;
  mensagemErro = '';

  ngOnInit(): void {
    this.gerarCodigoPix();
  }

  gerarCodigoPix(): void {
    const carrinho = this.carrinhoService.obterCarrinho();

    const pagamento = {
      metodo: MetodoPagamento.PIX,
      status: StatusPagamento.PENDENTE,
      valor: carrinho.valorTotal,
    };

    this.pagamentoService.criar(pagamento).subscribe({
      next: (pagamentoCriado) => {
        if (pagamentoCriado.codigoPix) {
          this.codigoPix = pagamentoCriado.codigoPix;
        }
      },
      error: (erro) => {
        this.mensagemErro = 'Erro ao gerar código PIX';
      },
    });
  }

  copiarCodigo(): void {
    navigator.clipboard.writeText(this.codigoPix);
  }

  simularPagamento(): void {
    this.loading = true;
    this.mensagemErro = '';

    const carrinho = this.carrinhoService.obterCarrinho();

    const pagamento = {
      metodo: MetodoPagamento.PIX,
      status: StatusPagamento.PENDENTE,
      valor: carrinho.valorTotal,
      codigoPix: this.codigoPix,
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
              this.mensagemErro = 'Erro ao processar pagamento PIX';
            },
          });
        }
      },
      error: (erro) => {
        this.loading = false;
        this.mensagemErro = 'Erro ao criar pagamento PIX';
      },
    });
  }
}
