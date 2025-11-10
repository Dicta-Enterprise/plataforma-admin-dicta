import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '@class/cursos/Curso.class';
import { CursoRepository, CursosResponse } from 'src/app/repositories/curso.repository';
import { CURSO_REPOSITORY } from '../../tokens/curso.token';

@Injectable({ providedIn: 'root' })
export class CursoService {
  constructor(
    @Inject(CURSO_REPOSITORY)
    private readonly cursoRepository: CursoRepository
  ) {}

  listarCursos(page = 0, size = 10, q = ''): Observable<CursosResponse> {
    return this.cursoRepository.listarCursosService(page, size, q);
  }

  crearCurso(payload: Partial<Curso>): Observable<Curso> {
    return this.cursoRepository.crearCursoService(payload);
  }

  actualizarCurso(id: number | string, payload: Partial<Curso>): Observable<Curso> {
    return this.cursoRepository.actualizarCursoService(id, payload);
  }

  eliminarCurso(id: number | string): Observable<Curso> {
    return this.cursoRepository.eliminarCursoService(id);
  }
}
