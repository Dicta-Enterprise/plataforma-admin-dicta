// Pregunta de opción múltiple de un quiz. Es opcional por módulo (no todos los módulos tienen
// uno). Misma forma que ya existía en la rama de David (feature/usuarios-admin-back-nest,
// puerto 3005) -- "respuestaCorrecta" es el texto exacto de la opción correcta, sin id.
export interface QuizPregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

// Módulo (clase/capítulo) de un curso. "esGratis" marca los que se pueden ver sin comprar el
// curso (vista previa) -- el candado/paywall que usa esta bandera vive en el sitio del LMS de
// cara al estudiante, no en el admin. El id se genera acá al agregar un módulo nuevo.
export interface ModuloCurso {
  id: string;
  nombre: string;
  orden: number;
  esGratis: boolean;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  quizzes?: QuizPregunta[];
}

export class Curso {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date | null;
  fechaInicio: Date | null;
  fechaFinal: Date | null;
  precio: number | null;
  estado: boolean;
  imagen: string;
  resumenDescripcion: string;
  valoracion: number | null;
  duracionSemanas: number | null;
  duracionEstimadaMinutos: number | null;
  categoriaId: string;
  profesorId: string;
  planetaId: string;
  categoriaNombre: string;
  profesorNombre: string;
  beneficios: { titulo: string; descripcion: string }[];
  modulos: ModuloCurso[];

  constructor(curso: Partial<Curso> = {}) {
    this.id = curso.id ?? '';
    this.nombre = curso.nombre ?? '';
    this.descripcion = curso.descripcion ?? '';
    this.fechaCreacion = curso.fechaCreacion ?? null;
    this.fechaInicio = curso.fechaInicio ?? null;
    this.fechaFinal = curso.fechaFinal ?? null;
    this.precio = curso.precio ?? null;
    this.estado = curso.estado ?? false;
    this.imagen = curso.imagen ?? '';
    this.resumenDescripcion = curso.resumenDescripcion ?? '';
    this.valoracion = curso.valoracion ?? null;
    this.duracionSemanas = curso.duracionSemanas ?? null;
    this.duracionEstimadaMinutos = curso.duracionEstimadaMinutos ?? null;
    this.categoriaId = curso.categoriaId ?? '';
    this.profesorId = curso.profesorId ?? '';
    this.planetaId = curso.planetaId ?? '';
    this.categoriaNombre = curso.categoriaNombre ?? '';
    this.profesorNombre = curso.profesorNombre ?? '';
    this.beneficios = Array.isArray(curso.beneficios)
      ? curso.beneficios.map((beneficio) => Curso.mapBeneficio(beneficio))
      : [];
    this.modulos = Array.isArray(curso.modulos) ? curso.modulos : [];
  }

  static fromJson(raw: unknown): Curso {
    if (!raw || typeof raw !== 'object') {
      return new Curso();
    }

    const data = raw as Record<string, unknown>;

    const beneficios = Array.isArray(data['beneficios'])
      ? (data['beneficios'] as Record<string, unknown>[]).map((beneficio) => Curso.mapBeneficio(beneficio))
      : [];

    const modulos = Array.isArray(data['modulos'])
      ? (data['modulos'] as Record<string, unknown>[]).map((modulo) => Curso.mapModulo(modulo))
      : [];

    return new Curso({
      id: Curso.toString(data['id']),
      nombre: Curso.toString(data['nombre']),
      descripcion: Curso.toString(data['descripcion']),
      fechaCreacion: Curso.parseDate(data['fechaCreacion']),
      fechaInicio: Curso.parseDate(data['fechaInicio']),
      fechaFinal: Curso.parseDate(data['fechaFinal'] ?? data['fechaFinalizacion']),
      precio: Curso.toNumber(data['precio']),
      estado: Curso.toBoolean(data['estado']),
      imagen: Curso.toString(data['imagen']),
      resumenDescripcion: Curso.toString(data['resumenDescripcion']),
      valoracion: Curso.toNumber(data['valoracion']),
      duracionSemanas: Curso.toNumber(data['duracionSemanas']),
      duracionEstimadaMinutos: Curso.toNumber(data['duracionEstimadaMinutos']),
      categoriaId: Curso.toString(data['categoriaId']),
      profesorId: Curso.toString(data['profesorId']),
      planetaId: Curso.toString(data['planetaId']),
      categoriaNombre: Curso.toString(Curso.getRelacionNombre(data, 'categoria')),
      profesorNombre: Curso.toString(Curso.getRelacionNombre(data, 'profesor')),
      beneficios,
      modulos,
    });
  }

  static toJson(curso: Curso): unknown {
    return {
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      fechaInicio: curso.fechaInicio?.toISOString() ?? null,
      fechaFinal: curso.fechaFinal?.toISOString() ?? null,
      precio: curso.precio,
      estado: curso.estado,
      imagen: curso.imagen,
      duracionSemanas: curso.duracionSemanas,
      duracionEstimadaMinutos: curso.duracionEstimadaMinutos ?? undefined,
      categoriaId: curso.categoriaId,
      profesorId: curso.profesorId,
      planetaId: curso.planetaId || undefined,
      beneficios: curso.beneficios,
      modulos: curso.modulos,
    };
  }

  // Solo para guardar los módulos (endpoint de "Actualizar curso" reutilizado) -- no hace falta
  // reenviar el resto de los campos del curso, el backend los mantiene si no vienen en el body.
  static modulosToJson(modulos: ModuloCurso[]): unknown {
    return { modulos };
  }

  private static parseDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private static toString(value: unknown): string {
    return value === undefined || value === null ? '' : String(value);
  }

  private static toNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  private static toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
  }

  private static mapModulo(value: unknown): ModuloCurso {
    const data = value as Record<string, unknown> | undefined;
    const quizzes = Array.isArray(data?.['quizzes'])
      ? (data['quizzes'] as Record<string, unknown>[]).map((quiz) => Curso.mapQuiz(quiz))
      : undefined;
    return {
      id: Curso.toString(data?.['id']),
      nombre: Curso.toString(data?.['nombre']),
      orden: Curso.toNumber(data?.['orden']) ?? 0,
      esGratis: Curso.toBoolean(data?.['esGratis']),
      bunnyVideoId: data?.['bunnyVideoId'] ? Curso.toString(data['bunnyVideoId']) : undefined,
      bunnyLibraryId: data?.['bunnyLibraryId'] ? Curso.toString(data['bunnyLibraryId']) : undefined,
      quizzes: quizzes?.length ? quizzes : undefined,
    };
  }

  private static mapQuiz(value: unknown): QuizPregunta {
    const data = value as Record<string, unknown> | undefined;
    return {
      pregunta: Curso.toString(data?.['pregunta']),
      opciones: Array.isArray(data?.['opciones']) ? (data['opciones'] as unknown[]).map((o) => Curso.toString(o)) : [],
      respuestaCorrecta: Curso.toString(data?.['respuestaCorrecta']),
    };
  }

  private static mapBeneficio(value: unknown): { titulo: string; descripcion: string } {
    const data = value as Record<string, unknown> | undefined;
    return {
      titulo: Curso.toString(data?.['titulo']),
      descripcion: Curso.toString(data?.['descripcion']),
    };
  }

  private static getRelacionNombre(
    data: Record<string, unknown>,
    relacion: string
  ): unknown {
    const relacionData = data[relacion] as Record<string, unknown> | undefined;
    return relacionData?.['nombre'];
  }
}



