import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Curso } from '@class/cursos/Curso.class';
import { CursoService } from 'src/app/core/services/cursos/curso.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CursoFacade {
  cursos$ = new BehaviorSubject<Curso[]>([]);
  curso$ = new BehaviorSubject<Curso>(new Curso());

  constructor(private readonly cursoService: CursoService) {}

  listarCursos(page = 0, size = 10, q = ''): void {
    this.cursoService
      .listarCursos(page, size, q)
      .subscribe({
        next: (response) => this.cursos$.next(response?.items ?? []),
        error: () => this.cursos$.next([]),
      });
  }

  crearCurso(payload: Partial<Curso>): Observable<Curso> {
    return this.cursoService.crearCurso(payload).pipe(
      tap((cursoCreado) => {
        const cursosActualizados = [
          new Curso(cursoCreado),
          ...this.cursos$.value,
        ];
        this.cursos$.next(cursosActualizados);
      })
    );
  }

  actualizarCurso(id: string, payload: Partial<Curso>): Observable<Curso> {
    return this.cursoService.actualizarCurso(id, payload).pipe(
      tap((cursoActualizado) => {
        const cursos = this.cursos$.value.map((curso) =>
          curso.id === cursoActualizado.id ? new Curso(cursoActualizado) : curso
        );
        this.cursos$.next(cursos);
      })
    );
  }

  actualizarEstado(id: string, estado: boolean): Observable<Curso> {
    return this.cursoService.eliminarCurso(id).pipe(
      tap((cursoActualizado) => {
        const estadoActualizado =
          typeof cursoActualizado?.estado === 'boolean' ? cursoActualizado.estado : estado;

        const cursos = this.cursos$.value.map((curso) =>
          curso.id === id
            ? Object.assign(new Curso(), curso, { estado: estadoActualizado })
            : curso
        );
        this.cursos$.next(cursos);
      })
    );
  }
}
