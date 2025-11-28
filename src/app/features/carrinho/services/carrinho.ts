import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Carrinho } from '../../../core/models/carrinho';
import { Item } from '../../../core/models/item';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carrinho`;
  private itensApiUrl = `${environment.apiUrl}/itens`;

  private carrinhoSubject = new BehaviorSubject<Carrinho | null>(null);
  public carrinho$ = this.carrinhoSubject.asObservable();

  buscarCarrinho(usuarioId: number): Observable<Carrinho> {
    return this.http
      .get<Carrinho>(`${this.apiUrl}/usuario/${usuarioId}`)
      .pipe(tap((carrinho) => this.carrinhoSubject.next(carrinho)));
  }

  adicionarItem(carrinhoId: number, produtoId: number, quantidade: number): Observable<Item> {
    return this.http
      .post<Item>(this.itensApiUrl, {
        carrinhoId,
        produtoId,
        quantidade,
      })
      .pipe(tap(() => this.atualizarCarrinho(carrinhoId)));
  }

  atualizarQuantidade(itemId: number, quantidade: number): Observable<Item> {
    return this.http.put<Item>(`${this.itensApiUrl}/${itemId}`, { quantidade }).pipe(
      tap(() => {
        const carrinho = this.carrinhoSubject.value;
        if (carrinho) {
          this.atualizarCarrinho(carrinho.id!);
        }
      })
    );
  }

  removerItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.itensApiUrl}/${itemId}`).pipe(
      tap(() => {
        const carrinho = this.carrinhoSubject.value;
        if (carrinho) {
          this.atualizarCarrinho(carrinho.id!);
        }
      })
    );
  }

  calcularTotal(carrinhoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${carrinhoId}/total`);
  }

  limparCarrinho(carrinhoId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${carrinhoId}/limpar`)
      .pipe(tap(() => this.atualizarCarrinho(carrinhoId)));
  }

  private atualizarCarrinho(carrinhoId: number): void {
    this.http.get<Carrinho>(`${this.apiUrl}/${carrinhoId}`).subscribe({
      next: (carrinho) => this.carrinhoSubject.next(carrinho),
      error: (error) => console.error('Erro ao atualizar carrinho:', error),
    });
  }

  getCarrinhoAtual(): Carrinho | null {
    return this.carrinhoSubject.value;
  }
}
