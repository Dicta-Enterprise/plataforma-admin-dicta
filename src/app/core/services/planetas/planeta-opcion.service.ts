import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, catchError, map, of } from 'rxjs';

export interface PlanetaOpcion {
  id: string;
  nombre: string;
  codigo: string;
  categoria: string;
  galaxia: string;
  etiqueta: string;
}

interface PlanetasApiResponse {
  data?: Record<string, unknown>[] | { _value?: Record<string, unknown>[] };
}

/** Lista liviana de planetas para el desplegable del formulario de curso. */
@Injectable({ providedIn: 'root' })
export class PlanetaOpcionService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/planetas`;

  constructor(private readonly http: HttpClient) {}

  listarPlanetas(): Observable<PlanetaOpcion[]> {
    return this.http.get<PlanetasApiResponse>(`${this.apiUrl}?limit=1000&page=1`).pipe(
      map((res) => {
        const datos = Array.isArray(res?.data) ? res.data : (res?.data?._value ?? []);
        return datos.map((p) => {
          const nombre = String(p['nombre'] ?? '');
          const codigo = String(p['codigo'] ?? '');
          const galaxia = String(p['galaxia'] ?? '');
          return {
            id: String(p['id']),
            nombre,
            codigo,
            categoria: String(p['categoria'] ?? ''),
            galaxia,
            etiqueta: `${nombre} · ${galaxia} (${codigo})`,
          };
        });
      }),
      // la API responde 400 cuando todavía no hay planetas activos: el desplegable queda vacío
      catchError(() => of([] as PlanetaOpcion[]))
    );
  }
}
