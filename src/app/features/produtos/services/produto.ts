import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Produto } from '../../../core/models/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/produtos`;

  listarTodos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  listarDestaques(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/destaques`);
  }

  buscarPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/categoria/${categoria}`);
  }

  buscarPorNome(nome: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/buscar?nome=${nome}`);
  }
}
