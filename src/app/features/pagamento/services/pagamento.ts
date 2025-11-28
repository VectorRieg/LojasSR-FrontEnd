import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Pagamento } from '../../../core/models/pagamento';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pagamentos`;

  criar(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.apiUrl, pagamento);
  }

  buscarPorId(id: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/${id}`);
  }

  listarPorUsuario(usuarioId: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  processar(id: number): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.apiUrl}/${id}/processar`, {});
  }

  confirmar(id: number): Observable<Pagamento> {
    return this.http.put<Pagamento>(`${this.apiUrl}/${id}/confirmar`, {});
  }
}
