import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/acesso`;

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha });
  }

  registrar(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, dados);
  }

  validar(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar`);
  }
}
