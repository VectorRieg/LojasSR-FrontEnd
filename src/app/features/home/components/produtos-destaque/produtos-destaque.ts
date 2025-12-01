import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProdutoService } from '../../../produtos/services/produto';
import { CarrinhoService } from '../../../carrinho/services/carrinho';
import { Produto } from '../../../../core/models/produto';
import { ProdutoCardComponent } from '../../../produtos/components/produto-card/produto-card';

@Component({
  selector: 'app-produtos-destaque',
  standalone: true,
  imports: [CommonModule, ProdutoCardComponent],
  templateUrl: './produtos-destaque.html',
  styleUrl: './produtos-destaque.css',
})
export class ProdutosDestaqueComponent implements OnInit {
  private produtoService = inject(ProdutoService);
  private carrinhoService = inject(CarrinhoService);
  private router = inject(Router);

  produtosDestaque: Produto[] = [];
  carregando = false;
  erro = '';

  ngOnInit(): void {
    this.carregarProdutosDestaque();
  }

  carregarProdutosDestaque(): void {
    this.carregando = true;
    this.produtoService.listar({ limite: 8, apenasPromocao: true }).subscribe({
      next: (produtos) => {
        this.produtosDestaque = produtos;
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar produtos em destaque';
        this.carregando = false;
      },
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarItem(produto, 1);
  }

  verTodosProdutos(): void {
    this.router.navigate(['/produtos']);
  }
}
