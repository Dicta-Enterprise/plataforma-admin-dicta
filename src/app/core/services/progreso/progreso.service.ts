import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';

export interface FilaProgreso {
  familia: string;
  familiaCodigo: string;
  familiaUuid: string;
  // El padre/tutor no genera progreso propio (no consume cursos con seguimiento xAPI, solo
  // compra para sus hijos) -- se muestra igual quién es, como contexto, ya que es la persona
  // de contacto/quien compró el curso.
  padreNombre: string;
  padreId: string;
  padreCodigo: string;
  padreUuid: string;
  estudiante: string;
  estudianteId: string;
  // codigo/uuid: mismo ID que en Usuarios, para buscar con el mismo dato en toda la plataforma.
  estudianteCodigo: string;
  estudianteUuid: string;
  categoria: string;
  curso: string;
  moduloActual: string;
  moduloTotal: number;
  moduloActualNum: number;
  videoPct: number;
  quiz: string;
  pistas: number;
  estado: string;
  ultimaActividad: string;
}

export interface FiltrosProgreso {
  busqueda?: string;
  id?: string;
  categoria?: string;
  estado?: string;
}

// Forma real que devuelve GET /progreso (rama back-nest feature/resumen-progreso-xapi) --
// familias -> estudiantes -> cursos -> módulos, anidado. No es la lista plana que se había
// supuesto al construir esta pantalla antes de que existiera el endpoint real.
interface ModuloResumenApi {
  moduloId: string;
  nombre: string;
  orden: number;
  estado: string;
  porcentajeVideo: number;
  quiz: { puntaje: number | null; total: number | null; aprobado: boolean } | null;
  pistasUsadas: number;
  ultimaActividad: string | null;
  completadoEn: string | null;
}

interface CursoResumenApi {
  cursoId: string;
  cursoNombre: string;
  modulosCompletados: number;
  totalModulos: number;
  porcentaje: number;
  modulos: ModuloResumenApi[];
}

interface EstudianteResumenApi {
  idusuario: number;
  uuid: string;
  codigo: string;
  alias: string | null;
  tipocuenta: string;
  ultimaActividad: string | null;
  cursos: CursoResumenApi[];
}

interface FamiliaResumenApi {
  id: number;
  uuid: string;
  codigo: string;
  nombre: string | null;
  padre: { id: number; uuid: string; codigo: string; username: string };
  estudiantes: EstudianteResumenApi[];
}

interface ResumenProgresoApi {
  data: {
    kpis: unknown;
    familias: FamiliaResumenApi[];
  };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ProgresoService {
  private readonly apiUrl = `${environment.URL_NEST_BACKEND}/progreso`;

  constructor(private readonly http: HttpClient) {}

  listar(filtros: FiltrosProgreso): Observable<FilaProgreso[]> {
    // OJO: el endpoint real (ConsultarProgresoDto) solo acepta "desde"/"hasta" -- el
    // ValidationPipe del backend tiene whitelist+forbidNonWhitelisted, así que CUALQUIER otro
    // parámetro (categoria, estado, busqueda, id) hace que rechace todo con 400. No se manda
    // ningún parámetro todavía (los filtros de fecha no están expuestos en esta pantalla);
    // los demás se aplican en el navegador.
    return this.http.get<ResumenProgresoApi>(this.apiUrl).pipe(
      map((respuesta) => this.aplanar(respuesta.data.familias)),
      map((filas) => this.filtrarEnCliente(filas, filtros)),
    );
  }

  private filtrarEnCliente(filas: FilaProgreso[], filtros: FiltrosProgreso): FilaProgreso[] {
    return filas.filter((fila) => {
      if (filtros.busqueda) {
        const texto = filtros.busqueda.toLowerCase();
        if (!fila.familia.toLowerCase().includes(texto) && !fila.estudiante.toLowerCase().includes(texto)) {
          return false;
        }
      }
      // "id" acepta el id numérico crudo, el código (USR-N-032, FAM-014...) o el uuid completo,
      // de estudiante o de familia -- mismo criterio que el filtro de ID en Usuarios.
      if (filtros.id) {
        const buscado = filtros.id.trim().toLowerCase();
        const coincide = [fila.estudianteId, fila.estudianteCodigo, fila.estudianteUuid, fila.familiaCodigo, fila.familiaUuid]
          .some((valor) => valor?.toLowerCase() === buscado);
        if (!coincide) return false;
      }
      if (filtros.categoria && fila.categoria !== filtros.categoria) return false;
      if (filtros.estado && fila.estado !== filtros.estado) return false;
      return true;
    });
  }

  // Por cada estudiante+curso arma UNA fila, con el módulo en el que está ahora mismo (el
  // primero que no esté completado, o el último si ya completó todos) -- "Progreso del
  // módulo" es justo eso: dónde está, no un listado de cada módulo por separado.
  // Los filtros de id/categoria/estado los aplicamos aquí (no hay endpoint para eso todavía)
  // -- "id" busca tanto en el id de familia como en el de estudiante.
  private aplanar(familias: FamiliaResumenApi[]): FilaProgreso[] {
    const filas: FilaProgreso[] = [];

    for (const familia of familias) {
      for (const estudiante of familia.estudiantes) {
        for (const curso of estudiante.cursos) {
          // Prioridad: 1) un módulo con el quiz reprobado (lo más urgente de ver para un
          // admin/padre) 2) el primero que no esté completado (dónde va ahora) 3) el último,
          // si ya completó todo. Sin este orden, un módulo reprobado podía quedar "tapado" por
          // el siguiente módulo (ya en curso, pero sin nada interesante que mostrar todavía).
          const moduloActual =
            curso.modulos.find((m) => m.quiz?.aprobado === false) ??
            curso.modulos.find((m) => m.estado !== 'COMPLETADO') ??
            curso.modulos[curso.modulos.length - 1];
          if (!moduloActual) continue;

          // El backend no tiene un estado "REPROBADO" propio -- un módulo con el quiz
          // reprobado igual queda como COMPLETADO (el estudiante sí vio todo el módulo).
          // Se arma aquí para que el filtro "Reprobó quiz" siga teniendo sentido en la tabla.
          const reprobado = moduloActual.quiz?.aprobado === false;

          filas.push({
            familia: familia.nombre ?? familia.padre.username,
            familiaCodigo: familia.codigo,
            familiaUuid: familia.uuid,
            padreNombre: familia.padre.username,
            padreId: String(familia.padre.id),
            padreCodigo: familia.padre.codigo,
            padreUuid: familia.padre.uuid,
            estudiante: estudiante.alias ?? `Usuario ${estudiante.idusuario}`,
            estudianteId: String(estudiante.idusuario),
            estudianteCodigo: estudiante.codigo,
            estudianteUuid: estudiante.uuid,
            categoria: estudiante.tipocuenta,
            curso: curso.cursoNombre,
            moduloActual: moduloActual.nombre,
            moduloTotal: curso.totalModulos,
            moduloActualNum: moduloActual.orden,
            videoPct: moduloActual.porcentajeVideo,
            quiz: moduloActual.quiz ? `${moduloActual.quiz.puntaje}/${moduloActual.quiz.total}` : '—',
            pistas: moduloActual.pistasUsadas,
            estado: reprobado ? 'REPROBADO' : moduloActual.estado,
            ultimaActividad: moduloActual.ultimaActividad ?? estudiante.ultimaActividad ?? '',
          });
        }
      }
    }

    return filas;
  }
}
