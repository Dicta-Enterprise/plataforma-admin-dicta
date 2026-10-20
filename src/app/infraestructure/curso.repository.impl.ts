import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Curso } from '@class/cursos/Curso.class';
import { environment } from '@environments/environment';
import { CursoRepository, CursosResponse } from 'src/app/repositories/curso.repository';

type CursosApiResponse =
  | CursosResponse
  | Curso[]
  | { data: Curso[]; count: number }
  | { data?: { _value?: Curso[]; count?: number } }
  | null
  | undefined;

const isCursosResponse = (value: unknown): value is CursosResponse => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { items?: unknown; total?: unknown };
  return Array.isArray(candidate.items) && typeof candidate.total === 'number';
};

const isCursosArray = (value: unknown): value is Curso[] => Array.isArray(value);

const isCursosDataResponse = (
  value: unknown
): value is { data: Curso[]; count: number } => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { data?: unknown; count?: unknown };
  return Array.isArray(candidate.data) && typeof candidate.count === 'number';
};

const isResultWrapper = (
  value: unknown
): value is { data?: { _value?: Curso[]; count?: number } } => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as { data?: unknown };
  if (!candidate.data || typeof candidate.data !== 'object') return false;
  const inner = candidate.data as { _value?: unknown };
  return Array.isArray(inner._value);
};

type NombresApiResponse = { data?: { _value?: Record<string, unknown>[] } } | null;

const nombresPorId = (
  res: NombresApiResponse,
  armarNombre: (item: Record<string, unknown>) => string
): Map<string, string> =>
  new Map((res?.data?._value ?? []).map((item) => [String(item['id']), armarNombre(item)]));

@Injectable({ providedIn: 'root' })
export class CursoRepositoryImpl implements CursoRepository {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/cursos`;

  constructor(private http: HttpClient) {}

  listarCursosService(page = 0, size = 10, q = ''): Observable<CursosResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (q) params = params.set('q', q);

    return forkJoin([
      this.http.get<CursosApiResponse>(this.apiUrl, { params }),
      this.http
        .get<NombresApiResponse>(`${environment.URL_NEST_BACKEND}/categorias`)
        .pipe(catchError(() => of(null))),
      this.http
        .get<NombresApiResponse>(`${environment.URL_NEST_BACKEND}/profesores`)
        .pipe(catchError(() => of(null))),
    ]).pipe(
      map(([res, categorias, profesores]) => {
        let rawItems: unknown[] = [];
        let total = 0;

        if (isCursosResponse(res)) {
          rawItems = res.items;
          total = res.total;
        } else if (isCursosArray(res)) {
          rawItems = res;
          total = res.length;
        } else if (isCursosDataResponse(res)) {
          rawItems = res.data;
          total = res.count ?? res.data.length;
        } else if (isResultWrapper(res)) {
          rawItems = res.data?._value ?? [];
          total = (res.data?.count as number | undefined) ?? rawItems.length;
        }

        const categoriaNombres = nombresPorId(categorias, (c) => String(c['nombre'] ?? ''));
        const profesorNombres = nombresPorId(profesores, (p) =>
          [p['nombre'], p['apellido_paterno']].filter(Boolean).join(' ')
        );

        return {
          items: rawItems.map((raw) => {
            const curso = Curso.fromJson(raw);
            curso.categoriaNombre ||= categoriaNombres.get(curso.categoriaId) ?? '';
            curso.profesorNombre ||= profesorNombres.get(curso.profesorId) ?? '';
            return curso;
          }),
          total,
        };
      })
    );
  }

  crearCursoService(payload: Partial<Curso> | FormData): Observable<Curso> {
    return this.http
      .post<{ data?: unknown }>(this.apiUrl, payload)
      .pipe(map((res) => Curso.fromJson(res?.data ?? res)));
  }

  actualizarCursoService(id: number | string, payload: Partial<Curso> | FormData): Observable<Curso> {
    return this.http
      .patch<{ data?: { _value?: unknown } }>(`${this.apiUrl}/${id}`, payload)
      .pipe(map((res) => Curso.fromJson(res?.data?._value ?? res?.data ?? res)));
  }

  eliminarCursoService(id: number | string): Observable<Curso> {
    return this.http.delete<unknown>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response || typeof response !== 'object') {
          return Curso.fromJson(response);
        }

        const wrapper = response as { data?: unknown };
        if (wrapper.data && typeof wrapper.data === 'object') {
          const data = wrapper.data as { _value?: unknown };
          const rawCurso = data._value ?? wrapper.data;
          return Curso.fromJson(rawCurso);
        }

        return Curso.fromJson(response);
      })
    );
  }
}
