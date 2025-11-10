import { Curso } from '@class/cursos/Curso.class';
import { Observable } from 'rxjs';

export interface CursosResponse {
  items: Curso[];
  total: number;
}

export interface CursoRepository {
  listarCursosService(page?: number, size?: number, q?: string): Observable<CursosResponse>;
  crearCursoService(payload: Partial<Curso>): Observable<Curso>;
  actualizarCursoService(id: number | string, payload: Partial<Curso>): Observable<Curso>;
  eliminarCursoService(id: number | string): Observable<Curso>;
}

