import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  userId: number;
  nome: string;
  email: string;
}

interface RegistroResponse {
  token: string;
  usuario: {
    userId: number;
    nome: string;
    email: string;
  };
}

interface Usuario {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private apiUrl = `${environment.apiUrl}/acesso`;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.storage.saveToken(response.token);
        this.storage.saveUser(response);
      })
    );
  }

  registrar(usuario: Usuario): Observable<RegistroResponse> {
    return this.http.post<RegistroResponse>(`${this.apiUrl}/registro`, usuario).pipe(
      tap((response) => {
        if (response.token) {
          this.storage.saveToken(response.token);
          this.storage.saveUser(response.usuario);
        }
      })
    );
  }

  logout(): void {
    this.storage.clear();
  }

  isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }

  getUsuario(): any {
    return this.storage.getUser();
  }

  validarToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar`);
  }
}
