import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria } from '@class/categoria/Categoria.class';
import { CategoriaService } from '../categorias/categoria.service';
import { environment } from '@environments/environment';
import { Profesor } from '@class/profesor/Profesor.class';

type ProfesoresApiResponse =
  | Profesor[]
  | { data?: { _value?: Profesor[] } }
  | { data?: Profesor[] }
  | { items?: Profesor[] }
  | null
  | undefined;
type UploadResponse =
  | string
  | {
      data?: { _value?: string; url?: string } | string;
      message?: string;
    };

@Injectable({ providedIn: 'root' })
export class CursoModalDataService {
  private readonly profesoresUrl = `${environment.URL_NEST_BACKEND}/profesores`;
  private readonly uploadCursoUrl = `${environment.URL_NEST_BACKEND}/az-upload/upload/cursos`;

  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly http: HttpClient
  ) {}

  listarCategorias(): Observable<Categoria[]> {
    return this.categoriaService.listarCategorias();
  }

  listarProfesores(): Observable<Profesor[]> {
    return this.http.get<ProfesoresApiResponse>(this.profesoresUrl).pipe(
      map((response) => this.mapProfesores(response))
    );
  }

  subirImagenCurso(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UploadResponse>(this.uploadCursoUrl, formData).pipe(
      map((response) => this.extractUploadUrl(response))
    );
  }

  private mapProfesores(response: ProfesoresApiResponse): Profesor[] {
    if (!response) {
      return [];
    }

    if (Array.isArray(response)) {
      return response.map((profesor) => new Profesor(profesor));
    }

    if (this.hasDirectData(response)) {
      const dataArray = response.data ?? [];
      return dataArray.map((profesor) => new Profesor(profesor));
    }

    if (this.hasWrappedData(response)) {
      const wrapped = response.data._value ?? [];
      return wrapped.map((profesor) => new Profesor(profesor));
    }

    if (this.hasItems(response)) {
      return response.items.map((profesor) => new Profesor(profesor));
    }

    return [];
  }

  private hasDirectData(
    response: Exclude<ProfesoresApiResponse, null | undefined | Profesor[]>
  ): response is { data: Profesor[] } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'data' in response &&
      Array.isArray((response as { data?: unknown }).data)
    );
  }

  private hasWrappedData(
    response: Exclude<ProfesoresApiResponse, null | undefined | Profesor[]>
  ): response is { data: { _value?: Profesor[] } } {
    if (typeof response !== 'object' || response === null || !('data' in response)) {
      return false;
    }

    const data = (response as { data?: { _value?: unknown } }).data;
    return !!data && Array.isArray(data._value);
  }

  private hasItems(
    response: Exclude<ProfesoresApiResponse, null | undefined | Profesor[]>
  ): response is { items: Profesor[] } {
    return (
      typeof response === 'object' &&
      response !== null &&
      'items' in response &&
      Array.isArray((response as { items?: unknown }).items)
    );
  }

  private extractUploadUrl(response: UploadResponse): string {
    const candidate =
      typeof response === 'object' && response !== null
        ? (response as { data?: unknown }).data ?? response
        : response;

    if (typeof candidate === 'string') {
      return candidate;
    }

    if (
      candidate &&
      typeof candidate === 'object' &&
      '_value' in candidate &&
      typeof (candidate as { _value?: unknown })._value === 'string'
    ) {
      return (candidate as { _value: string })._value;
    }

    if (
      candidate &&
      typeof candidate === 'object' &&
      'url' in candidate &&
      typeof (candidate as { url?: unknown }).url === 'string'
    ) {
      return (candidate as { url: string }).url;
    }

    throw new Error('No se pudo obtener la URL de la imagen subida');
  }
}
