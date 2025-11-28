import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../services/perfil';
import { Pedido, StatusPedido } from '../../../../core/models/pedido';
import { DateFormatPipe } from '../../../../shared/pipes/date-format-pipe';
import { CurrencyPipe } from '../../../../shared/pipes/currency-pipe';

@Component({
  selector: 'app-perfil-pedidos',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, CurrencyPipe],
  templateUrl: './perfil-pedidos.html',
  styleUrl: './perfil-pedidos.css',
})
export class PerfilPedidosComponent implements OnInit {
  private perfilService = inject(PerfilService);

  pedidos: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;
  carregando = false;
  mensagem = '';
  mensagemTipo: 'sucesso' | 'erro' = 'sucesso';
  StatusPedido = StatusPedido;

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.perfilService.getPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.carregando = false;
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao carregar pedidos', 'erro');
        this.carregando = false;
      },
    });
  }

  verDetalhes(pedido: Pedido): void {
    if (pedido.id) {
      this.carregando = true;
      this.perfilService.getPedido(pedido.id).subscribe({
        next: (pedidoCompleto) => {
          this.pedidoSelecionado = pedidoCompleto;
          this.carregando = false;
        },
        error: (erro) => {
          this.mostrarMensagem('Erro ao carregar detalhes do pedido', 'erro');
          this.carregando = false;
        },
      });
    }
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado = null;
  }

  cancelarPedido(pedido: Pedido): void {
    if (!pedido.id) return;

    if (pedido.status !== StatusPedido.AGUARDANDO_PAGAMENTO &&
        pedido.status !== StatusPedido.PAGAMENTO_CONFIRMADO) {
      this.mostrarMensagem('Este pedido não pode ser cancelado', 'erro');
      return;
    }

    if (!confirm('Deseja realmente cancelar este pedido?')) {
      return;
    }

    this.carregando = true;
    this.perfilService.cancelarPedido(pedido.id).subscribe({
      next: () => {
        this.mostrarMensagem('Pedido cancelado com sucesso!', 'sucesso');
        this.carregarPedidos();
        this.fecharDetalhes();
      },
      error: (erro) => {
        this.mostrarMensagem('Erro ao cancelar pedido', 'erro');
        this.carregando = false;
      },
    });
  }

  getStatusClass(status: StatusPedido): string {
    switch (status) {
      case StatusPedido.AGUARDANDO_PAGAMENTO:
        return 'status-aguardando';
      case StatusPedido.PAGAMENTO_CONFIRMADO:
        return 'status-confirmado';
      case StatusPedido.EM_SEPARACAO:
        return 'status-separacao';
      case StatusPedido.ENVIADO:
        return 'status-enviado';
      case StatusPedido.ENTREGUE:
        return 'status-entregue';
      case StatusPedido.CANCELADO:
        return 'status-cancelado';
      default:
        return '';
    }
  }

  getStatusTexto(status: StatusPedido): string {
    switch (status) {
      case StatusPedido.AGUARDANDO_PAGAMENTO:
        return 'Aguardando Pagamento';
      case StatusPedido.PAGAMENTO_CONFIRMADO:
        return 'Pagamento Confirmado';
      case StatusPedido.EM_SEPARACAO:
        return 'Em Separação';
      case StatusPedido.ENVIADO:
        return 'Enviado';
      case StatusPedido.ENTREGUE:
        return 'Entregue';
      case StatusPedido.CANCELADO:
        return 'Cancelado';
      default:
        return status;
    }
  }

  podeCancelar(pedido: Pedido): boolean {
    return pedido.status === StatusPedido.AGUARDANDO_PAGAMENTO ||
           pedido.status === StatusPedido.PAGAMENTO_CONFIRMADO;
  }

  mostrarMensagem(texto: string, tipo: 'sucesso' | 'erro'): void {
    this.mensagem = texto;
    this.mensagemTipo = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 5000);
  }
}
