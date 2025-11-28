import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../../core/models/usuario';
import { Pedido } from '../../../core/models/pedido';

export interface Endereco {
  id?: number;
  usuarioId?: number;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // Métodos de Dados do Usuário
  getDados(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`);
  }

  atualizarDados(dados: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/perfil`, dados);
  }

  alterarSenha(senhaAtual: string, novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/perfil/senha`, {
      senhaAtual,
      novaSenha,
    });
  }

  // Métodos de Endereços
  getEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.apiUrl}/perfil/enderecos`);
  }

  getEndereco(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiUrl}/perfil/enderecos/${id}`);
  }

  adicionarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.apiUrl}/perfil/enderecos`, endereco);
  }

  atualizarEndereco(id: number, endereco: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(`${this.apiUrl}/perfil/enderecos/${id}`, endereco);
  }

  removerEndereco(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/perfil/enderecos/${id}`);
  }

  definirEnderecoPrincipal(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/perfil/enderecos/${id}/principal`, {});
  }

  // Métodos de Pedidos
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/perfil/pedidos`);
  }

  getPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/perfil/pedidos/${id}`);
  }

  cancelarPedido(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/perfil/pedidos/${id}/cancelar`, {});
  }

  // Método de busca de CEP (pode usar API externa como ViaCEP)
  buscarCep(cep: string): Observable<any> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  }
}
