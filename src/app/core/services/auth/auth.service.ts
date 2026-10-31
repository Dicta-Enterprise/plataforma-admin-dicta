import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginRespuesta {
  message: string;
}

// La sesión vive en una cookie httpOnly que pone back-auth-dicta -- este servicio no la lee ni
// la guarda él mismo, solo hace la llamada (el interceptor global ya manda withCredentials).
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.URL_NEST_AUTH}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginRespuesta> {
    return this.http.post<LoginRespuesta>(`${this.apiUrl}/login`, payload);
  }
}
