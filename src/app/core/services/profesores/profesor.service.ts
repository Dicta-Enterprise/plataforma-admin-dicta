import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

export interface ProfesorOpcion {
  id: string;
  nombre: string;
}

interface ProfesoresApiResponse {
  data?: { _value?: Record<string, unknown>[] };
}

@Injectable({ providedIn: 'root' })
export class ProfesorService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/profesores`;

  constructor(private readonly http: HttpClient) {}

  listarProfesores(): Observable<ProfesorOpcion[]> {
    return this.http.get<ProfesoresApiResponse>(this.apiUrl).pipe(
      map((res) =>
        (res?.data?._value ?? []).map((p) => ({
          id: String(p['id']),
          nombre: [p['nombre'], p['apellido_paterno'], p['apellido_materno']]
            .filter(Boolean)
            .join(' '),
        }))
      )
    );
  }
}
