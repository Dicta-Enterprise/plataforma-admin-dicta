import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Categoria } from '@class/categoria/Categoria.class';
import { Profesor } from '@class/profesor/Profesor.class';
import { environment } from '@environments/environment';

type ProfesoresApiResponse =
  | Profesor[]
  | { data?: { _value?: Profesor[] } | Profesor[] }
  | { items?: Profesor[] }
  | null
  | undefined;

type CategoriasApiResponse =
  | Categoria[]
  | { data?: { _value?: Categoria[] } | Categoria[] }
  | { items?: Categoria[] }
  | null
  | undefined;

@Injectable({ providedIn: 'root' })
export class CursoModalDataService {
  private readonly categoriasUrl = `${environment.URL_NEST_BACKEND}/categorias`;
  private readonly profesoresUrl = `${environment.URL_NEST_BACKEND}/profesores`;

  constructor(private readonly http: HttpClient) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<CategoriasApiResponse>(this.categoriasUrl).pipe(
      map((response) => this.mapCategorias(response))
    );
  }

  listarProfesores(): Observable<Profesor[]> {
    return this.http.get<ProfesoresApiResponse>(this.profesoresUrl).pipe(
      map((response) => this.mapProfesores(response))
    );
  }

  private mapCategorias(response: CategoriasApiResponse): Categoria[] {
    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response.map((categoria) => new Categoria(categoria));
    }

    const data = this.extractCollection<Categoria>(response);
    return data.map((categoria) => new Categoria(categoria));
  }

  private mapProfesores(response: ProfesoresApiResponse): Profesor[] {
    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response.map((profesor) => new Profesor(profesor));
    }

    const data = this.extractCollection<Profesor>(response);
    return data.map((profesor) => new Profesor(profesor));
  }

  private extractCollection<T extends object>(
    response:
      | { data?: { _value?: T[] } | T[] }
      | { items?: T[] }
      | null
      | undefined
  ): T[] {
    if (!response || typeof response !== 'object') {
      return [];
    }

    if ('items' in response && Array.isArray(response.items)) {
      return response.items as T[];
    }

    if ('data' in response) {
      const data = (response as { data?: { _value?: T[] } | T[] }).data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === 'object' && Array.isArray(data._value)) {
        return data._value;
      }
    }

    return [];
  }
}
